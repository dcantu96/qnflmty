import { auth, protectedAuth } from '~/lib/auth'
import { db } from '../db'
import { groups, requests, tournaments, userAccounts } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export const getActiveWithTournament = protectedAuth(async () => {
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
})

export const getRequestsByUserAccountId = protectedAuth(
	async (userAccountId: number) => {
		const { user } = await auth()

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
	},
)
