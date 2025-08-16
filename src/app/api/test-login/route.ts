import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'

import { env } from '~/env'
import { db } from '~/server/db'
import { users, sessions } from '~/server/db/schema'

export async function POST(req: NextRequest) {
	if (env.NODE_ENV === 'production') {
		return NextResponse.json(
			{ message: 'Not authorized to run in production' },
			{ status: 401 },
		)
	}

	try {
		const { email } = (await req.json()) as { email?: string }
		if (!email) {
			return NextResponse.json(
				{ message: 'Email is required' },
				{ status: 400 },
			)
		}

		let user = await db.query.users.findFirst({ where: eq(users.email, email) })
		if (!user) {
			const [newUser] = await db
				.insert(users)
				.values({ email, name: 'Cypress User' })
				.returning()
			user = newUser
		}

		if (!user || !user.id) {
			return NextResponse.json(
				{ message: 'Failed to ensure user for session creation' },
				{ status: 500 },
			)
		}

		const sessionToken = randomUUID()
		const expires = new Date(Date.now() + 1000 * 60 * 60)
		await db.insert(sessions).values({ sessionToken, userId: user.id, expires })

		return NextResponse.json({ sessionToken })
	} catch (error) {
		console.error('test-login error', error)
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
