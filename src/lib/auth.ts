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
		console.error('Session not found', session)
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

export const isAdminSession = async () => {
	const { user } = await auth()
	return user.admin
}

export const adminAuth =
	<Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) =>
	async (...args: Args): Promise<R> => {
		const { user } = await auth()
		if (!user?.admin) {
			console.error('User is not an admin:', user?.id)
			redirect('/')
		}
		return await fn(...args)
	}

export const protectedAuth =
	<Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) =>
	async (...args: Args): Promise<R> => {
		await auth()
		return await fn(...args)
	}
