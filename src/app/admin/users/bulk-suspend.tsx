'use client'

import { useDataTable } from '~/components/ui/data-table'
import type { Users } from './columns'
import { Button } from '~/components/ui/button'
import { ShieldX } from 'lucide-react'
import { suspendUsers } from '~/server/admin/mutations'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'

export const BulkSuspend = () => {
	const [open, setOpen] = useState(false)
	const { rowSelection, setRowSelection } = useDataTable<Users>()
	const userIds = Object.keys(rowSelection).map((id) => Number(id))

	if (userIds.length === 0) {
		return null
	}

	const onSuccess = () => {
		setRowSelection({})
	}

	return (
		<>
			<Button
				type="button"
				onClick={() => setOpen(true)}
				variant="destructive"
				title="Bulk Suspend"
				className="justify-self-end"
				size="sm"
			>
				<ShieldX />
			</Button>
			{open && (
				<SuspendUsersDialog
					ids={userIds}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	)
}

const SuspendUsersDialog = ({
	ids,
	onClose,
	onSuccess,
}: { ids: number[]; onClose: () => void; onSuccess: () => void }) => {
	const [pending, setPending] = useState(false)

	const handleSubmit = async () => {
		setPending(true)
		await suspendUsers({ ids })
		setPending(false)
		onSuccess()
		onClose()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Suspend Users</DialogTitle>
					<DialogDescription>
						Are you sure you want to suspend these {ids.length} users?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						type="button"
						onClick={handleSubmit}
						disabled={pending}
					>
						{pending ? 'Suspending...' : 'Suspend'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
