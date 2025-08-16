import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { createTRPCRouter, publicProcedure } from '~/server/trpc'
import { sessions, users } from '~/server/db/schema'
import { db } from '~/server/db'
import { env } from '~/env'

export const cypressLoginRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.mutation(async ({ input }) => {
			if (env.NODE_ENV === 'production') {
				throw new Error('Not authorized to run in production')
			}

			let user = await db.query.users.findFirst({
				where: eq(users.email, input.email),
			})

			if (!user) {
				const [newUser] = await db
					.insert(users)
					.values({ email: input.email, name: 'Cypress User' })
					.returning()
				user = newUser
			}

			if (!user || !user.id) {
				throw new Error('Failed to ensure user for session creation')
			}

			const sessionToken = randomUUID()
			const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
			await db
				.insert(sessions)
				.values({ sessionToken, userId: user.id, expires })

			return { sessionToken }
		}),
})
