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
import { trpcClient } from '~/lib/trpcClient'
import { useRouter } from 'next/navigation'
import { avatarIconsMap } from '~/lib/avatar-icons'

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
					{Object.entries(avatarIconsMap).map(([name, avatar]) => (
						<button
							key={name}
							type="button"
							data-avatar={name}
							className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-gray-50 ${
								selectedAvatar === name
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200'
							}`}
							onClick={() => setSelectedAvatar(name)}
						>
							<avatar.icon className={`h-8 w-8 ${avatar.color}`} />
							<span className="font-medium text-gray-600 text-xs">
								{avatar.name}
							</span>
						</button>
					))}
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
