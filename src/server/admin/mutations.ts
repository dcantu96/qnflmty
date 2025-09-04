'use server'

import z, { ZodError } from 'zod'
import { adminAuth } from '~/lib/auth'
import { sports, teams, tournaments, users } from '../db/schema'
import { redirect } from 'next/navigation'
import { db } from '../db'
import { NeonDbError } from '@neondatabase/serverless'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const createTournamentSchema = z.object({
	name: z.string().min(1).max(30),
	year: z.number().min(2000).max(2100),
	sportId: z.coerce.number().int().positive(),
})

const updateTournamentSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
	year: z.number().min(2000).max(2100).optional(),
	sportId: z.coerce.number().int().positive().optional(),
})

export const createTournament = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = createTournamentSchema.parse({
				name: formData.get('name'),
				year: Number(formData.get('year')),
				sportId: Number(formData.get('sportId')),
			})

			await db.insert(tournaments).values({
				name: data.name,
				year: data.year,
				sportId: data.sportId,
			})
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect('/admin/tournaments')
	},
)

export const updateTournament = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = updateTournamentSchema.parse({
				id: Number(formData.get('id')),
				name: formData.get('name'),
				year: Number(formData.get('year')),
				sportId: Number(formData.get('sportId')),
			})

			await db
				.update(tournaments)
				.set({
					name: data.name,
					year: data.year,
					sportId: data.sportId,
				})
				.where(eq(tournaments.id, data.id))
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect('/admin/tournaments')
	},
)

const updateTeamSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
	shortName: z.string().min(1).max(3).optional(),
	sportId: z.coerce.number().int().positive().optional(),
})

export const updateTeam = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = updateTeamSchema.parse({
				id: Number(formData.get('id')),
				name: formData.get('name'),
				shortName: formData.get('shortName'),
				sportId: Number(formData.get('sportId')),
			})

			await db
				.update(teams)
				.set({
					name: data.name,
					shortName: data.shortName,
					sportId: data.sportId,
				})
				.where(eq(teams.id, data.id))
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect(`/admin/sports/${formData.get('sportId')}/teams`)
	},
)

const createTeamSchema = z.object({
	name: z.string().min(1).max(30),
	shortName: z.string().min(1).max(3),
	sportId: z.coerce.number().int().positive(),
})

export const createTeam = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = createTeamSchema.parse({
				name: formData.get('name'),
				shortName: formData.get('shortName'),
				sportId: Number(formData.get('sportId')),
			})

			await db.insert(teams).values({
				name: data.name,
				shortName: data.shortName,
				sportId: data.sportId,
			})
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect(`/admin/sports/${formData.get('sportId')}/teams`)
	},
)

const createSportSchema = z.object({
	name: z.string().min(1).max(30),
})

export const createSport = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = createSportSchema.parse({
				name: formData.get('name'),
			})

			await db.insert(sports).values({
				name: data.name,
			})
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect('/admin/sports')
	},
)

const updateSportSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
})

export const updateSport = adminAuth(
	async (_initialState: unknown, formData: FormData) => {
		try {
			const data = updateSportSchema.parse({
				id: Number(formData.get('id')),
				name: formData.get('name'),
			})

			await db
				.update(sports)
				.set({
					name: data.name,
				})
				.where(eq(sports.id, data.id))
		} catch (error) {
			return fromErrorToFormState(error)
		}

		redirect('/admin/sports')
	},
)

export const deleteTournament = adminAuth(async ({ id }: { id: number }) => {
	try {
		await db.delete(tournaments).where(eq(tournaments.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}
})

export const deleteSport = adminAuth(async ({ id }: { id: number }) => {
	try {
		await db.delete(sports).where(eq(sports.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}
})

export const fromErrorToFormState = async (error: unknown) => {
	if (error instanceof ZodError) {
		return {
			message: error.errors[0]?.message,
		}
	}

	if (error instanceof NeonDbError) {
		switch (error.code) {
			case '23505':
				return {
					message: `Unique ${error.table} already exists`,
				}
			default:
				return {
					message: error.message,
				}
		}
	}

	if (error instanceof Error) {
		return {
			message: error.message,
		}
	}
	return {
		message: 'An unknown error occurred',
	}
}

export const suspendUsers = adminAuth(async ({ ids }: { ids: number[] }) => {
	try {
		await db
			.update(users)
			.set({ suspended: true })
			.where(inArray(users.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/users')
})

export const activateUsers = adminAuth(async ({ ids }: { ids: number[] }) => {
	try {
		await db
			.update(users)
			.set({ suspended: false })
			.where(inArray(users.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/users')
})
