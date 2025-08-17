'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { UserCheck, Mail, Users, Clock } from 'lucide-react'
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
	user: { icon: User, color: 'text-blue-600' },
	crown: { icon: Crown, color: 'text-yellow-600' },
	zap: { icon: Zap, color: 'text-purple-600' },
	star: { icon: Star, color: 'text-orange-600' },
	heart: { icon: Heart, color: 'text-red-600' },
	shield: { icon: Shield, color: 'text-green-600' },
	rocket: { icon: Rocket, color: 'text-indigo-600' },
	gamepad: { icon: Gamepad2, color: 'text-pink-600' },
}

interface RequestAccessFormProps {
	userAccount: {
		id: number
		username: string
		avatar: string | null
		createdAt: Date
	}
}

export function RequestAccessForm({ userAccount }: RequestAccessFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [loadingGroup, setLoadingGroup] = useState(true)
	const [activeGroup, setActiveGroup] = useState<{
		id: number
		name: string
		tournamentId: number
		joinable: boolean | null
		finished: boolean | null
		tournamentName: string
		tournamentYear: number
	} | null>(null)
	const [hasPendingRequest, setHasPendingRequest] = useState(false)
	const router = useRouter()

	const avatarKey = userAccount.avatar as keyof typeof avatarIcons
	const AvatarIcon = avatarIcons[avatarKey]?.icon || User
	const avatarColor = avatarIcons[avatarKey]?.color || 'text-blue-600'

	// Fetch active group and check pending requests on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingGroup(true)

				// Get active group
				const group = await trpcClient.groups.getActiveWithTournament.query()
				setActiveGroup(group)

				// If we have an active group, check for pending requests
				if (group) {
					const pendingCheck = await trpcClient.requests.checkPending.query({
						groupId: group.id,
						userAccountId: userAccount.id,
					})
					setHasPendingRequest(pendingCheck.hasPendingRequest)
				}
			} catch (err) {
				console.error('Error fetching data:', err)
				setError('Failed to load group information')
			} finally {
				setLoadingGroup(false)
			}
		}

		fetchData()
	}, [userAccount.id])

	const handleRequestAccess = async () => {
		if (!activeGroup) return

		setIsLoading(true)
		setError('')
		setSuccessMessage('')

		try {
			await trpcClient.requests.create.mutate({
				groupId: activeGroup.id,
				userAccountId: userAccount.id,
			})

			setSuccessMessage('Access request submitted successfully!')
			setHasPendingRequest(true)

			// Optionally redirect to profile selection after a delay
			setTimeout(() => {
				router.push('/select-profile')
			}, 2000)
		} catch (err) {
			if (
				err &&
				typeof err === 'object' &&
				'message' in err &&
				typeof err.message === 'string'
			) {
				setError(err.message)
			} else {
				setError('Failed to submit request')
			}
		} finally {
			setIsLoading(false)
		}
	}

	const isButtonDisabled =
		loadingGroup || !activeGroup || hasPendingRequest || isLoading

	const getButtonText = () => {
		if (loadingGroup) return 'Loading...'
		if (!activeGroup) return 'No Active Groups'
		if (hasPendingRequest) return 'Request Already Submitted'
		if (isLoading) return 'Submitting Request...'
		return `Request Access to ${activeGroup.name}`
	}

	return (
		<div className="space-y-8">
			{/* Profile Display */}
			<Card className="border-2">
				<CardContent className="p-8">
					<div className="flex flex-col items-center space-y-4">
						<div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
							<AvatarIcon className={`h-12 w-12 ${avatarColor}`} />
						</div>
						<div className="text-center">
							<h2 className="font-bold text-2xl text-gray-900 dark:text-white">
								{userAccount.username}
							</h2>
							<p className="mt-2 text-green-600 text-sm dark:text-green-400">
								Profile Created
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Request Access Card */}
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
						<UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
					</div>
					<CardTitle className="text-2xl">Request Access to Qnflmty</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="text-center">
						<p className="text-gray-600 dark:text-gray-300">
							Your profile is ready! Now request access to join our exclusive
							NFL prediction group.
						</p>
					</div>

					{/* Steps */}
					<div className="grid gap-4 md:grid-cols-3">
						<div className="text-center">
							<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
								<Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Send Request
							</h3>
							<p className="text-gray-600 text-sm dark:text-gray-300">
								Submit your access request to join the group
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
								<Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Wait for Approval
							</h3>
							<p className="text-gray-600 text-sm dark:text-gray-300">
								Admin will review and approve your request
							</p>
						</div>

						<div className="text-center">
							<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
								<Users className="h-5 w-5 text-green-600 dark:text-green-400" />
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Start Playing
							</h3>
							<p className="text-gray-600 text-sm dark:text-gray-300">
								Begin making predictions and competing
							</p>
						</div>
					</div>

					{/* Action Button */}
					<div className="text-center">
						{error && (
							<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
								<p className="text-red-700 text-sm">{error}</p>
							</div>
						)}

						{successMessage && (
							<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
								<p className="text-green-700 text-sm">{successMessage}</p>
							</div>
						)}

						<Button
							size="lg"
							className="px-8 py-6 text-lg"
							disabled={isButtonDisabled}
							onClick={handleRequestAccess}
						>
							{getButtonText()}
						</Button>
						<p className="mt-3 text-gray-500 text-sm">
							You'll be notified once your request is reviewed
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
