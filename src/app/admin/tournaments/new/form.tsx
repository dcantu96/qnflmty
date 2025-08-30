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
import { createTournament } from '~/server/admin/mutations'

export default function Form({
	sports,
}: { sports: Array<{ id: number; name: string }> }) {
	const [sportId, setSportId] = useState('')
	const [state, action, pending] = useActionState(createTournament, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					Tournament Name
				</label>
				<Input name="name" required placeholder="Tournament Name" />
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
				{pending ? 'Creating...' : 'Create'}
			</Button>
		</form>
	)
}
