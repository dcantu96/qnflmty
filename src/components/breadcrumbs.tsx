'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

export function Breadcrumbs() {
	const pathname = usePathname()
	const segments = pathname.split('/').filter(Boolean)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((seg, i) => {
					const href = `/${segments.slice(0, i + 1).join('/')}`
					const isLast = i === segments.length - 1
					const label = seg.charAt(0).toUpperCase() + seg.slice(1)

					return (
						<React.Fragment key={href}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
