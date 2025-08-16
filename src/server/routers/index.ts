import { createTRPCRouter } from '~/server/trpc'
import { cypressLoginRouter } from './cypress-login'

export const appRouter = createTRPCRouter({
	cypressLogin: cypressLoginRouter,
})

export type AppRouter = typeof appRouter
