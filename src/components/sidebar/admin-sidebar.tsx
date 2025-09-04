'use client'

import { Table2, Users } from 'lucide-react'
import { AppSidebar, type AppSidebarProps } from './app-sidebar'
import type { NavItem } from '../nav-main'

const navMain: NavItem[] = [
	{
		title: 'Users',
		url: '/admin/users',
		icon: Users,
	},
	{
		title: 'Data',
		url: '/data',
		icon: Table2,
		items: [
			{
				title: 'Tournaments',
				url: '/admin/tournaments',
			},
			{
				title: 'Sports',
				url: '/admin/sports',
			},
		],
	},
]

export function AdminSidebar({
	selectedProfile,
	accounts,
	userData,
	children,
}: Omit<AppSidebarProps, 'projects' | 'navMain'>) {
	return (
		<AppSidebar
			selectedProfile={selectedProfile}
			userData={userData}
			accounts={accounts}
			navMain={navMain}
			projects={[]}
		>
			{children}
		</AppSidebar>
	)
}
