'use client'

import { useActionState, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { updateTournament } from '~/server/admin/mutations'

interface FormProps {
	tournament: {
		id: number
		name: string
		year: number
		sportId: number
	}
	sports: Array<{ id: number; name: string }>
}

export default function Form({ tournament, sports }: FormProps) {
	const [sportId, setSportId] = useState(tournament.sportId.toString())
	const [state, action, pending] = useActionState(updateTournament, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<input type="hidden" name="id" value={tournament.id} />
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					Tournament Name
				</label>
				<Input
					name="name"
					required
					placeholder="Tournament Name"
					defaultValue={tournament.name}
				/>
			</div>
			<div>
				<label
					htmlFor="year"
					className="block font-medium text-gray-700 text-sm"
				>
					Year
				</label>
				<Input
					name="year"
					type="number"
					required
					placeholder="Year"
					defaultValue={tournament.year}
					min={2000}
					max={2100}
				/>
			</div>
			<div>
				<input type="hidden" name="sportId" value={sportId} />
				<label
					htmlFor="sport"
					className="block font-medium text-gray-700 text-sm"
				>
					Sport
				</label>
				<Select required value={sportId} onValueChange={setSportId}>
					<SelectTrigger name="sport" className="w-full">
						<SelectValue placeholder={'Select a Sport...'} />
					</SelectTrigger>
					<SelectContent>
						{sports.map((sport) => (
							<SelectItem key={sport.id} value={sport.id.toString()}>
								{sport.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{state.message && (
				<div className="text-red-500 text-sm">{state.message}</div>
			)}
			<Button
				type="submit"
				disabled={pending}
				className="w-full bg-primary text-white"
			>
				{pending ? 'Updating...' : 'Update'}
			</Button>
		</form>
	)
}
