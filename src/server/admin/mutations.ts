'use server'

import z, { ZodError } from 'zod'
import { adminAuth } from '~/lib/auth'
import { tournaments } from '../db/schema'
import { redirect } from 'next/navigation'
import { db } from '../db'
import { NeonDbError } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'

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

export const deleteTournament = adminAuth(async ({ id }: { id: number }) => {
	try {
		await db.delete(tournaments).where(eq(tournaments.id, id))
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
					message: 'Unique tournament already exists',
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
