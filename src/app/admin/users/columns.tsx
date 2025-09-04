'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header'
import { avatarIconsMap } from '~/lib/avatar-icons'
import type { AvatarIcon } from '~/server/db/schema'

export interface Users {
	id: number
	name: string
	email: string
	phone: string | null
	userAccounts: {
		id: number
		username: string
		avatar: AvatarIcon
	}[]
	createdAt: Date
}

export const columns: ColumnDef<Users>[] = [
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
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
	},
	{
		accessorKey: 'phone',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone" />
		),
	},
	{
		id: 'userAccounts',
		header: 'Accounts',
		cell: ({ row }) => {
			const userAccounts = row.original.userAccounts || []
			if (!userAccounts.length) return null
			return (
				<div className="-space-x-2 flex">
					{userAccounts.map((userAccount) => {
						const avatar = avatarIconsMap[userAccount.avatar]
						return (
							<div
								key={userAccount.id}
								className="group relative"
								title={userAccount.username}
							>
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring ring-muted">
									<avatar.icon className={`h-4 w-4 ${avatar.color}`} />
								</div>
								<div
									role="tooltip"
									className="-translate-x-1/2 absolute bottom-full left-1/2 z-20 mb-2 hidden whitespace-nowrap rounded-md bg-black px-2 py-1 text-white text-xs shadow-md group-hover:block"
								>
									{userAccount.username}
								</div>
							</div>
						)
					})}
				</div>
			)
		},
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
