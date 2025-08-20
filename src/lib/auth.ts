import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '~/app/api/auth/[...nextauth]'
import { db } from '~/server/db'

/**
 * For Server Components only
 * @returns The current user session, throwing an error if the user is not authenticated.
 */
export const auth = async () => {
	const session = await getSession()

	if (!session?.user) {
		redirect('/login')
	}

	const user = await db.query.users.findFirst({
		where: (user, { eq }) => eq(user.id, session.user.id),
	})

	if (!user) {
		console.error('User not found in database:', session.user.id)
		redirect('/login')
	}

	return { session, user }
}

/**
 * For Server Components only
 * @returns The current user session, might be null
 */
export const getSession = async () => {
	return await getServerSession(authOptions)
}
