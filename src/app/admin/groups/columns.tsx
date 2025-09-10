'use client'

import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header'

export interface Group {
	id: number
	name: string
	finished: boolean
	joinable: boolean
	createdAt: Date
	paymentDueDate: Date | null
	tournament: {
		id: number
		name: string
		year: number
	}
}

export const columns: ColumnDef<Group>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Link
					href={`/admin/groups/${row.original.id}`}
					className="font-medium hover:underline"
				>
					{row.original.name}
				</Link>
				{row.original.joinable && (
					<Badge
						className="border-green-400 bg-green-100 text-green-900"
						variant="outline"
					>
						Joinable
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: 'tournament.name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tournament" />
		),
		cell: ({ row }) => (
			<Link
				href={`/admin/tournaments/${row.original.tournament.id}`}
				className="font-medium hover:underline"
			>
				{row.original.tournament.name} {row.original.tournament.year}
			</Link>
		),
	},
	{
		accessorKey: 'paymentDueDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Payment Due" />
		),
		cell: ({ row }) =>
			row.original.paymentDueDate?.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ row }) =>
			row.original.createdAt.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
	},
]
