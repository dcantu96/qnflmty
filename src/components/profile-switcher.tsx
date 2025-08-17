'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '~/components/ui/sidebar'
import { AvatarUpdateModal } from '~/components/profile/avatar-update-modal'

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

interface Profile {
	id: number
	username: string
	avatar: string | null
}

export function ProfileSwitcher({
	profiles,
}: {
	profiles: Profile[]
}) {
	const { isMobile } = useSidebar()
	const router = useRouter()

	// Get the currently selected profile from localStorage
	const [activeProfile, setActiveProfile] = React.useState<Profile | null>(null)
	const [isLoading, setIsLoading] = React.useState(false)
	const [showAvatarModal, setShowAvatarModal] = React.useState(false)

	React.useEffect(() => {
		const storedProfileId = localStorage.getItem('selectedProfile')
		if (storedProfileId) {
			const profile = profiles.find(
				(p) => p.id === Number.parseInt(storedProfileId, 10),
			)
			if (profile) {
				setActiveProfile(profile)
			} else {
				// If stored profile doesn't exist, default to first profile
				const firstProfile = profiles[0]
				if (firstProfile) {
					setActiveProfile(firstProfile)
					localStorage.setItem('selectedProfile', firstProfile.id.toString())
				}
			}
		} else {
			// No stored profile, default to first
			const firstProfile = profiles[0]
			if (firstProfile) {
				setActiveProfile(firstProfile)
				localStorage.setItem('selectedProfile', firstProfile.id.toString())
			}
		}
	}, [profiles])

	const handleProfileSwitch = async (profile: Profile) => {
		if (profile.id === activeProfile?.id) return // Don't switch if already active

		setIsLoading(true)
		setActiveProfile(profile)
		localStorage.setItem('selectedProfile', profile.id.toString())

		// Small delay to ensure smooth transition
		await new Promise((resolve) => setTimeout(resolve, 200))

		setIsLoading(false)
		// Only refresh if we're not already on the dashboard
		if (window.location.pathname !== '/dashboard') {
			router.push('/dashboard')
		}
	}

	const handleAddProfile = () => {
		router.push('/create-profile')
	}

	const handleAvatarUpdate = () => {
		// Refresh profiles by triggering a re-render
		window.location.reload()
	}

	if (!activeProfile) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" className="animate-pulse">
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/20">
							<User className="size-4 text-sidebar-primary/40" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="text-sidebar-primary/40">Loading...</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	const avatarKey = activeProfile.avatar as keyof typeof avatarIcons
	const AvatarIcon = avatarIcons[avatarKey]?.icon || User
	const avatarColor = avatarIcons[avatarKey]?.color || 'text-blue-600'

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							disabled={isLoading}
							data-testid="profile-switcher"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								{isLoading ? (
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : (
									<AvatarIcon className="size-4" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeProfile.username}
								</span>
								<span className="truncate text-sidebar-muted-foreground text-xs">
									QNFLMTY Profile
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Profiles
						</DropdownMenuLabel>
						{profiles.map((profile, index) => {
							const profileAvatarKey =
								profile.avatar as keyof typeof avatarIcons
							const ProfileAvatarIcon =
								avatarIcons[profileAvatarKey]?.icon || User
							const profileAvatarColor =
								avatarIcons[profileAvatarKey]?.color || 'text-blue-600'

							return (
								<DropdownMenuItem
									key={profile.id}
									onClick={() => handleProfileSwitch(profile)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
										<ProfileAvatarIcon
											className={`size-3.5 shrink-0 ${profileAvatarColor}`}
										/>
									</div>
									{profile.username}
									{activeProfile.id === profile.id && (
										<DropdownMenuShortcut>✓</DropdownMenuShortcut>
									)}
								</DropdownMenuItem>
							)
						})}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 p-2"
							onClick={() => setShowAvatarModal(true)}
						>
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Edit3 className="size-4" />
							</div>
							<div className="font-medium text-muted-foreground">
								Edit avatar
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem className="gap-2 p-2" onClick={handleAddProfile}>
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="font-medium text-muted-foreground">
								Add profile
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>

			{/* Avatar Update Modal */}
			{activeProfile && (
				<AvatarUpdateModal
					isOpen={showAvatarModal}
					onClose={() => setShowAvatarModal(false)}
					profileId={activeProfile.id}
					currentAvatar={activeProfile.avatar}
					profileUsername={activeProfile.username}
					onSuccess={handleAvatarUpdate}
				/>
			)}
		</SidebarMenu>
	)
}
