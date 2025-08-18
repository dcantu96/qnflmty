'use client'

import { useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AvatarUpdateModal } from './avatar-update-modal'
import { ProfileCard } from './profile-card'
import type { AvatarIcon } from '~/server/db/schema'

interface Account {
	id: number
	username: string
	avatar: AvatarIcon
}

interface ProfileSelectorProps {
	accounts: Array<Account>
}

export function ProfileSelector({ accounts }: ProfileSelectorProps) {
	const router = useRouter()
	const [showAvatarModal, setShowAvatarModal] = useState(false)
	const [selectedAccountForEdit, setSelectedAccountForEdit] =
		useState<Account | null>(null)

	const sortedAccounts = [...accounts].sort((a, b) =>
		a.username.toLowerCase().localeCompare(b.username.toLowerCase()),
	)

	const handleCreateNew = () => {
		router.push('/create-profile')
	}

	const handleEditAvatar = (account: Account) => {
		setSelectedAccountForEdit(account)
		setShowAvatarModal(true)
	}

	const handleAvatarUpdateSuccess = () => {
		setShowAvatarModal(false)
		setSelectedAccountForEdit(null)
		// Refresh the page to show updated avatar
		router.refresh()
	}

	return (
		<div className="space-y-8 text-center">
			{/* QNFLMTY Logo and Brand */}
			<div className="mb-12 space-y-4">
				<div className="flex justify-center">
					<Image
						src="/logo.svg"
						alt="QNFLMTY Logo"
						width={80}
						height={80}
						className="drop-shadow-lg"
					/>
				</div>
				<h1 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text font-bold text-5xl text-transparent">
					QNFLMTY
				</h1>
				<p className="text-gray-300 text-xl">Your Premium NFL Experience</p>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="mb-4 font-bold text-3xl text-white">Who's playing?</h2>
					<p className="text-gray-300 text-lg">
						Select your profile to continue
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-6">
					{sortedAccounts.map((account) => (
						<ProfileCard
							key={account.id}
							account={account}
							onEditAvatar={() => handleEditAvatar(account)}
						/>
					))}

					{/* Add New Profile */}
					<Card
						className="w-32 cursor-pointer transition-colors hover:bg-accent"
						onClick={handleCreateNew}
					>
						<CardContent className="flex flex-col items-center p-4">
							<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed">
								<Plus className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="w-full truncate text-center font-medium text-muted-foreground text-sm">
								Add Profile
							</h3>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Avatar Update Modal */}
			{selectedAccountForEdit && (
				<AvatarUpdateModal
					isOpen={showAvatarModal}
					onClose={() => setShowAvatarModal(false)}
					profileId={selectedAccountForEdit.id}
					currentAvatar={selectedAccountForEdit.avatar}
					profileUsername={selectedAccountForEdit.username}
					onSuccess={handleAvatarUpdateSuccess}
				/>
			)}
		</div>
	)
}
