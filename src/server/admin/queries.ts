import { db } from '../db'
import { z } from 'zod'
import { count, ilike } from 'drizzle-orm'
import { sports, tournaments } from '../db/schema'
import { adminAuth } from '~/lib/auth'

const inputParams = z
	.object({
		page: z.number().min(1).default(1),
		limit: z.number().min(1).max(100).default(10),
		search: z.string().optional(),
	})
	.optional()

export const getTournaments = adminAuth(
	async (input?: z.infer<typeof inputParams>) => {
		const { page = 1, limit = 10, search } = input || {}
		const offset = (page - 1) * limit
		const where = search ? ilike(tournaments.name, `%${search}%`) : undefined

		const tournamentsList = await db.query.tournaments.findMany({
			where,
			with: {
				sport: {
					columns: {
						name: true,
					},
				},
			},
			columns: {
				id: true,
				name: true,
				createdAt: true,
				year: true,
			},
			orderBy: (tournaments, { desc }) => [desc(tournaments.createdAt)],
			limit,
			offset,
		})

		const totalResult = await db
			.select({ value: count() })
			.from(tournaments)
			.where(where)
		const total = totalResult[0]?.value ?? 0

		return {
			items: tournamentsList,
			total: total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	},
)

export const getSports = adminAuth(
	async (input?: z.infer<typeof inputParams>) => {
		const { page = 1, limit = 10, search } = input || {}
		const offset = (page - 1) * limit
		const where = search ? ilike(sports.name, `%${search}%`) : undefined

		const sportsList = await db.query.sports.findMany({
			where,
			columns: {
				id: true,
				name: true,
			},
			orderBy: (sports, { asc }) => [asc(sports.name)],
			limit,
			offset,
		})

		const totalResult = await db
			.select({ value: count() })
			.from(sports)
			.where(where)
		const total = totalResult[0]?.value ?? 0

		return {
			items: sportsList,
			total: total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	},
)

export const getTournamentById = adminAuth(async (id: number) => {
	const tournament = await db.query.tournaments.findFirst({
		where: (tournaments, { eq }) => eq(tournaments.id, id),
		with: {
			sport: {
				columns: {
					name: true,
				},
			},
		},
	})

	return tournament
})

export const getSportById = adminAuth(async (id: number) => {
	const sport = await db.query.sports.findFirst({
		where: (sports, { eq }) => eq(sports.id, id),
	})

	return sport
})
