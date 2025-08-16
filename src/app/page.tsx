import { AuthButtons } from '~/components/auth-buttons'
import { db } from '~/server/db'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'

export default async function HomePage() {
	const session = await useAuthenticatedSession()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<p>Hello, QNFLMTY in progress</p>

			<h1>Hello {session?.user?.name || 'Guest'}</h1>
			<p>Your user ID is: {session.user.id}</p>
			<p>
				Your accounts:{' '}
				{accounts.map((acc) => acc.username).join(', ') || 'No accounts linked'}
			</p>
			<AuthButtons />
		</main>
	)
}
