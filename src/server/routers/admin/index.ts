import { z } from 'zod'
import { ilike, count } from 'drizzle-orm'
import { adminProcedure, t } from '~/server/trpc'
import { groups } from '~/server/db/schema'
import { db } from '~/server/db'

export const adminRouter = t.router({
	list: adminProcedure
		.input(
			z.object({
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(10),
				search: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const { page, limit, search } = input
			const offset = (page - 1) * limit
			const where = search ? ilike(groups.name, `%${search}%`) : undefined

			const groupsList = await db.query.groups.findMany({
				where,
				orderBy: (groups, { desc }) => [desc(groups.createdAt)],
				limit,
				offset,
			})

			const totalResult = await db
				.select({ value: count() })
				.from(groups)
				.where(where)
			const total = totalResult[0]?.value ?? 0

			return {
				items: groupsList,
				total: total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			}
		}),
})
