'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { db } from '~/server/db'
import { userAccounts, groups, type AvatarIcon } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export async function setSelectedProfile(profileId: number) {
	const session = await useAuthenticatedSession()

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

export async function getSelectedProfile(): Promise<{
	id: number
	userId: number
	username: string
	avatar: AvatarIcon
	createdAt: Date
	updatedAt: Date
} | null> {
	const session = await useAuthenticatedSession()
	const cookieStore = await cookies()
	const selectedProfileId = cookieStore.get('selectedProfile')?.value

	if (!selectedProfileId) {
		return null
	}

	const profileId = Number.parseInt(selectedProfileId, 10)
	const profile = await db.query.userAccounts.findFirst({
		where: (accounts, { and, eq }) =>
			and(eq(accounts.id, profileId), eq(accounts.userId, session.user.id)),
	})

	if (!profile) {
		return null
	}

	// Ensure avatar is always a string, default to 'user' if null
	return {
		...profile,
		avatar: profile.avatar || 'user',
	}
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
	const profile = await getSelectedProfile()

	if (!profile) {
		// No selected profile, redirect to profile selection
		redirect('/select-profile')
	}

	const hasAccess = await checkProfileGroupMembership(profile.id)

	if (!hasAccess) {
		// Profile doesn't have access to active group, redirect to request access
		redirect(`/request-access/${profile.username}`)
	}
}

export async function createProfileAction(
	prevState: { error?: string } | null,
	formData: FormData,
) {
	const session = await useAuthenticatedSession()

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
			where: eq(userAccounts.username, trimmedUsername.toLowerCase()),
		})

		if (existingAccount) {
			return { error: 'Username is already taken' }
		}

		// Create the user account
		const result = await db
			.insert(userAccounts)
			.values({
				userId: session.user.id,
				username: trimmedUsername.toLowerCase(),
				avatar,
			})
			.returning()

		newAccount = result[0]

		if (!newAccount) {
			return { error: 'Failed to create profile' }
		}
	} catch (error) {
		// Handle database constraint violations
		if (error instanceof Error && error.message.includes('unique constraint')) {
			return { error: 'Username is already taken' }
		}

		// Generic error fallback
		return { error: 'Something went wrong creating your profile' }
	}

	// Set the newly created profile as selected and redirect
	// These operations are outside try-catch so redirect() won't be caught
	await setSelectedProfile(newAccount.id)
	redirect(`/request-access/${newAccount.username}`)
}
