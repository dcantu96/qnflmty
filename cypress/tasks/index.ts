import { randomUUID } from 'node:crypto'
import { eq, and } from 'drizzle-orm'
import { getDb } from './cypress-db'
import {
	sessions,
	users,
	userAccounts,
	sports,
	tournaments,
	groups,
	teams,
} from '~/server/db/schema'

export type LoginTaskParams = string
export const login =
	(connectionString: string) => async (email: LoginTaskParams) => {
		const db = getDb(connectionString)

		let user = await db.query.users.findFirst({
			where: eq(users.email, email),
		})

		if (!user) {
			const [newUser] = await db
				.insert(users)
				.values({ email: email, name: 'Cypress User' })
				.returning()
			user = newUser
		}

		if (!user || !user.id) {
			throw new Error('Failed to ensure user for session creation')
		}

		const sessionToken = randomUUID()
		const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
		await db.insert(sessions).values({ sessionToken, userId: user.id, expires })

		return sessionToken
	}

export type CreateUserTaskParams = {
	name: string
	email: string
}
export const createUser =
	(connectionString: string) => async (params: CreateUserTaskParams) => {
		const { name, email } = params
		const db = getDb(connectionString)

		await db.insert(users).values({ email, name, admin: false })

		return null
	}

export type DeleteUserTaskParams = string
export const deleteUser =
	(connectionString: string) => async (email: DeleteUserTaskParams) => {
		const db = getDb(connectionString)

		await db.delete(users).where(eq(users.email, email))

		return null
	}

export interface CreateAdminTaskParams {
	name: string
	email: string
}
export const createAdmin =
	(connectionString: string) => async (params: CreateAdminTaskParams) => {
		const { name, email } = params
		const db = getDb(connectionString)

		await db.insert(users).values({ email, name, admin: true })
		return null
	}

export interface GetUserAccountIdTaskParams {
	email: string
	username: string
}

export const getUserAccountId =
	(connectionString: string) =>
	async (params: GetUserAccountIdTaskParams): Promise<number> => {
		const { email, username } = params
		const db = getDb(connectionString)

		const result = await db
			.select({
				id: userAccounts.id,
			})
			.from(userAccounts)
			.innerJoin(users, eq(userAccounts.userId, users.id))
			.where(and(eq(users.email, email), eq(userAccounts.username, username)))
			.limit(1)

		if (result.length === 0) {
			throw new Error(
				`UserAccount not found for email: ${email} and username: ${username}`,
			)
		}

		const userAccount = result[0]
		if (!userAccount) {
			throw new Error(
				`UserAccount not found for email: ${email} and username: ${username}`,
			)
		}

		return userAccount.id
	}

export interface CreateSportParams {
	name: string
}

export const createSport =
	(connectionString: string) => async (params: CreateSportParams) => {
		const { name } = params
		const db = getDb(connectionString)

		const [sport] = await db.insert(sports).values({ name }).returning()

		if (!sport) {
			throw new Error(`Sport not found for name: ${name}`)
		}

		return sport
	}

export interface CreateTournamentParams {
	name: string
	year: number
	sportId: number
}

export const createTournament =
	(connectionString: string) => async (params: CreateTournamentParams) => {
		const { name, year, sportId } = params
		const db = getDb(connectionString)

		const [tournament] = await db
			.insert(tournaments)
			.values({ name, year, sportId })
			.returning()

		if (!tournament) {
			throw new Error(
				`Tournament not found for name: ${name} and year: ${year}`,
			)
		}

		return tournament
	}

export interface DeleteTournamentParams {
	name: string
}

export const deleteTournament =
	(connectionString: string) => async (params: DeleteTournamentParams) => {
		const { name } = params
		const db = getDb(connectionString)

		await db.delete(tournaments).where(eq(tournaments.name, name))

		return null
	}

export interface DeleteSportParams {
	name: string
}

export const deleteSport =
	(connectionString: string) => async (params: DeleteSportParams) => {
		const { name } = params
		const db = getDb(connectionString)

		await db.delete(sports).where(eq(sports.name, name))

		return null
	}

export interface CreateGroupParams {
	name: string
	joinable: boolean
	tournamentId: number
}

export const createGroup =
	(connectionString: string) => async (params: CreateGroupParams) => {
		const { name, joinable, tournamentId } = params
		const db = getDb(connectionString)

		const [group] = await db
			.insert(groups)
			.values({ name, joinable, tournamentId })
			.returning()

		if (!group) {
			throw new Error(`Group not found for name: ${name}`)
		}

		return group
	}

export interface CreateTeamParams {
	name: string
	shortName: string
	sportId: number
}

export const createTeam =
	(connectionString: string) => async (params: CreateTeamParams) => {
		const { name, shortName, sportId } = params
		const db = getDb(connectionString)

		const [team] = await db
			.insert(teams)
			.values({ name, shortName, sportId })
			.returning()

		if (!team) {
			throw new Error(`Team not found for name: ${name}`)
		}

		return team
	}

export interface DeleteTeamParams {
	name: string
}

export const deleteTeam =
	(connectionString: string) => async (params: DeleteTeamParams) => {
		const { name } = params
		const db = getDb(connectionString)

		await db.delete(teams).where(eq(teams.name, name))

		return null
	}

export interface DeleteGroupParams {
	name: string
}

export const deleteGroup =
	(connectionString: string) => async (params: DeleteGroupParams) => {
		const { name } = params
		const db = getDb(connectionString)

		await db.delete(groups).where(eq(groups.name, name))

		return null
	}
