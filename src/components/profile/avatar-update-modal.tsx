'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
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
import { trpcClient } from '~/lib/trpcClient'
import { useRouter } from 'next/navigation'

const avatarIcons = {
	user: { icon: User, color: 'text-blue-600', label: 'User' },
	crown: { icon: Crown, color: 'text-yellow-600', label: 'Crown' },
	zap: { icon: Zap, color: 'text-purple-600', label: 'Zap' },
	star: { icon: Star, color: 'text-orange-600', label: 'Star' },
	heart: { icon: Heart, color: 'text-red-600', label: 'Heart' },
	shield: { icon: Shield, color: 'text-green-600', label: 'Shield' },
	rocket: { icon: Rocket, color: 'text-indigo-600', label: 'Rocket' },
	gamepad: { icon: Gamepad2, color: 'text-pink-600', label: 'Gamepad' },
}

interface AvatarUpdateModalProps {
	isOpen: boolean
	onClose: () => void
	profileId: number
	currentAvatar: string | null
	profileUsername: string
	onSuccess?: () => void
}

export function AvatarUpdateModal({
	isOpen,
	onClose,
	profileId,
	currentAvatar,
	profileUsername,
	onSuccess,
}: AvatarUpdateModalProps) {
	const [selectedAvatar, setSelectedAvatar] = useState<string>(
		currentAvatar || 'user',
	)
	const [isUpdating, setIsUpdating] = useState(false)
	const router = useRouter()

	const handleUpdate = async () => {
		if (selectedAvatar === currentAvatar) {
			onClose()
			return
		}

		setIsUpdating(true)
		try {
			await trpcClient.profile.updateAvatar.mutate({
				profileId,
				avatar: selectedAvatar,
			})

			onSuccess?.()
			onClose()
			router.refresh()
		} catch (error) {
			console.error('Error updating avatar:', error)
		} finally {
			setIsUpdating(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Update Avatar</DialogTitle>
					<DialogDescription>
						Choose a new avatar for {profileUsername}
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-4 gap-4 py-4">
					{Object.entries(avatarIcons).map(
						([key, { icon: Icon, color, label }]) => (
							<button
								key={key}
								type="button"
								data-avatar={key}
								className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-gray-50 ${
									selectedAvatar === key
										? 'border-blue-500 bg-blue-50'
										: 'border-gray-200'
								}`}
								onClick={() => setSelectedAvatar(key)}
							>
								<Icon className={`h-8 w-8 ${color}`} />
								<span className="font-medium text-gray-600 text-xs">
									{label}
								</span>
							</button>
						),
					)}
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onClose} disabled={isUpdating}>
						Cancel
					</Button>
					<Button onClick={handleUpdate} disabled={isUpdating}>
						{isUpdating ? 'Updating...' : 'Update Avatar'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
