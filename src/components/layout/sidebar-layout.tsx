'use client'

import React from 'react'
import { AppSidebar } from '~/components/app-sidebar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '~/components/ui/sidebar'

interface SidebarLayoutProps {
	children: React.ReactNode
	breadcrumbs?: {
		items: Array<{
			href?: string
			label: string
			isActive?: boolean
		}>
	}
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

export function SidebarLayout({
	children,
	breadcrumbs,
	user,
	profiles,
}: SidebarLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar user={user} profiles={profiles} />
			<SidebarInset>
				{breadcrumbs && (
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumbs.items.map((item, index) => (
										<React.Fragment key={item.label}>
											<BreadcrumbItem>
												{item.isActive ? (
													<BreadcrumbPage>{item.label}</BreadcrumbPage>
												) : (
													<BreadcrumbLink href={item.href || '#'}>
														{item.label}
													</BreadcrumbLink>
												)}
											</BreadcrumbItem>
											{index < breadcrumbs.items.length - 1 && (
												<BreadcrumbSeparator />
											)}
										</React.Fragment>
									))}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
				)}
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
