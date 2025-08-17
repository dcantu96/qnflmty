'use client'

import {
	Trophy,
	Users,
	BarChart3,
	MessageSquare,
	Calendar,
	Target,
	Gamepad2,
} from 'lucide-react'
import { NavMain } from '~/components/nav-main'
import { NavProjects } from '~/components/nav-projects'
import { NavUser } from '~/components/nav-user'
import { ProfileSwitcher } from '~/components/profile-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'

interface DashboardSidebarProps {
	userData: {
		name: string
		email: string
		avatar: string
	}
	accounts: Array<{
		id: number
		username: string
		avatar: string | null
	}>
	selectedProfile: {
		id: number
		username: string
		avatar: string | null
	}
	children: React.ReactNode
}

export function DashboardSidebar({
	userData,
	accounts,
	selectedProfile,
	children,
}: DashboardSidebarProps) {
	const navMain = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: BarChart3,
			isActive: true,
			items: [
				{
					title: 'Overview',
					url: '/dashboard',
				},
				{
					title: 'Statistics',
					url: '/dashboard/stats',
				},
			],
		},
		{
			title: 'Quiniela',
			url: '/quiniela',
			icon: Trophy,
			items: [
				{
					title: 'Current Week',
					url: '/quiniela/current',
				},
				{
					title: 'Make Picks',
					url: '/quiniela/picks',
				},
				{
					title: 'Leaderboard',
					url: '/quiniela/leaderboard',
				},
			],
		},
		{
			title: 'Groups',
			url: '/groups',
			icon: Users,
			items: [
				{
					title: 'My Groups',
					url: '/groups/mine',
				},
				{
					title: 'Join Group',
					url: '/groups/join',
				},
				{
					title: 'Create Group',
					url: '/groups/create',
				},
			],
		},
		{
			title: 'Premium Chat',
			url: '/chat',
			icon: MessageSquare,
			items: [
				{
					title: 'General',
					url: '/chat/general',
				},
				{
					title: 'Strategy',
					url: '/chat/strategy',
				},
			],
		},
	]

	const projects = [
		{
			name: 'Season 2025',
			url: '/season/2025',
			icon: Calendar,
		},
		{
			name: 'Premium Picks',
			url: '/premium-picks',
			icon: Target,
		},
		{
			name: 'Game Center',
			url: '/games',
			icon: Gamepad2,
		},
	]

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<ProfileSwitcher
						profiles={accounts}
						selectedProfile={selectedProfile}
					/>
				</SidebarHeader>
				<SidebarContent>
					<NavMain items={navMain} />
					<NavProjects projects={projects} />
				</SidebarContent>
				<SidebarFooter>
					<NavUser user={userData} />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
