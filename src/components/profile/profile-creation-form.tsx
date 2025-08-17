'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	User,
	Crown,
	Zap,
	Star,
	Heart,
	Shield,
	Rocket,
	Gamepad2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trpcClient } from '~/lib/trpcClient'

const avatarIcons = [
	{ id: 'user', icon: User, name: 'User', color: 'text-blue-600' },
	{ id: 'crown', icon: Crown, name: 'Crown', color: 'text-yellow-600' },
	{ id: 'zap', icon: Zap, name: 'Lightning', color: 'text-purple-600' },
	{ id: 'star', icon: Star, name: 'Star', color: 'text-orange-600' },
	{ id: 'heart', icon: Heart, name: 'Heart', color: 'text-red-600' },
	{ id: 'shield', icon: Shield, name: 'Shield', color: 'text-green-600' },
	{ id: 'rocket', icon: Rocket, name: 'Rocket', color: 'text-indigo-600' },
	{ id: 'gamepad', icon: Gamepad2, name: 'Gamepad', color: 'text-pink-600' },
]

export function ProfileCreationForm() {
	const [username, setUsername] = useState('')
	const [selectedAvatar, setSelectedAvatar] = useState('user')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		const trimmedUsername = username.trim()

		// Client-side validation to match Zod schema (prevents TRPC input validation errors)
		if (!trimmedUsername) {
			setError('Username is required')
			setIsLoading(false)
			return
		}

		if (trimmedUsername.length > 20) {
			setError('Username must be 20 characters or less')
			setIsLoading(false)
			return
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
			setError(
				'Username can only contain letters, numbers, underscores, and hyphens',
			)
			setIsLoading(false)
			return
		}

		try {
			const newProfile = await trpcClient.profile.create.mutate({
				username: trimmedUsername,
				avatar: selectedAvatar,
			})

			// Set the newly created profile as the selected one in localStorage
			localStorage.setItem('selectedProfile', newProfile.id.toString())

			// Redirect with the profile ID so the server can use it
			router.push(`/request-access?profileId=${newProfile.id}`)
		} catch (err) {
			// This will now mainly handle server-side errors (like "Username already taken")
			if (
				err &&
				typeof err === 'object' &&
				'message' in err &&
				typeof err.message === 'string'
			) {
				setError(err.message)
			} else {
				setError('Something went wrong')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						Choose Your Avatar
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-4 gap-4 md:grid-cols-8">
						{avatarIcons.map((avatar) => {
							const Icon = avatar.icon
							const isSelected = selectedAvatar === avatar.id
							return (
								<button
									key={avatar.id}
									type="button"
									onClick={() => setSelectedAvatar(avatar.id)}
									data-avatar={avatar.id}
									className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:scale-105${
										isSelected
											? 'scale-105 border-primary bg-primary/10'
											: 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
									}
									`}
								>
									<Icon className={`mb-2 h-8 w-8 ${avatar.color}`} />
									<span className="text-center font-medium text-xs">
										{avatar.name}
									</span>
								</button>
							)
						})}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						Create Your Username
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username" className="font-medium text-base">
							Username
						</Label>
						<Input
							id="username"
							type="text"
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="p-6 text-lg"
							maxLength={20}
							disabled={isLoading}
						/>
						<p className="mt-1 text-gray-500 text-sm">
							Choose a unique username (max 20 characters)
						</p>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20">
							{error}
						</div>
					)}

					<Button
						type="submit"
						size="lg"
						className="w-full py-6 text-lg"
						disabled={isLoading || !username.trim()}
					>
						{isLoading ? 'Creating Profile...' : 'Create Profile'}
					</Button>
				</CardContent>
			</Card>
		</form>
	)
}
