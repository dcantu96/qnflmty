import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db'
import { users, sessions } from '~/server/db/schema'

export async function createTestSession({ email }: { email: string }) {
	// Find or create the user by email
	let user = await db.query.users.findFirst({ where: eq(users.email, email) })

	if (!user) {
		const [newUser] = await db
			.insert(users)
			.values({ email, name: 'Cypress User' })
			.returning()
		user = newUser
	}

	if (!user || !user.id) {
		throw new Error('Failed to ensure user for session creation')
	}

	// Create a session row compatible with NextAuth database strategy
	const sessionToken = randomUUID()
	const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

	await db
		.insert(sessions)
		.values({ sessionToken, userId: user.id, expires })
		.onConflictDoNothing() // in case same token somehow collides

	return sessionToken
}
