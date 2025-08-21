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
	SidebarTrigger,
} from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
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
