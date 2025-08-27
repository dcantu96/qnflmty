import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from '~/lib/auth'

export const t = initTRPC.create()
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ next }) => {
	const { session, user } = await auth()

	return next({
		ctx: {
			session,
			user,
		},
	})
})

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (!ctx.user.admin) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'You do not have permission to do this',
		})
	}

	return next({ ctx })
})
