'use client'
import { createRequest } from '~/server/user/mutations'
import { Submit } from './submit-button'
import { useFormState } from 'react-dom'

interface RequestAccessFormProps {
	userAccountId: number
	hasPendingRequest: boolean
	groupId: number
}

const initialState = {
	error: '',
}

export function RequestAccessForm({
	userAccountId,
	hasPendingRequest,
	groupId,
}: RequestAccessFormProps) {
	const [state, action] = useFormState(createRequest, initialState)

	return (
		<form action={action}>
			<input type="hidden" name="userAccountId" value={userAccountId} />
			<input type="hidden" name="groupId" value={groupId} />
			{state?.error && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
					<p className="text-red-700 text-sm">{state.error}</p>
				</div>
			)}

			<Submit hasPendingRequest={hasPendingRequest} />
		</form>
	)
}
