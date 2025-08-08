import { authOptions } from '~/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { AuthButtons } from '~/components/auth-buttons'

export default async function HomePage() {
	const session = await getServerSession(authOptions)

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<p>Hello, QNFLMTY in progress</p>

			<h1>Hello {session?.user?.name || 'Guest'}</h1>

			<AuthButtons />
		</main>
	)
}
