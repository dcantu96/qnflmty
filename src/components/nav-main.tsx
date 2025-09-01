'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
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
													<Link href={subItem.url}>{subItem.title}</Link>
			</SidebarMenu>
		</SidebarGroup>
	)
}
