import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from '~/server/trpc'
import { groups, tournaments } from '~/server/db/schema'
import { db } from '~/server/db'

export const groupsRouter = createTRPCRouter({
	// Get all active/joinable groups
	getActive: publicProcedure.query(async () => {
		const activeGroups = await db
			.select({
				id: groups.id,
				name: groups.name,
				tournamentId: groups.tournamentId,
				joinable: groups.joinable,
				finished: groups.finished,
			})
			.from(groups)
			.where(and(eq(groups.joinable, true), eq(groups.finished, false)))

		return activeGroups
	}),

	// Get active group with tournament info
	getActiveWithTournament: publicProcedure.query(async () => {
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

		return activeGroup[0] || null
	}),
})
