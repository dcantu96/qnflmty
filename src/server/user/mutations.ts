'use server'

import { auth, protectedAuth } from '~/lib/auth'
import {
	groups,
	memberships,
	requests,
	userAccounts,
	type AvatarIcon,
} from '../db/schema'
import { db } from '../db'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const avatarEnum = z.enum(userAccounts.avatar.enumValues)

const createUserAccountParams = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.max(20, 'Username must be 20 characters or less')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'Username can only contain letters, numbers, underscores, and hyphens',
		),
	avatar: avatarEnum,
})

export const createUserAccount = protectedAuth(
	async (input: z.infer<typeof createUserAccountParams>) => {
		const {
			user: { id: userId },
		} = await auth()
		const parsedInput = createUserAccountParams.parse(input)
		const { username, avatar } = parsedInput

		const existingAccount = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.username, username.toLowerCase()),
		})

		if (existingAccount) {
			throw new Error('Username already taken')
		}

		const [newUserAccount] = await db
			.insert(userAccounts)
			.values({
				userId,
				username: username.toLowerCase(),
				avatar,
			})
			.returning()

		if (!newUserAccount) {
			throw new Error('Failed to create profile')
		}

		return newUserAccount
	},
)

const updateUserAccountParams = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.max(20, 'Username must be 20 characters or less')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'Username can only contain letters, numbers, underscores, and hyphens',
		)
		.optional(),
	avatar: avatarEnum.optional(),
})

export const updateUserAccount = protectedAuth(
	async (id: number, input: z.infer<typeof updateUserAccountParams>) => {
		const {
			user: { id: userId },
		} = await auth()
		const parsedInput = updateUserAccountParams.parse(input)
		const { username, avatar } = parsedInput

		const existingAccount = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.id, id),
		})

		if (!existingAccount) {
			throw new Error('Profile not found')
		}

		if (existingAccount.userId !== userId) {
			throw new Error('You can only update your own profiles')
		}

		if (username && username.toLowerCase() !== existingAccount.username) {
			const usernameTaken = await db.query.userAccounts.findFirst({
				where: eq(userAccounts.username, username.toLowerCase()),
			})

			if (usernameTaken) {
				throw new Error('Username already taken')
			}
		}

		const [updatedAccount] = await db
			.update(userAccounts)
			.set({
				username: username ? username.toLowerCase() : existingAccount.username,
				avatar: avatar || existingAccount.avatar,
			})
			.where(eq(userAccounts.id, id))
			.returning()

		if (!updatedAccount) {
			throw new Error('Failed to update profile')
		}

		return updatedAccount
	},
)

export const createRequest = async (
	_initialState: unknown,
	formData: FormData,
) => {
	const {
		user: { id },
	} = await auth()

	const groupId = Number(formData.get('groupId'))
	const userAccountId = Number(formData.get('userAccountId'))

	const userAccount = await db.query.userAccounts.findFirst({
		where: eq(userAccounts.id, userAccountId),
	})

	if (!userAccount) {
		return { error: 'User account not found' }
	}

	if (userAccount.userId !== id) {
		return { error: 'You can only make requests with your own profiles' }
	}

	const group = await db.query.groups.findFirst({
		where: and(
			eq(groups.id, groupId),
			eq(groups.joinable, true),
			eq(groups.finished, false),
		),
	})

	if (!group) {
		return { error: 'Group not found' }
	}

	// Check if request already exists
	const existingRequest = await db.query.requests.findFirst({
		where: and(
			eq(requests.groupId, groupId),
			eq(requests.userAccountId, userAccountId),
		),
	})

	if (existingRequest) {
		return { error: 'You have already requested access to this group' }
	}

	await db.insert(requests).values({
		groupId,
		userAccountId,
	})

	revalidatePath(`/request-access/${userAccount.username}`)
}

export async function setSelectedProfile(profileId: number) {
	const session = await auth()

	const profile = await db.query.userAccounts.findFirst({
		where: (accounts, { and, eq }) =>
			and(eq(accounts.id, profileId), eq(accounts.userId, session.user.id)),
	})

	if (!profile) {
		throw new Error('Profile not found or access denied')
	}

	const cookieStore = await cookies()
	cookieStore.set('selectedProfile', profileId.toString(), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30, // 30 days
	})

	revalidatePath('/dashboard')
}

export async function selectProfileAndRedirect(profileId: number) {
	await setSelectedProfile(profileId)
	redirect('/dashboard')
}

export async function selectProfileAction(formData: FormData) {
	const profileId = Number.parseInt(formData.get('profileId') as string, 10)
	await selectProfileAndRedirect(profileId)
}

export async function clearSelectedProfile() {
	const cookieStore = await cookies()
	cookieStore.delete('selectedProfile')
}

export async function createProfileAction(
	_prevState: { error?: string } | null,
	formData: FormData,
) {
	const { user } = await auth()

	const username = formData.get('username') as string
	const avatar = formData.get('avatar') as AvatarIcon

	// Server-side validation
	if (!username || typeof username !== 'string') {
		return { error: 'Username is required' }
	}

	const trimmedUsername = username.trim()

	if (trimmedUsername.length === 0) {
		return { error: 'Username is required' }
	}

	if (trimmedUsername.length > 20) {
		return { error: 'Username must be 20 characters or less' }
	}

	if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
		return {
			error:
				'Username can only contain letters, numbers, underscores, and hyphens',
		}
	}

	let newAccount: typeof userAccounts.$inferSelect | undefined

	try {
		// Check if username already exists (case insensitive)
		const existingAccount = await db.query.userAccounts.findFirst({
			where: (accounts, { sql }) =>
				sql`lower(${accounts.username}) = lower(${trimmedUsername})`,
		})

		if (existingAccount) {
			return { error: 'Username is already taken' }
		}

		const result = await db
			.insert(userAccounts)
			.values({
				userId: user.id,
				username: trimmedUsername,
				avatar,
			})
			.returning()

		newAccount = result[0]

		if (!newAccount) {
			return { error: 'Failed to create profile' }
		}

		const activeGroup = await db.query.groups.findFirst({
			columns: {
				id: true,
			},
			where: (groups, { and, eq }) =>
				and(eq(groups.joinable, true), eq(groups.finished, false)),
		})

		if (activeGroup) {
			if (user.admin) {
				await db.insert(memberships).values({
					userAccountId: newAccount.id,
					groupId: activeGroup.id,
				})
			} else {
				await db.insert(requests).values({
					userAccountId: newAccount.id,
					groupId: activeGroup.id,
				})
			}
		}
	} catch (error) {
		if (error instanceof Error && error.message.includes('unique constraint')) {
			return { error: 'Username is already taken' }
		}

		return { error: 'Something went wrong creating your profile' }
	}

	await setSelectedProfile(newAccount.id)
	if (user.admin) {
		redirect('/dashboard')
	} else {
		redirect(`/request-access/${newAccount.username}`)
	}
}
