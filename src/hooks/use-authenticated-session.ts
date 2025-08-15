import { getServerSession } from 'next-auth'
import { authOptions } from '~/app/api/auth/[...nextauth]'

/**
 * For Server Components only
 * @returns The current user session, throwing an error if the user is not authenticated.
 */
export const useAuthenticatedSession = async () => {
	const session = await getServerSession(authOptions)
	if (!session || !session.user) {
		throw new Error('User is not authenticated')
	}
	return session
}
