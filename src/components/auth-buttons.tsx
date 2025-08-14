import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/app/api/auth/[...nextauth]'
import { Logout } from './logout'

export async function AuthButtons() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return <Logout />
}
