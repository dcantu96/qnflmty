'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface RootRedirectProps {
	hasAccounts: boolean
}

export function RootRedirect({ hasAccounts }: RootRedirectProps) {
	const router = useRouter()

	useEffect(() => {
		if (hasAccounts) {
			// Check if there's a selected profile in localStorage
			const storedProfile = localStorage.getItem('selectedProfile')
			if (storedProfile) {
				// Redirect directly to dashboard if profile is selected
				router.push('/dashboard')
			} else {
				// No profile selected, go to profile selection
				router.push('/select-profile')
			}
		} else {
			// No accounts exist, go to profile creation
			router.push('/create-profile')
		}
	}, [hasAccounts, router])

	// Show loading while redirecting
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
			<div className="text-center">
				<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
				<p className="text-white">Loading...</p>
			</div>
		</div>
	)
}
