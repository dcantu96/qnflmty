'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
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

export interface Tournament {
	id: number
	name: string
	year: number
	sport: {
		name: string
	}
}

export const columns: ColumnDef<Tournament>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<Link
				href={`/admin/tournaments/${row.original.id}`}
				className="font-medium hover:underline"
			>
				{row.original.name}
			</Link>
		),
	},
	{
		accessorKey: 'year',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Year" />
		),
	},
	{
		accessorKey: 'sport.name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Sport" />
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="sm"
						variant="ghost"
						className="py-1"
						title="More options"
					>
						<MoreHorizontal />
						<span className="sr-only">More</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="rounded-lg" align="end">
					<DropdownMenuItem asChild>
						<Link href={`/admin/tournaments/${row.original.id}/edit`}>
							<Edit2 className="text-muted-foreground" />
							<span>Edit Tournament</span>
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
