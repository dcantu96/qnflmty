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
import { updateTeam } from '~/server/admin/mutations'

interface FormProps {
	team: {
		name: string
		id: number
		shortName: string
		sportId: number
		sport: {
			name: string
			id: number
		}
	}
	sports: Array<{ id: number; name: string }>
}

export default function Form({ team, sports }: FormProps) {
	const [sportId, setSportId] = useState(team.sportId.toString())
	const [state, action, pending] = useActionState(updateTeam, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<input type="hidden" name="id" value={team.id} />
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					Team Name
				</label>
				<Input
					name="name"
					required
					placeholder="Team Name"
					defaultValue={team.name}
				/>
			</div>
			<div>
				<label
					htmlFor="shortName"
					className="block font-medium text-gray-700 text-sm"
				>
					Short Name
				</label>
				<Input
					name="shortName"
					type="text"
					required
					placeholder="Short Name"
					defaultValue={team.shortName}
					maxLength={3}
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
