'use client'

import { Settings2 } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../dropdown-menu'
import { Input } from '../input'
import { Button } from '../button'
import Link from 'next/link'
import { useDataTable } from './use-data-table'

export default function DataTableHeader<TData>({
	children,
}: {
	children?: React.ReactNode
}) {
	const { table, label, schema, createButtonHref } = useDataTable<TData>()

	const filterPlaceholder = `Filter ${label ?? schema}...`

	return (
		<div className="flex items-center justify-between gap-2 py-4">
			<div className="flex items-center gap-2">
				<Input
					placeholder={filterPlaceholder}
					onChange={(e) => table.setGlobalFilter(String(e.target.value))}
					className="max-w-xs"
				/>
			</div>
			<div className="flex items-center gap-2">
				{children}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Settings2 />
							View
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
				{createButtonHref && (
					<Button size="sm" asChild>
						<Link href={createButtonHref}>Add {label ?? schema}</Link>
					</Button>
				)}
			</div>
		</div>
	)
}
