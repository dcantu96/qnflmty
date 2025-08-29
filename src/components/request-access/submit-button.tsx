'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

export const Submit = ({
	hasPendingRequest,
}: { hasPendingRequest: boolean }) => {
	const { pending } = useFormStatus()
	return (
		<Button
			type="submit"
			disabled={hasPendingRequest || pending}
			size="lg"
			className="w-full px-8 py-3"
		>
			{hasPendingRequest
				? 'Request Already Submitted'
				: pending
					? 'Requesting...'
					: 'Request Access'}
		</Button>
	)
}
