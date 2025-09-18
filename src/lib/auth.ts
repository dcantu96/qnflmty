'use server'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { authOptions } from '~/app/api/auth/[...nextauth]'
import { db } from '~/server/db'

/**
 * For Server Components only
 * @returns The current user session, throwing an error if the user is not authenticated.
 */
export const auth = cache(async () => {
	const session = await getSession()
	if (!session?.user) {
		redirect('/login')
	}

	const user = await db.query.users.findFirst({
		where: (user, { eq }) => eq(user.id, session.user.id),
	})

	if (!user) {
		console.error(
			'Unexpected: No user found for session user id:',
			session.user.id,
		)
		redirect('/login')
	}

	return { session, user }
})

/**
 * For Server Components only
 * @returns The current user session, might be null
 */
export const getSession = async () => {
	return await getServerSession(authOptions)
}

export const isAdminSession = async () => {
	const { user } = await auth()
	return user.admin
}

export const adminGuard = async () => {
	const { user } = await auth()
	if (!user.admin) redirect('/')
}

export const userGuard = async () => {
	return await auth()
}
