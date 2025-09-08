'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header'
import { avatarIconsMap } from '~/lib/avatar-icons'
import type { AvatarIcon } from '~/server/db/schema'

export interface UserAccount {
	id: number
	username: string
	avatar: AvatarIcon
	createdAt: Date
}

export const columns: ColumnDef<UserAccount>[] = [
	{
		accessorKey: 'username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Username" />
		),
	},
	{
		accessorKey: 'avatar',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Avatar" />
		),
		cell: ({ row }) => {
			const avatar = avatarIconsMap[row.original.avatar]
			return (
				<div className="flex items-center">
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring ring-muted">
						<avatar.icon className={`h-4 w-4 ${avatar.color}`} />
					</div>
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
