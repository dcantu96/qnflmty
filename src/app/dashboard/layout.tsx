import { redirect } from 'next/navigation'
import { DashboardSidebar } from '~/components/dashboard-sidebar'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import {
	getSelectedProfile,
	enforceGroupMembership,
} from '~/lib/profile-actions'
import { db } from '~/server/db'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await useAuthenticatedSession()

	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})
	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	const mappedAccounts = accounts.map((account) => ({
		id: account.id,
		username: account.username,
		avatar: account.avatar ?? 'user',
	}))

	const selectedProfile = await getSelectedProfile()
	if (!selectedProfile) {
		redirect('/select-profile')
	}

	// Ensure the selected profile has access to the active group
	await enforceGroupMembership()

	const userData = {
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image || '/avatars/default.jpg',
	}

	return (
		<DashboardSidebar
			userData={userData}
			accounts={mappedAccounts}
			selectedProfile={selectedProfile}
		>
			{children}
		</DashboardSidebar>
	)
}
