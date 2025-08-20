import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '~/server/db'
import { sessions, users } from '~/server/db/schema'
import { env } from '~/env'

export async function POST(request: NextRequest) {
	// Only allow in non-production environments
	if (env.NODE_ENV === 'production') {
		return NextResponse.json(
			{ error: 'Not authorized to run in production' },
			{ status: 403 },
		)
	}

	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })
		}

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

		return NextResponse.json({ sessionToken })
	} catch (error) {
		console.error('Cypress login error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
