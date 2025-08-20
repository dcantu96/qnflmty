import { db } from '~/server/db'
import { getSession } from '~/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
	const session = await getSession()
	const cookiesStore = await cookies()
	const selectedProfile = cookiesStore.get('selectedProfile')?.value
	const hasLoggedInOnce = cookiesStore.get('hasLoggedInOnce')?.value

	if (!session && !hasLoggedInOnce) {
		redirect('/welcome')
	}

	if (!session) {
		redirect('/login')
	}

	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	if (accounts.length > 0) {
		if (selectedProfile) {
			redirect('/dashboard')
		} else {
			redirect('/select-profile')
		}
	} else {
		redirect('/create-profile')
	}
}
