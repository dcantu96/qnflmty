'use server'

import { auth, protectedAuth } from '~/lib/auth'
import { groups, requests, userAccounts } from '../db/schema'
import { db } from '../db'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

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

export const createRequest = protectedAuth(
	async (_prevState: string | null, queryData: FormData) => {
		const {
			user: { id: userId },
		} = await auth()

		const groupId = Number(queryData.get('groupId'))
		const userAccountId = Number(queryData.get('userAccountId'))

		const userAccount = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.id, userAccountId),
		})

		if (!userAccount) {
			return 'User account not found'
		}

		if (userAccount.userId !== userId) {
			return 'You can only make requests with your own profiles'
		}

		const group = await db.query.groups.findFirst({
			where: and(
				eq(groups.id, groupId),
				eq(groups.joinable, true),
				eq(groups.finished, false),
			),
		})

		if (!group) {
			return 'Group not found'
		}

		// Check if request already exists
		const existingRequest = await db.query.requests.findFirst({
			where: and(
				eq(requests.groupId, groupId),
				eq(requests.userAccountId, userAccountId),
			),
		})

		if (existingRequest) {
			return 'You have already requested access to this group'
		}

		await db.insert(requests).values({
			groupId,
			userAccountId,
		})

		return 'Request submitted successfully'
	},
)
