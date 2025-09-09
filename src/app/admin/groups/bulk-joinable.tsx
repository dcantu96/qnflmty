'use client'

import { useDataTable } from '~/components/ui/data-table'
import { Button } from '~/components/ui/button'
import { LockKeyhole } from 'lucide-react'
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
import { Checkbox } from '~/components/ui/checkbox'
import { updateJoinableGroups } from '~/server/admin/mutations'

export const BulkJoinable = () => {
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
				title="Bulk Joinable"
				className="justify-self-end"
				size="sm"
			>
				<LockKeyhole />
			</Button>
			{open && (
				<ToggleJoinableGroupsDialog
					ids={ids}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	)
}

const ToggleJoinableGroupsDialog = ({
	ids,
	onClose,
	onSuccess,
}: { ids: number[]; onClose: () => void; onSuccess: () => void }) => {
	const [pending, setPending] = useState(false)
	const [joinable, setJoinable] = useState(false)

	const handleSubmit = async () => {
		setPending(true)
		await updateJoinableGroups({ ids, joinable })
		setPending(false)
		onSuccess()
		onClose()
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Toggle Joinable Status</DialogTitle>
					<DialogDescription>
						What should the joinable status be for these groups?
					</DialogDescription>
					<div className="mt-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="joinable"
								name="joinable"
								checked={joinable}
								onCheckedChange={(value) => setJoinable(!!value)}
							/>
							<label htmlFor="joinable" className="cursor-pointer">
								Joinable
							</label>
						</div>
					</div>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={pending}>
						{pending ? 'Updating...' : 'Update'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
