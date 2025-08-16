import { createTRPCRouter } from '~/server/trpc'
import { cypressLoginRouter } from './cypress-login'
import { usersRouter } from './users'

export const appRouter = createTRPCRouter({
	cypressLogin: cypressLoginRouter,
	users: usersRouter,
})

export type AppRouter = typeof appRouter
