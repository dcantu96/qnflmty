'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { deleteTournament } from '~/server/admin/mutations'

export interface Team {
	id: number
	name: string
	shortName: string
	sportId: number
}

export const columns: ColumnDef<Team>[] = [
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
		cell: ({ row }) => {
			return (
				<span className="flex items-center gap-2">
					<Image
						src={`/team-logos/${row.original.shortName}.svg`}
						alt={row.original.name}
						width={25}
						height={25}
					/>
					{row.original.name}
				</span>
			)
		},
	},
	{
		accessorKey: 'shortName',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Short Name" />
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="sm" variant="ghost" className="py-1">
						<MoreHorizontal />
						<span className="sr-only">More</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="rounded-lg" align="end">
					<DropdownMenuItem asChild>
						<Link
							href={`/admin/sports/${row.original.sportId}/teams/${row.original.id}/edit`}
						>
							<Edit2 className="text-muted-foreground" />
							<span>Edit Team</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<DeleteTournamentButton
							id={row.original.id}
							name={row.original.name}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
]

const DeleteTournamentButton = ({ id, name }: { id: number; name: string }) => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button variant="ghost" className="py-1" onClick={() => setOpen(true)}>
				<Trash2 className="text-muted-foreground" />
				<span>Delete Tournament</span>
			</Button>
			{open && (
				<DeleteTournamentDialog
					id={id}
					name={name}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	)
}

const DeleteTournamentDialog = ({
	id,
	name,
	onClose,
}: { id: number; name: string; onClose: () => void }) => {
	const router = useRouter()
	const [pending, setPending] = useState(false)
	const handleDelete = async () => {
		setPending(true)
		await deleteTournament({ id })
		setPending(false)
		router.refresh()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Tournament</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete tournament: {name}?
					</DialogDescription>
				</DialogHeader>
				<input type="hidden" name="tournamentId" value={id} />
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						onClick={handleDelete}
						disabled={pending}
					>
						{pending ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
