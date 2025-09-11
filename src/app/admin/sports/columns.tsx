'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit2, Flag, MoreHorizontal, Trash2 } from 'lucide-react'
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
import { deleteSport } from '~/server/admin/mutations'

export interface Sport {
	id: number
	name: string
	teams?: { id: number; shortName: string; name: string }[]
	totalTeams: number
}

export const columns: ColumnDef<Sport>[] = [
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
		id: 'teams',
		header: 'Teams',
		cell: ({ row }) => {
			const teams = row.original.teams || []
			if (teams.length === 0)
				return (
					<Button size="sm" asChild variant="ghost">
						<Link
							href={`/admin/sports/${row.original.id}/teams`}
							title="View Teams"
						>
							<Flag />
						</Link>
					</Button>
				)
			return (
				<Link
					href={`/admin/sports/${row.original.id}/teams`}
					className="-space-x-3 flex"
				>
					{teams.map((team) => (
						<div key={team.id} className="group relative">
							<img
								src={`/team-logos/${team.shortName}.svg`}
								alt={team.name}
								className="h-6 w-6 cursor-pointer rounded-full border-2 border-white shadow-sm transition-all duration-200 group-hover:z-20 group-hover:scale-110"
							/>
							<div className="-translate-x-1/2 absolute bottom-full left-1/2 z-20 mb-2 hidden whitespace-nowrap rounded-md bg-black px-2 py-1 text-white text-xs shadow-md group-hover:block">
								{team.name}
							</div>
						</div>
					))}
					{row.original.totalTeams > teams.length && (
						<div className="ml-4 flex items-center text-muted-foreground text-sm">
							+{row.original.totalTeams - teams.length} more
						</div>
					)}
				</Link>
			)
		},
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
						<Link href={`/admin/sports/${row.original.id}/edit`}>
							<Edit2 className="text-muted-foreground" />
							<span>Edit Sport</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<DeleteSportButton id={row.original.id} name={row.original.name} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
]

const DeleteSportButton = ({ id, name }: { id: number; name: string }) => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button variant="ghost" className="py-1" onClick={() => setOpen(true)}>
				<Trash2 className="text-muted-foreground" />
				<span>Delete Sport</span>
			</Button>
			{open && (
				<DeleteSportDialog id={id} name={name} onClose={() => setOpen(false)} />
			)}
		</>
	)
}

const DeleteSportDialog = ({
	id,
	name,
	onClose,
}: { id: number; name: string; onClose: () => void }) => {
	const router = useRouter()
	const [pending, setPending] = useState(false)
	const handleDelete = async () => {
		setPending(true)
		await deleteSport({ id })
		setPending(false)
		router.refresh()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Sport</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete sport: {name}?
					</DialogDescription>
				</DialogHeader>
				<input type="hidden" name="sportId" value={id} />
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
