'use client'

import { useActionState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { updateUser } from '~/server/admin/mutations'

interface FormProps {
	user: {
		id: number
		name: string
		email: string
		phone: string | null
	}
}

export default function Form({ user }: FormProps) {
	const [state, action, pending] = useActionState(updateUser, {
		message: '',
	})

	return (
		<form action={action} className="space-y-6">
			<input type="hidden" name="id" value={user.id} />
			<div>
				<label
					htmlFor="name"
					className="block font-medium text-gray-700 text-sm"
				>
					User Full Name
				</label>
				<Input name="name" required defaultValue={user.name} />
			</div>
			<div>
				<label
					htmlFor="email"
					className="block font-medium text-gray-700 text-sm"
				>
					Email
				</label>
				<Input name="email" type="email" required defaultValue={user.email} />
			</div>
			<div>
				<label
					htmlFor="phone"
					className="block font-medium text-gray-700 text-sm"
				>
					Phone
				</label>
				<Input
					name="phone"
					type="tel"
					placeholder="(123) 456-7890"
					defaultValue={user.phone ?? undefined}
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
