'use client'

import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createRequest } from '~/server/user/mutations'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'

interface RequestAccessFormProps {
	userAccountId: number
	hasPendingRequest: boolean
	groupId: number
}

export async function RequestAccessForm({
	userAccountId,
	hasPendingRequest,
	groupId,
}: RequestAccessFormProps) {
	const [message, formAction, isPending] = useActionState(createRequest, null)

	return (
		<form action={formAction}>
			<input type="hidden" name="userAccountId" value={userAccountId} />
			<input type="hidden" name="groupId" value={groupId} />
			{message && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
					<p className="text-red-700 text-sm">{message}</p>
				</div>
			)}

			<div className="flex flex-col gap-3">
				<Submit disabled={hasPendingRequest} />

				<Button
					type="button"
					variant="outline"
					size="lg"
					className="px-8 py-3"
					disabled={isPending}
					asChild
				>
					<Link href="/select-profile">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Switch Profile
					</Link>
				</Button>
			</div>
		</form>
	)
}

const Submit = ({ disabled }: { disabled: boolean }) => {
	const { pending } = useFormStatus()
	return (
		<Button
			type="submit"
			disabled={disabled || pending}
			size="lg"
			className="px-8 py-6 text-lg"
		>
			{pending ? 'Requesting...' : 'Request Access'}
		</Button>
	)
}
