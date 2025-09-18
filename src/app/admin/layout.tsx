import { DashboardHeader } from '~/components/dashboard-header'
import { AdminSidebar } from '~/components/sidebar/admin-sidebar'
import { handleAdminAuth } from '~/lib/auth-handlers'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { userData, accounts, selectedProfile } = await handleAdminAuth()

	return (
		<AdminSidebar
			accounts={accounts}
			userData={userData}
			selectedProfile={selectedProfile}
		>
			<DashboardHeader />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
		</AdminSidebar>
	)
}
