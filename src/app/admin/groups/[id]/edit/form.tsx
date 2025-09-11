'use client'

import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { updateGroup } from '~/server/admin/mutations'

type Group = {
	id: number
	name: string
	joinable: boolean
	finished: boolean
	paymentDueDate: Date | null
	tournament: {
		id: number
		name: string
		year: number
		sport: {
			name: string
		}
	}
}

export default function Form({ group }: { group: Group }) {
	const [joinable, setJoinable] = useState(group.joinable)
	const [finished, setFinished] = useState(group.finished)
	const [date, setDate] = useState<Date | undefined>(
		group.paymentDueDate || undefined,
	)
	const [open, setOpen] = useState(false)
	const [state, action, pending] = useActionState(updateGroup, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<input type="hidden" name="id" value={group.id} />
			<div className="flex flex-col gap-3">
				<Label htmlFor="name" className="px-1 text-gray-700 text-sm">
					Group Name
				</Label>
				<Input
					name="name"
					required
					placeholder="Group Name"
					defaultValue={group.name}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<Label className="px-1 text-gray-700 text-sm">Tournament</Label>
				<div className="rounded-md border border-input bg-background px-3 py-2 text-sm">
					{group.tournament.name} {group.tournament.year} (
					{group.tournament.sport.name})
				</div>
				<p className="text-muted-foreground text-xs">
					Tournament cannot be changed after group creation
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<input
					type="hidden"
					name="paymentDueDate"
					value={date?.toISOString() ?? ''}
				/>
				<Label htmlFor="date" className="px-1 text-gray-700 text-sm">
					Payment Due Date
				</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id="date"
							variant="outline"
							className="w-full justify-between font-normal"
						>
							{date ? date.toLocaleDateString() : 'Select date'}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={(date) => {
								setDate(date)
								setOpen(false)
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="joinable"
						name="joinable"
						checked={joinable}
						onCheckedChange={(value) => setJoinable(!!value)}
					/>
					<Label htmlFor="joinable" className="cursor-pointer text-gray-700">
						Joinable
					</Label>
				</div>
			</div>

			<div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="finished"
						name="finished"
						checked={finished}
						onCheckedChange={(value) => setFinished(!!value)}
					/>
					<Label htmlFor="finished" className="cursor-pointer text-gray-700">
						Finished
					</Label>
				</div>
			</div>

			{state.message && (
				<div className="text-red-500 text-sm">{state.message}</div>
			)}
			<div className="flex gap-3">
				<Button
					type="submit"
					disabled={pending}
					className="bg-primary text-white"
				>
					{pending ? 'Updating...' : 'Update'}
				</Button>
				<Button type="button" variant="outline" asChild>
					<Link href="/admin/groups">Cancel</Link>
				</Button>
			</div>
		</form>
	)
}
