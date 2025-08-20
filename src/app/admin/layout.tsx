import { redirect } from 'next/navigation'
import { AdminSidebar } from '~/components/sidebar/admin-sidebar'
import { auth } from '~/lib/auth'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { session, user } = await auth()

	if (!user.admin) {
		redirect('/unauthorized')
	}

	const userData = {
		admin: user.admin,
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image || '/avatars/default.jpg',
	}

	return <AdminSidebar userData={userData}>{children}</AdminSidebar>
}
