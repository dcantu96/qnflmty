import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
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
		const body = await request.json()
		const { name, email, image, admin = false } = body

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })
		}

		if (!name) {
			return NextResponse.json({ error: 'Name is required' }, { status: 400 })
		}

		const [newUser] = await db
			.insert(users)
			.values({
				email,
				name,
				image: image || null,
				admin,
			})
			.returning()

		return NextResponse.json({
			id: newUser?.id,
			email: newUser?.email,
			name: newUser?.name,
			image: newUser?.image,
			admin: newUser?.admin,
		})
	} catch (error) {
		console.error('Cypress create user error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function DELETE(request: NextRequest) {
	// Only allow in non-production environments
	if (env.NODE_ENV === 'production') {
		return NextResponse.json(
			{ error: 'Not authorized to run in production' },
			{ status: 403 },
		)
	}

	try {
		const body = await request.json()
		const { email, id } = body

		if (!email && !id) {
			return NextResponse.json(
				{ error: 'Either email or id is required' },
				{ status: 400 },
			)
		}

		// First find the user to verify they exist
		const user = await db.query.users.findFirst({
			where: email ? eq(users.email, email) : eq(users.id, id),
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Delete the user
		await db.delete(users).where(eq(users.id, user.id))

		return NextResponse.json({
			success: true,
			message: `User with ${email ? 'email' : 'id'} ${email || id} deleted successfully`,
		})
	} catch (error) {
		console.error('Cypress delete user error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
