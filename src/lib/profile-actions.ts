'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth, isAdminSession } from '~/lib/auth'
import { db } from '~/server/db'
import {
	userAccounts,
	groups,
	type AvatarIcon,
	memberships,
	requests,
} from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

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

	// Revalidate the dashboard to pick up the new profile
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

export async function getSelectedProfile(): Promise<
	| {
			id: number
			userId: number
			username: string
			avatar: AvatarIcon
			createdAt: Date
			updatedAt: Date
	  }
	| undefined
> {
	const session = await auth()
	const cookieStore = await cookies()
	const selectedProfileId = cookieStore.get('selectedProfile')?.value

	if (!selectedProfileId) {
		return undefined
	}

	const profileId = Number.parseInt(selectedProfileId, 10)
	const profile = await db.query.userAccounts.findFirst({
		where: (accounts, { and, eq }) =>
			and(eq(accounts.id, profileId), eq(accounts.userId, session.user.id)),
	})

	if (!profile) {
		return undefined
	}

	return profile
}

export async function clearSelectedProfile() {
	const cookieStore = await cookies()
	cookieStore.delete('selectedProfile')
}

// Check if the selected profile has membership in the active group
export async function checkProfileGroupMembership(
	profileId: number,
): Promise<boolean> {
	// Get the active group
	const activeGroup = await db
		.select({
			id: groups.id,
		})
		.from(groups)
		.where(and(eq(groups.joinable, true), eq(groups.finished, false)))
		.limit(1)

	const activeGroupData = activeGroup[0]
	if (!activeGroupData) {
		// No active group exists
		return false
	}

	// Check if the profile has membership in the active group
	const membership = await db.query.memberships.findFirst({
		where: (memberships, { and, eq }) =>
			and(
				eq(memberships.userAccountId, profileId),
				eq(memberships.groupId, activeGroupData.id),
				eq(memberships.suspended, false), // Only non-suspended memberships
			),
	})

	return !!membership
}

// Check and redirect if profile doesn't have access to the active group
export async function enforceGroupMembership() {
	const isAdmin = await isAdminSession()
	const profile = await getSelectedProfile()

	if (!profile) {
		// No selected profile, redirect to profile selection
		redirect('/select-profile')
	}

	const hasAccess = await checkProfileGroupMembership(profile.id)

	if (!hasAccess && !isAdmin) {
		// Profile doesn't have access to active group, redirect to request access
		redirect(`/request-access/${profile.username}`)
	}
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
		if (!activeGroup) {
			return { error: 'No active group found' }
		}

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
