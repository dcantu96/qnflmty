'use client'

import type * as React from 'react'
import {
	Trophy,
	Users,
	BarChart3,
	Crown,
	MessageSquare,
	Settings2,
	Gamepad2,
	Calendar,
	Target,
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
	SidebarRail,
} from '~/components/ui/sidebar'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user?: {
		name: string
		email: string
		avatar: string
	}
	profiles?: Array<{
		id: number
		username: string
		avatar: string | null
	}>
}

// Generate QNFLMTY-specific navigation data
const getNavigationData = (user?: {
	name: string
	email: string
	avatar: string
}) => ({
	user: user || {
		name: 'User',
		email: 'user@example.com',
		avatar: '/avatars/default.jpg',
	},
	navMain: [
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
	],
	projects: [
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
	],
})

export function AppSidebar({ user, profiles = [], ...props }: AppSidebarProps) {
	const data = getNavigationData(user)

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProfileSwitcher profiles={profiles} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
