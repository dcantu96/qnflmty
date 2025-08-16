import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '~/server/trpc'
import { users } from '~/server/db/schema'
import { db } from '~/server/db'

export const usersRouter = createTRPCRouter({
	// Get user by ID
	byId: publicProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input }) => {
			const user = await db.query.users.findFirst({
				where: eq(users.id, input.id),
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found',
				})
			}

			return user
		}),

	// Get user by email
	byEmail: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.query(async ({ input }) => {
			const user = await db.query.users.findFirst({
				where: eq(users.email, input.email),
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found',
				})
			}

			return user
		}),

	// Create a new user
	create: publicProcedure
		.input(
			z.object({
				email: z.string().email('Invalid email address'),
				name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				// Check if user already exists
				const existingUser = await db.query.users.findFirst({
					where: eq(users.email, input.email),
				})

				if (existingUser) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'User with this email already exists',
					})
				}

				// Create the user
				const [newUser] = await db
					.insert(users)
					.values({
						email: input.email,
						name: input.name,
					})
					.returning()

				if (!newUser) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to create user',
					})
				}

				return newUser
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
						message: 'User with this email already exists',
					})
				}

				// Generic error fallback
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong creating the user',
				})
			}
		}),

	// Update user
	update: publicProcedure
		.input(
			z.object({
				id: z.number().int().positive(),
				data: z.object({
					name: z
						.string()
						.min(1, 'Name is required')
						.max(100, 'Name too long')
						.optional(),
					email: z.string().email('Invalid email address').optional(),
				}),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				// Check if user exists
				const existingUser = await db.query.users.findFirst({
					where: eq(users.id, input.id),
				})

				if (!existingUser) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'User not found',
					})
				}

				// If updating email, check if new email is already taken
				if (input.data.email && input.data.email !== existingUser.email) {
					const emailTaken = await db.query.users.findFirst({
						where: eq(users.email, input.data.email),
					})

					if (emailTaken) {
						throw new TRPCError({
							code: 'CONFLICT',
							message: 'Email is already taken',
						})
					}
				}

				// Update the user
				const [updatedUser] = await db
					.update(users)
					.set({
						...input.data,
						updatedAt: new Date(),
					})
					.where(eq(users.id, input.id))
					.returning()

				if (!updatedUser) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to update user',
					})
				}

				return updatedUser
			} catch (error) {
				if (error instanceof TRPCError) {
					throw error
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong updating the user',
				})
			}
		}),

	// Delete user
	delete: publicProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.mutation(async ({ input }) => {
			try {
				const [deletedUser] = await db
					.delete(users)
					.where(eq(users.id, input.id))
					.returning()

				if (!deletedUser) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'User not found',
					})
				}

				return { success: true, deletedUser }
			} catch (error) {
				if (error instanceof TRPCError) {
					throw error
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong deleting the user',
				})
			}
		}),

	// List users with pagination
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(10),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input }) => {
			const usersList = await db.query.users.findMany({
				limit: input.limit,
				offset: input.offset,
				orderBy: (users, { desc }) => [desc(users.createdAt)],
			})

			return usersList
		}),
})
