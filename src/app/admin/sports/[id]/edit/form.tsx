'use client'

import { useActionState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { updateSport } from '~/server/admin/mutations'

interface FormProps {
	sport: {
		id: number
		name: string
	}
}

export default function Form({ sport }: FormProps) {
	const [state, action, pending] = useActionState(updateSport, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<input type="hidden" name="id" value={sport.id} />
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
					defaultValue={sport.name}
				/>
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
