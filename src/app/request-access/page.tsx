import { FullPageLayout } from '~/components/layout/full-page-layout'
import { RequestAccessForm } from '~/components/request-access/request-access-form'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'

export default async function RequestAccessPage() {
	const session = await useAuthenticatedSession()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	// If user has no accounts, redirect to profile creation
	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	const userAccount = accounts[0]
	if (!userAccount) {
		redirect('/create-profile')
	}

	return (
		<FullPageLayout className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					<RequestAccessForm userAccount={userAccount} />
				</div>
			</div>
		</FullPageLayout>
	)
}
