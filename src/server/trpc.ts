import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/app/api/auth/[...nextauth]'

const t = initTRPC.create()

// base router you extend for all routers
export const createTRPCRouter = t.router

// helpers for procedures
export const publicProcedure = t.procedure

// protected procedure that requires authentication
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
