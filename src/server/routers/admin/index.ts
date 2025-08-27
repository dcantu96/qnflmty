import { z } from 'zod'
import { ilike, count } from 'drizzle-orm'
import { adminProcedure, t } from '~/server/trpc'
import { groups, tournaments } from '~/server/db/schema'
import { db } from '~/server/db'

export const adminRouter = t.router({
	list: adminProcedure
		.input(
			z
				.object({
					page: z.number().min(1).default(1),
					limit: z.number().min(1).max(100).default(10),
					search: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const { page = 1, limit = 10, search } = input || {}
			const offset = (page - 1) * limit
			const where = search ? ilike(tournaments.name, `%${search}%`) : undefined

			const tournamentsList = await db.query.tournaments.findMany({
				where,
				orderBy: (tournaments, { desc }) => [desc(tournaments.createdAt)],
				limit,
				offset,
			})

			const totalResult = await db
				.select({ value: count() })
				.from(groups)
				.where(where)
			const total = totalResult[0]?.value ?? 0

			return {
				items: tournamentsList,
				total: total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			}
		}),
})
