import { db } from '../db'
import { z } from 'zod'
import { and, count, eq, ilike } from 'drizzle-orm'
import { groups, sports, teams, tournaments, users, weeks } from '../db/schema'
import { adminAuth } from '~/lib/auth'

const inputParams = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
	search: z.string().optional(),
})

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

		const sportsWithTeams = await Promise.all(
			sportsList.map(async (sport) => {
				const sportTeams = await db.query.teams.findMany({
					where: (teams, { eq }) => eq(teams.sportId, sport.id),
					limit: 5,
				})

				const totalResult = await db
					.select({ value: count() })
					.from(teams)
					.where(eq(teams.sportId, sport.id))

				const totalTeams = totalResult[0]?.value ?? 0

				return { ...sport, teams: sportTeams, totalTeams }
			}),
		)

		const totalResult = await db
			.select({ value: count() })
			.from(sports)
			.where(where)
		const total = totalResult[0]?.value ?? 0

		return {
			items: sportsWithTeams,
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

export const getTeamById = adminAuth(async (id: number) => {
	const team = await db.query.teams.findFirst({
		where: (teams, { eq }) => eq(teams.id, id),
		with: {
			sport: {
				columns: {
					name: true,
					id: true,
				},
			},
		},
	})

	return team
})

export const getSportById = adminAuth(async (id: number) => {
	const sport = await db.query.sports.findFirst({
		where: (sports, { eq }) => eq(sports.id, id),
	})

	return sport
})

export const getUserById = adminAuth(async (id: number) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
	})

	return user
})

const getTeamsBySportIdParams = z.object({
	sportId: z.coerce.number().positive(),
	page: z.coerce.number().min(1).default(1).optional(),
	limit: z.coerce.number().min(1).max(100).default(10).optional(),
	search: z.string().optional(),
})

export const getTeamsBySportId = adminAuth(
	async (input: z.infer<typeof getTeamsBySportIdParams>) => {
		const { page = 1, limit = 10, search } = input || {}
		const offset = (page - 1) * limit
		const where = and(
			eq(teams.sportId, input.sportId),
			search ? ilike(teams.name, `%${search}%`) : undefined,
		)

		const items = await db.query.teams.findMany({
			where,
			orderBy: (teams, { desc }) => [desc(teams.name)],
			limit,
			offset,
		})

		const totalResult = await db
			.select({ value: count() })
			.from(teams)
			.where(where)
		const total = totalResult[0]?.value ?? 0
		const totalPages = Math.ceil(total / limit)

		return {
			items,
			total,
			page,
			limit,
			totalPages,
		}
	},
)

const getWeeksByTournamentIdParams = z.object({
	tournamentId: z.coerce.number().positive(),
	page: z.coerce.number().min(1).default(1).optional(),
	limit: z.coerce.number().min(1).max(100).default(10).optional(),
})

export const getWeeksByTournamentId = adminAuth(
	async (input: z.infer<typeof getWeeksByTournamentIdParams>) => {
		const { tournamentId, page = 1, limit = 10 } = input
		const offset = (page - 1) * limit

		const items = await db.query.weeks.findMany({
			where: (weeks, { eq }) => eq(weeks.tournamentId, tournamentId),
			orderBy: (weeks, { desc }) => [desc(weeks.number)],
			limit,
			offset,
		})

		const totalResult = await db
			.select({ value: count() })
			.from(weeks)
			.where(eq(weeks.tournamentId, tournamentId))
		const total = totalResult[0]?.value ?? 0
		const totalPages = Math.ceil(total / limit)

		return {
			items,
			total,
			page,
			limit,
			totalPages,
		}
	},
)

const getUsersInputParams = z.object({
	page: z.coerce.number().min(1).default(1).optional(),
	limit: z.coerce.number().min(1).max(100).default(10).optional(),
	search: z.string().optional(),
	kind: z.enum(['all', 'suspended']).optional(),
})

export const getUsers = adminAuth(
	async (input?: z.infer<typeof getUsersInputParams>) => {
		const { page = 1, limit = 10, search, kind } = input || {}
		const offset = (page - 1) * limit
		const where = search
			? and(
					kind !== 'all'
						? eq(users.suspended, kind === 'suspended')
						: undefined,
					ilike(users.name, `%${search}%`),
				)
			: kind !== 'all'
				? eq(users.suspended, kind === 'suspended')
				: undefined

		const items = await db.query.users.findMany({
			where,
			columns: {
				name: true,
				id: true,
				createdAt: true,
				email: true,
				phone: true,
			},
			with: {
				userAccounts: {
					columns: {
						id: true,
						username: true,
						avatar: true,
					},
				},
			},
			orderBy: (users, { desc }) => [desc(users.name)],
			limit,
			offset,
		})

		const totalResult = await db
			.select({ value: count() })
			.from(users)
			.where(where)
		const total = totalResult[0]?.value ?? 0
		const totalPages = Math.ceil(total / limit)

		return {
			items,
			total,
			page,
			limit,
			totalPages,
		}
	},
)

export const getGroups = adminAuth(
	async (input?: {
		page?: number
		limit?: number
		kind?: 'all' | 'finished'
	}) => {
		const page = input?.page ?? 1
		const limit = input?.limit ?? 10
		const kind = input?.kind
		const offset = (page - 1) * limit

		const where =
			kind === 'finished'
				? eq(groups.finished, true)
				: kind === 'all'
					? undefined
					: eq(groups.finished, false)

		const items = await db.query.groups.findMany({
			where,
			offset,
			limit,
			orderBy: (groups, { desc }) => [desc(groups.createdAt)],
			with: {
				tournament: true,
			},
		})

		const totalResult = await db
			.select({ value: count() })
			.from(groups)
			.where(where)
		const total = totalResult[0]?.value ?? 0
		const totalPages = Math.ceil(total / limit)

		return {
			items,
			total,
			page,
			limit,
			totalPages,
		}
	},
)

export const getUserDetailsById = adminAuth(async (id: number) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
		with: {
			userAccounts: true,
		},
	})

	return user
})
