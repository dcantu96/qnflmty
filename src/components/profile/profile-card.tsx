'use client'

import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Edit3, User } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { selectProfileAction } from '~/lib/profile-actions'
import { avatarIconsMap, type AvatarIcon } from '~/lib/avatar-icons'

interface ProfileCardProps {
	account: {
		id: number
		username: string
		avatar: AvatarIcon
	}
	onEditAvatar: () => void
}

function ProfileCardContent({
	account,
	onEditAvatar,
}: Pick<ProfileCardProps, 'account' | 'onEditAvatar'>) {
	const { pending } = useFormStatus()
	const avatar = avatarIconsMap[account.avatar]

	return (
		<CardContent className="flex flex-col items-center p-4">
			{/* Loading Overlay */}
			{pending && (
				<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-2">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
						<span className="text-muted-foreground text-xs">Loading...</span>
					</div>
				</div>
			)}

			{/* Edit Button */}
			<Button
				variant="ghost"
				size="sm"
				className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={(e) => {
					e.stopPropagation()
					onEditAvatar()
				}}
				disabled={pending}
			>
				<Edit3 className="h-4 w-4" />
				<span className="sr-only">Edit avatar</span>
			</Button>

			{/* Avatar and Profile Info */}
			<button
				type="submit"
				className="flex w-full flex-col items-center"
				disabled={pending}
			>
				<input type="hidden" name="profileId" value={account.id} />
				<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-accent">
					<avatar.icon className={`h-8 w-8 ${avatar.color}`} />
				</div>
				<h3
					className="w-full truncate text-center font-medium text-sm"
					title={account.username}
				>
					{account.username}
				</h3>
			</button>
		</CardContent>
	)
}

export function ProfileCard({ account, onEditAvatar }: ProfileCardProps) {
	return (
		<Card className="group relative w-32 cursor-pointer transition-colors hover:bg-accent">
			<form action={selectProfileAction}>
				<ProfileCardContent account={account} onEditAvatar={onEditAvatar} />
			</form>
		</Card>
	)
}
