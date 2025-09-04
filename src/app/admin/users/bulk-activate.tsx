'use client'

import { useDataTable } from '~/components/ui/data-table'
import type { Users } from './columns'
import { Button } from '~/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import { activateUsers } from '~/server/admin/mutations'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'

export const BulkActivate = () => {
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
				title="Bulk Activate"
				className="justify-self-end"
				size="sm"
			>
				<ShieldCheck />
			</Button>
			{open && (
				<ActivateUsersDialog
					ids={userIds}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	)
}

const ActivateUsersDialog = ({
	ids,
	onClose,
	onSuccess,
}: { ids: number[]; onClose: () => void; onSuccess: () => void }) => {
	const [pending, setPending] = useState(false)

	const handleSubmit = async () => {
		setPending(true)
		await activateUsers({ ids })
		setPending(false)
		onSuccess()
		onClose()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Activate Users</DialogTitle>
					<DialogDescription>
						Are you sure you want to activate these {ids.length} users?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={pending}>
						{pending ? 'Activating...' : 'Activate'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
