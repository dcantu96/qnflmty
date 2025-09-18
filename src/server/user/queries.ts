'use server'

import { userGuard, isAdminSession } from '~/lib/auth'
import { db } from '../db'
import {
	groups,
	requests,
	tournaments,
	userAccounts,
	type AvatarIcon,
} from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const getActiveWithTournament = async () => {
	await userGuard()
	const activeGroup = await db
		.select({
			id: groups.id,
			name: groups.name,
			tournamentId: groups.tournamentId,
			joinable: groups.joinable,
			finished: groups.finished,
			tournamentName: tournaments.name,
			tournamentYear: tournaments.year,
		})
		.from(groups)
		.innerJoin(tournaments, eq(groups.tournamentId, tournaments.id))
		.where(and(eq(groups.joinable, true), eq(groups.finished, false)))
		.limit(1)

	return activeGroup[0]
}

export const getRequestsByUserAccountId = async (userAccountId: number) => {
	const { user } = await userGuard()

	const userAccount = await db.query.userAccounts.findFirst({
		where: and(
			eq(userAccounts.id, userAccountId),
			eq(userAccounts.userId, user.id),
		),
	})

	if (!userAccount) {
		throw new Error('User account not found')
	}

	const request = await db.query.requests.findMany({
		where: eq(requests.userAccountId, userAccountId),
	})

	return request
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
	const session = await userGuard()
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

async function checkProfileGroupMembership(
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
