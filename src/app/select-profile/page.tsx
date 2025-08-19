import { ProfileSelector } from '~/components/profile/profile-selector'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'

export default async function SelectProfilePage() {
	const session = await useAuthenticatedSession()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	// If user has no accounts, redirect to profile creation
	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
			<div className="flex min-h-screen items-center justify-center px-4 py-12">
				<div className="mx-auto max-w-4xl">
					<ProfileSelector accounts={accounts} />
				</div>
			</div>
		</div>
	)
}
