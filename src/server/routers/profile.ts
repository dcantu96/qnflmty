import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/trpc'
import { userAccounts } from '~/server/db/schema'
import { db } from '~/server/db'

const avatarEnum = z.enum([
	'user',
	'crown',
	'star',
	'heart',
	'diamond',
	'club',
	'spade',
	'lightning',
	'fire',
	'snowflake',
	'sun',
	'moon',
	'gamepad',
	'shield',
	'rocket',
])

export const profileRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				username: z
					.string()
					.min(1, 'Username is required')
					.max(20, 'Username must be 20 characters or less')
					.regex(
						/^[a-zA-Z0-9_-]+$/,
						'Username can only contain letters, numbers, underscores, and hyphens',
					),
				avatar: avatarEnum,
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { username, avatar } = input
			const { userId } = ctx

			try {
				// Check if username already exists (case insensitive)
				const existingAccount = await db.query.userAccounts.findFirst({
					where: eq(userAccounts.username, username.toLowerCase()),
				})

				if (existingAccount) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'Username is already taken',
					})
				}

				// Create the user account (allow multiple profiles per user)
				const [newAccount] = await db
					.insert(userAccounts)
					.values({
						userId,
						username: username.toLowerCase(),
						avatar,
					})
					.returning()

				if (!newAccount) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to create profile',
					})
				}

				return newAccount
			} catch (error) {
				// Re-throw TRPC errors
				if (error instanceof TRPCError) {
					throw error
				}

				// Handle database constraint violations
				if (
					error instanceof Error &&
					error.message.includes('unique constraint')
				) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'Username is already taken',
					})
				}

				// Generic error fallback
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong creating your profile',
				})
			}
		}),

	// Get current user's profile
	get: protectedProcedure.query(async ({ ctx }) => {
		const { userId } = ctx

		const account = await db.query.userAccounts.findFirst({
			where: eq(userAccounts.userId, userId),
		})

		return account // returns null if not found, which is fine
	}),

	// Check if username is available
	checkUsername: protectedProcedure
		.input(
			z.object({
				username: z
					.string()
					.min(1, 'Username is required')
					.max(20, 'Username must be 20 characters or less'),
			}),
		)
		.query(async ({ input }) => {
			const existingAccount = await db.query.userAccounts.findFirst({
				where: eq(userAccounts.username, input.username.toLowerCase()),
			})

			return {
				available: !existingAccount,
				username: input.username.toLowerCase(),
			}
		}),

	// Update profile avatar
	updateAvatar: protectedProcedure
		.input(
			z.object({
				profileId: z.number(),
				avatar: avatarEnum,
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { profileId, avatar } = input
			const { userId } = ctx

			try {
				// Verify the profile belongs to the current user
				const existingProfile = await db.query.userAccounts.findFirst({
					where: eq(userAccounts.id, profileId),
				})

				if (!existingProfile) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Profile not found',
					})
				}

				if (existingProfile.userId !== userId) {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: 'You can only update your own profiles',
					})
				}

				// Update the avatar
				const [updatedProfile] = await db
					.update(userAccounts)
					.set({ avatar })
					.where(eq(userAccounts.id, profileId))
					.returning()

				if (!updatedProfile) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to update avatar',
					})
				}

				return updatedProfile
			} catch (error) {
				if (error instanceof TRPCError) {
					throw error
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong updating your avatar',
				})
			}
		}),
})
