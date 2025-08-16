import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

// base router you extend for all routers
export const createTRPCRouter = t.router

// helpers for procedures
export const publicProcedure = t.procedure
