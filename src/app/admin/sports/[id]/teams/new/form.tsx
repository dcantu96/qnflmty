'use client'

import { useActionState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { createTeam } from '~/server/admin/mutations'

export default function Form({
	sport,
}: {
	sport: {
		name: string
		id: number
		createdAt: Date
		updatedAt: Date
	}
}) {
	const [state, action, pending] = useActionState(createTeam, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					Team Name
				</label>
				<Input name="name" required placeholder="Team Name" />
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
					maxLength={3}
				/>
			</div>
			<div>
				<input type="hidden" name="sportId" value={sport.id} />
				<label
					htmlFor="sport"
					className="block font-medium text-gray-700 text-sm"
				>
					Sport: {sport.name}
				</label>
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
