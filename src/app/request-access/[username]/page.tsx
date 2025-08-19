import { RequestAccessForm } from '~/components/request-access/request-access-form'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'

export default async function RequestAccessPage({
	params,
}: {
	params: Promise<{ username: string }>
}) {
	const session = await useAuthenticatedSession()
	const { username } = await params

	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
		orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
	})

	// If user has no accounts, redirect to profile creation
	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	// Find the account by username
	const userAccount = accounts.find((account) => account.username === username)

	// If username not found among user's accounts, show not found message
	if (!userAccount) {
		return (
			<div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
				<div className="container mx-auto px-4 py-12">
					<div className="mx-auto max-w-4xl">
						<div className="text-center">
							<h1 className="mb-4 font-bold text-4xl text-gray-900 dark:text-white">
								Username Not Found
							</h1>
							<p className="text-gray-600 text-lg dark:text-gray-300">
								The username "{username}" was not found among your profiles.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					<RequestAccessForm userAccount={userAccount} />
				</div>
			</div>
		</div>
	)
}
