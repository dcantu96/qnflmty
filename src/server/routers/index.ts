import { createTRPCRouter } from '~/server/trpc'
import { cypressLoginRouter } from './cypress-login'
import { usersRouter } from './users'
import { profileRouter } from './profile'
import { groupsRouter } from './groups'
import { requestsRouter } from './requests'

export const appRouter = createTRPCRouter({
	cypressLogin: cypressLoginRouter,
	users: usersRouter,
	profile: profileRouter,
	groups: groupsRouter,
	requests: requestsRouter,
})

export type AppRouter = typeof appRouter
