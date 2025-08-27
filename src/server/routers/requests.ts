import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/server/trpc'
import { requests, userAccounts, groups } from '~/server/db/schema'
import { db } from '~/server/db'

export const requestsRouter = createTRPCRouter({
	// Create a request to join a group
	create: protectedProcedure
		.input(
			z.object({
				groupId: z.number(),
				userAccountId: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { groupId, userAccountId } = input
			const {
				user: { id: userId },
			} = ctx

			try {
				// Verify the user account belongs to the current user
				const userAccount = await db.query.userAccounts.findFirst({
					where: and(
						eq(userAccounts.id, userAccountId),
						eq(userAccounts.userId, userId),
					),
				})

				if (!userAccount) {
					throw new TRPCError({
						code: 'FORBIDDEN',
						message: 'You can only make requests with your own profiles',
					})
				}

				// Check if group exists and is joinable
				const group = await db.query.groups.findFirst({
					where: eq(groups.id, groupId),
				})

				if (!group) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Group not found',
					})
				}

				if (!group.joinable || group.finished) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'This group is not accepting new members',
					})
				}

				// Check if request already exists
				const existingRequest = await db.query.requests.findFirst({
					where: and(
						eq(requests.groupId, groupId),
						eq(requests.userAccountId, userAccountId),
					),
				})

				if (existingRequest) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'You have already requested access to this group',
					})
				}

				// Create the request
				const [newRequest] = await db
					.insert(requests)
					.values({
						groupId,
						userAccountId,
					})
					.returning()

				if (!newRequest) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to create access request',
					})
				}

				return newRequest
			} catch (error) {
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
						message: 'You have already requested access to this group',
					})
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong creating your request',
				})
			}
		}),

	// Check if user has pending request for a group
	checkPending: protectedProcedure
		.input(
			z.object({
				groupId: z.number(),
				userAccountId: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { groupId, userAccountId } = input
			const {
				user: { id: userId },
			} = ctx

			// Verify the user account belongs to the current user
			const userAccount = await db.query.userAccounts.findFirst({
				where: and(
					eq(userAccounts.id, userAccountId),
					eq(userAccounts.userId, userId),
				),
			})

			if (!userAccount) {
				return { hasPendingRequest: false }
			}

			const existingRequest = await db.query.requests.findFirst({
				where: and(
					eq(requests.groupId, groupId),
					eq(requests.userAccountId, userAccountId),
					eq(requests.denied, false),
				),
			})

			return { hasPendingRequest: !!existingRequest }
		}),
})
