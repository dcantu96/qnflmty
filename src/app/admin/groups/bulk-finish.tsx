'use client'

import { useDataTable } from '~/components/ui/data-table'
import { Button } from '~/components/ui/button'
import { BadgeCheck } from 'lucide-react'
import { finishGroups } from '~/server/admin/mutations'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import type { Group } from './columns'

export const BulkFinish = () => {
	const [open, setOpen] = useState(false)
	const { rowSelection, setRowSelection } = useDataTable<Group>()
	const ids = Object.keys(rowSelection).map((id) => Number(id))

	if (ids.length === 0) {
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
				title="Bulk Finish"
				className="justify-self-end"
				size="sm"
			>
				<BadgeCheck />
			</Button>
			{open && (
				<FinishGroupsDialog
					ids={ids}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	)
}

const FinishGroupsDialog = ({
	ids,
	onClose,
	onSuccess,
}: { ids: number[]; onClose: () => void; onSuccess: () => void }) => {
	const [pending, setPending] = useState(false)

	const handleSubmit = async () => {
		setPending(true)
		await finishGroups({ ids })
		setPending(false)
		onSuccess()
		onClose()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Finish Groups</DialogTitle>
					<DialogDescription>
						Are you sure you want to finish these {ids.length} groups?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={pending}>
						{pending ? 'Finishing...' : 'Finish'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
