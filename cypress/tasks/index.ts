import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { getDb } from './cypress-db'
import { sessions, users } from '~/server/db/schema'

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
