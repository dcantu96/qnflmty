'use client'

import { NavMain, type NavItem } from '~/components/nav-main'
import { NavProjects, type NavProject } from '~/components/nav-projects'
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
} from '~/components/ui/sidebar'
import type { AvatarIcon } from '~/server/db/schema'

export interface UserData {
	admin: boolean
	name: string
	email: string
	avatar: string
}

export interface AppSidebarProps {
	userData: UserData
	accounts?: Array<{
		id: number
		username: string
		avatar: AvatarIcon
	}>
	selectedProfile?: {
		id: number
		username: string
		avatar: AvatarIcon
	}
	navMain?: NavItem[]
	projects?: NavProject[]
	children: React.ReactNode
}

export function AppSidebar({
	userData,
	accounts,
	selectedProfile,
	children,
	navMain = [],
	projects = [],
}: AppSidebarProps) {
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
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	)
}
