'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
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
