import { redirect } from 'next/navigation'
import { DashboardHeader } from '~/components/dashboard-header'
import { AdminSidebar } from '~/components/sidebar/admin-sidebar'
import { auth } from '~/lib/auth'
import { db } from '~/server/db'
import { getSelectedProfile } from '~/server/user/queries'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { session, user } = await auth()
	const selectedProfile = await getSelectedProfile()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	if (!user.admin) {
		redirect('/unauthorized')
	}

	const userData = {
		admin: user.admin,
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image ?? undefined,
	}

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
