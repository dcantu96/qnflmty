import { SidebarLayout } from '~/components/layout/sidebar-layout'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'

export default async function Page() {
	const session = await useAuthenticatedSession()

	// Get user accounts to find the selected profile
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	// If no accounts exist, redirect to profile creation
	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	// Pass user data to sidebar
	const userData = {
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image || '/avatars/default.jpg',
	}

	return (
		<SidebarLayout
			breadcrumbs={{
				items: [
					{ href: '#', label: 'Dashboard' },
					{ label: 'Overview', isActive: true },
				],
			}}
			user={userData}
			profiles={accounts}
		>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div>
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
		</SidebarLayout>
	)
}
