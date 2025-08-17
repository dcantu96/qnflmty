'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Plus, Edit3 } from 'lucide-react'
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
import Image from 'next/image'
import { AvatarUpdateModal } from './avatar-update-modal'

const avatarIcons = {
	user: { icon: User, color: 'text-blue-600' },
	crown: { icon: Crown, color: 'text-yellow-600' },
	zap: { icon: Zap, color: 'text-purple-600' },
	star: { icon: Star, color: 'text-orange-600' },
	heart: { icon: Heart, color: 'text-red-600' },
	shield: { icon: Shield, color: 'text-green-600' },
	rocket: { icon: Rocket, color: 'text-indigo-600' },
	gamepad: { icon: Gamepad2, color: 'text-pink-600' },
}

interface ProfileSelectorProps {
	accounts: Array<{
		id: number
		username: string
		avatar: string | null
	}>
}

export function ProfileSelector({ accounts }: ProfileSelectorProps) {
	const router = useRouter()
	const [showAvatarModal, setShowAvatarModal] = useState(false)
	const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<{
		id: number
		username: string
		avatar: string | null
	} | null>(null)

	useEffect(() => {
		// Check if there's a selected profile in localStorage and auto-redirect
		const storedProfile = localStorage.getItem('selectedProfile')
		if (storedProfile) {
			const profileId = Number.parseInt(storedProfile, 10)
			const profile = accounts.find((acc) => acc.id === profileId)
			if (profile) {
				// Auto-redirect to dashboard if valid profile is stored
				router.push('/dashboard')
				return
			}
			// Remove invalid profile from localStorage
			localStorage.removeItem('selectedProfile')
		}
	}, [accounts, router])

	const handleProfileSelect = (profileId: number) => {
		localStorage.setItem('selectedProfile', profileId.toString())
		router.push('/dashboard')
	}

	const handleCreateNew = () => {
		router.push('/create-profile')
	}

	const handleEditAvatar = (account: {
		id: number
		username: string
		avatar: string | null
	}) => {
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
					{accounts.map((account) => {
						const avatarKey = account.avatar as keyof typeof avatarIcons
						const AvatarIcon = avatarIcons[avatarKey]?.icon || User
						const avatarColor = avatarIcons[avatarKey]?.color || 'text-blue-600'

						return (
							<Card
								key={account.id}
								className="group relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
								data-testid="profile-card"
							>
								<CardContent className="flex flex-col items-center p-6">
									{/* Edit Button */}
									<Button
										variant="outline"
										size="sm"
										className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
										data-testid="edit-avatar-button"
										onClick={(e) => {
											e.stopPropagation()
											handleEditAvatar(account)
										}}
									>
										<Edit3 className="h-4 w-4" />
										<span className="sr-only">Edit avatar</span>
									</Button>

									{/* Avatar and Profile Info */}
									<button
										type="button"
										className="flex w-full flex-col items-center"
										onClick={() => handleProfileSelect(account.id)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												handleProfileSelect(account.id)
											}
										}}
									>
										<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
											<AvatarIcon className={`h-12 w-12 ${avatarColor}`} />
										</div>
										<h3 className="text-center font-semibold text-gray-900 text-lg">
											{account.username}
										</h3>
									</button>
								</CardContent>
							</Card>
						)
					})}

					{/* Add New Profile */}
					<Card
						className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
						data-testid="add-profile-card"
						onClick={handleCreateNew}
					>
						<CardContent className="flex flex-col items-center p-6">
							<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
								<Plus className="h-12 w-12 text-gray-400" />
							</div>
							<h3 className="text-center font-semibold text-gray-900 text-lg">
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
