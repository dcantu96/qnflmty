import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/app/api/auth/[...nextauth]'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'

const t = initTRPC.create()
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ next }) => {
	const session = await getServerSession(authOptions)

	if (!session?.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to do this',
		})
	}

	return next({
		ctx: {
			session,
			userId: session.user.id,
		},
	})
})

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	const user = await db.query.users.findFirst({
		where: eq(users.id, ctx.userId),
	})

	if (!user?.admin) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'You do not have permission to do this',
		})
	}

	return next({ ctx })
})
