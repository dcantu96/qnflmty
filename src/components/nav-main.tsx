'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '~/components/ui/sidebar'

export interface NavSubItem {
	title: string
	url: string
}

export interface NavItem {
	title: string
	url: string
	icon?: LucideIcon
	isActive?: boolean
	items?: NavSubItem[]
}

export function NavMain({
	items,
}: {
	items: NavItem[]
}) {
	const pathname = usePathname()
	const isAdminRoute = pathname.startsWith('/admin')

	const isAnySubItemActive = useCallback(
		(subItems?: NavSubItem[]) => {
			if (!subItems) return false
			return subItems.some(
				(subItem) =>
					pathname === subItem.url || pathname.startsWith(`${subItem.url}/`),
			)
		},
		[pathname],
	)

	return (
		<SidebarGroup>
			<SidebarGroupLabel>
				{isAdminRoute ? 'Admin Dashboard' : 'Platform'}
			</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={isAnySubItemActive(item.items)}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton
												asChild
												isActive={pathname === subItem.url}
											>
												<a href={subItem.url}>
													<span>{subItem.title}</span>
												</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
