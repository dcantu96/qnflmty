'use client'

import {
	BarChart3,
	Trophy,
	Users,
	MessageSquare,
	Calendar,
	Target,
	Gamepad2,
} from 'lucide-react'
import { AppSidebar, type AppSidebarProps } from './app-sidebar'

const navMain = [
	{
		title: 'Admin',
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

export function AdminSidebar({
	userData,
	children,
}: Omit<
	AppSidebarProps,
	'projects' | 'navMain' | 'accounts' | 'selectedProfile'
>) {
	return (
		<AppSidebar userData={userData} navMain={navMain} projects={projects}>
			{children}
		</AppSidebar>
	)
}
