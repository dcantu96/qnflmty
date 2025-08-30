'use client'

import { useActionState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { createSport } from '~/server/admin/mutations'

export default function Form() {
	const [state, action, pending] = useActionState(createSport, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					Sport Name
				</label>
				<Input name="name" required placeholder="Sport Name" />
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
