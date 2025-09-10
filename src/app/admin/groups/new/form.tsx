'use client'

import { ChevronDownIcon } from 'lucide-react'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { createGroup } from '~/server/admin/mutations'

export default function Form({
	tournaments,
}: {
	tournaments: Array<{
		id: number
		name: string
		createdAt: Date
		year: number
		sport: {
			name: string
		}
	}>
}) {
	const [tournamentId, setTournamentId] = useState('')
	const [joinable, setJoinable] = useState(false)
	const [finished, setFinished] = useState(false)
	const [date, setDate] = useState<Date | undefined>(undefined)
	const [open, setOpen] = useState(false)
	const [state, action, pending] = useActionState(createGroup, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<div className="flex flex-col gap-3">
				<Label htmlFor="name" className="px-1 text-gray-700 text-sm">
					Group Name
				</Label>
				<Input name="name" required placeholder="Tournament Name" />
			</div>
			<div className="flex flex-col gap-3">
				<input type="hidden" name="tournamentId" value={tournamentId} />
				<Label htmlFor="tournament" className="px-1 text-gray-700 text-sm">
					Tournament
				</Label>
				<Select required value={tournamentId} onValueChange={setTournamentId}>
					<SelectTrigger name="tournament" className="w-full">
						<SelectValue placeholder={'Select a Tournament...'} />
					</SelectTrigger>
					<SelectContent>
						{tournaments.map((tournament) => (
							<SelectItem key={tournament.id} value={tournament.id.toString()}>
								{tournament.name} {tournament.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
			<Button
				type="submit"
				disabled={pending}
				className="w-full bg-primary text-white"
			>
				{pending ? 'Creating...' : 'Create'}
			</Button>
		</form>
	)
}
