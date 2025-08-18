'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { useFormStatus } from 'react-dom'
import { createProfileAction } from '~/lib/profile-actions'
import { avatarIconsMap } from '~/lib/avatar-icons'

function SubmitButton() {
	const { pending } = useFormStatus()

	return (
		<Button
			type="submit"
			className="w-full disabled:cursor-not-allowed disabled:opacity-50 group-invalid:pointer-events-none group-invalid:cursor-not-allowed group-invalid:opacity-50"
			disabled={pending}
		>
			{pending ? 'Creating Profile...' : 'Create Profile'}
		</Button>
	)
}

export function ProfileCreationForm() {
	const [state, formAction] = useActionState(createProfileAction, null)

	return (
		<form action={formAction} className="group space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Choose Your Avatar</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-4 gap-3 md:grid-cols-8">
						{Object.entries(avatarIconsMap).map(([name, avatar]) => {
							return (
								<label
									key={name}
									className="flex cursor-pointer flex-col items-center justify-center rounded-md border p-3 transition-colors hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-accent has-[:checked]:text-accent-foreground"
								>
									<input
										type="radio"
										name="avatar"
										value={name}
										defaultChecked={name === 'user'}
										className="sr-only"
									/>
									<avatar.icon className={cn('mb-2 h-6 w-6', avatar.color)} />
									<span className="font-medium text-xs">{avatar.name}</span>
								</label>
							)
						})}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Create Your Username</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username" className="font-medium text-sm">
							Username
						</Label>
						<Input
							id="username"
							name="username"
							type="text"
							placeholder="Enter your username"
							className="h-10"
							maxLength={20}
							required
						/>
						<p className="text-muted-foreground text-xs">
							Choose a unique username (max 20 characters)
						</p>
					</div>

					{state?.error && (
						<div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
							{state.error}
						</div>
					)}

					<SubmitButton />
				</CardContent>
			</Card>
		</form>
	)
}
