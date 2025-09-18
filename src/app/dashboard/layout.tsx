import { DashboardSidebar } from '~/components/sidebar/dashboard-sidebar'
import { handleDashboardAuth } from '~/lib/auth-handlers'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { userData, accounts, selectedProfile } = await handleDashboardAuth()

	return (
		<DashboardSidebar
			userData={userData}
			accounts={accounts}
			selectedProfile={selectedProfile}
		>
			{children}
		</DashboardSidebar>
	)
}
