'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { auth, getSession, isAdminSession } from '~/lib/auth'
import { db } from '~/server/db'
import {
	enforceGroupMembership,
	getSelectedProfile,
} from '~/server/user/queries'

/**
 * Dashboard Layout Auth Handler
 * Handles all authentication and data fetching logic for dashboard layout
 */
export async function handleDashboardAuth() {
	const { session, user } = await auth()

	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	if (accounts.length === 0) {
		redirect('/create-profile')
	}

	const selectedProfile = await getSelectedProfile()
	if (!selectedProfile) {
		redirect('/select-profile')
	}

	// Ensure the selected profile has access to the active group
	await enforceGroupMembership()

	const userData = {
		admin: user.admin,
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image || undefined,
	}

	return {
		userData,
		accounts,
		selectedProfile,
	}
}

/**
 * Admin Layout Auth Handler
 * Handles authentication and data fetching for admin layout
 */
export async function handleAdminAuth() {
	const { session, user } = await auth()

	if (!user.admin) {
		redirect('/unauthorized')
	}

	const [selectedProfile, accounts] = await Promise.all([
		getSelectedProfile(),
		db.query.userAccounts.findMany({
			where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
		}),
	])

	const userData = {
		admin: user.admin,
		name: session.user.name || 'User',
		email: session.user.email || '',
		avatar: session.user.image ?? undefined,
	}

	return {
		userData,
		accounts,
		selectedProfile,
	}
}

/**
 * Root Page Redirect Handler
 * Handles all redirect logic for the root page
 */
export async function handleRootRedirect(): Promise<void> {
	const session = await getSession()

	if (!session) return

	const cookiesStore = await cookies()
	const selectedProfileId = cookiesStore.get('selectedProfile')?.value
	const isAdmin = await isAdminSession()

	if (isAdmin) {
		if (selectedProfileId) {
			redirect('/dashboard')
		} else {
			const accounts = await db.query.userAccounts.findMany({
				where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
			})

			if (accounts.length > 0) {
				redirect('/select-profile')
			} else {
				redirect('/admin')
			}
		}
	} else if (selectedProfileId) {
		redirect('/dashboard')
	} else {
		redirect('/select-profile')
	}
}

/**
 * Generic User Auth Handler
 * For pages that just need authenticated user data without complex logic
 */
export async function handleUserAuth() {
	const { session, user } = await auth()

	return {
		session,
		user,
		userData: {
			admin: user.admin,
			name: session.user.name || 'User',
			email: session.user.email || '',
			avatar: session.user.image || undefined,
		},
	}
}
