import { type NextRequest, NextResponse } from 'next/server'
import { db } from '~/server/db'
import { userAccounts } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '~/lib/auth'

export async function POST(request: NextRequest) {
	try {
		const { user } = await auth()

		const { userId, username, avatar } = await request.json()

		if (userId !== user.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
		}

		// Validate input
		if (!username || typeof username !== 'string') {
			return NextResponse.json(
				{ error: 'Username is required' },
				{ status: 400 },
			)
		}

		if (username.length > 20) {
			return NextResponse.json(
				{ error: 'Username must be 20 characters or less' },
				{ status: 400 },
			)
		}

		// Check if username already exists
		const existingAccount = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.username, username.trim().toLowerCase()),
		})

		if (existingAccount) {
			return NextResponse.json(
				{ error: 'Username is already taken' },
				{ status: 409 },
			)
		}

		// Check if user already has an account
		const userExistingAccount = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.userId, userId),
		})

		if (userExistingAccount) {
			return NextResponse.json(
				{ error: 'User already has an account' },
				{ status: 409 },
			)
		}

		// Create the user account
		const newAccount = await db
			.insert(userAccounts)
			.values({
				userId,
				username: username.trim(),
				avatar: avatar || 'user',
			})
			.returning()

		return NextResponse.json({
			success: true,
			account: newAccount[0],
		})
	} catch (error) {
		console.error('Error creating profile:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
