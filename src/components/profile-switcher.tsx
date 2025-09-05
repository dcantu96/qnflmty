'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, Edit3, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { avatarIconsMap } from '~/lib/avatar-icons'
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
import type { AvatarIcon } from '~/server/db/schema'
import { setSelectedProfile } from '~/server/user/mutations'

interface Profile {
	id: number
	username: string
	avatar: AvatarIcon
}

export function ProfileSwitcher({
	profiles = [],
	selectedProfile,
}: {
	profiles?: Profile[]
	selectedProfile?: Profile
}) {
	const avatar = selectedProfile ? avatarIconsMap[selectedProfile.avatar] : null
	const { isMobile } = useSidebar()
	const router = useRouter()

	const sortedProfiles = [...profiles].sort((a, b) =>
		a.username.toLowerCase().localeCompare(b.username.toLowerCase()),
	)

	const [isLoading, setIsLoading] = React.useState(false)
	const [showAvatarModal, setShowAvatarModal] = React.useState(false)

	const handleProfileSwitch = async (profile: Profile) => {
		if (selectedProfile && profile.id === selectedProfile.id) return // Don't switch if already active

		setIsLoading(true)

		try {
			await setSelectedProfile(profile.id)
		} catch (error) {
			console.error('Failed to switch profile:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleAvatarUpdate = () => {
		// Refresh to reload profile data
		router.refresh()
	}

	const handleAddProfile = () => {
		router.push('/create-profile')
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							disabled={isLoading}
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								{isLoading ? (
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : avatar ? (
									<avatar.icon className={`size-4 ${avatar.color}`} />
								) : (
									<User className="size-4" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{selectedProfile
										? selectedProfile.username
										: 'No Profile Selected'}
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
						{sortedProfiles.map((profile) => {
							const profileAvatar = avatarIconsMap[profile.avatar]

							return (
								<DropdownMenuItem
									key={profile.id}
									onClick={() => handleProfileSwitch(profile)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
										<profileAvatar.icon
											className={`size-3.5 shrink-0 ${profileAvatar.color}`}
										/>
									</div>
									{profile.username}
									{selectedProfile?.id === profile.id && (
										<DropdownMenuShortcut>✓</DropdownMenuShortcut>
									)}
								</DropdownMenuItem>
							)
						})}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 p-2"
							onClick={() => selectedProfile && setShowAvatarModal(true)}
							disabled={!selectedProfile}
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
			{selectedProfile && (
				<AvatarUpdateModal
					isOpen={showAvatarModal}
					onClose={() => setShowAvatarModal(false)}
					profileId={selectedProfile.id}
					currentAvatar={selectedProfile.avatar}
					profileUsername={selectedProfile.username}
					onSuccess={handleAvatarUpdate}
				/>
			)}
		</SidebarMenu>
	)
}
