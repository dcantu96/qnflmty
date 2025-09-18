'use server'

import z from 'zod'
import { adminGuard } from '~/lib/auth'
import { groups, sports, teams, tournaments, users } from '../db/schema'
import { redirect } from 'next/navigation'
import { db } from '../db'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { fromErrorToFormState } from '../errors/errors'

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

export const createTournament = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const createGroupSchema = z.object({
	name: z.string().min(1).max(30),
	joinable: z.boolean().default(false),
	finished: z.boolean().default(false),
	paymentDueDate: z.coerce.date().optional(),
	tournamentId: z.coerce.number().int().positive(),
})

export const createGroup = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
	try {
		const data = createGroupSchema.parse({
			name: formData.get('name'),
			joinable: formData.get('joinable') === 'on',
			finished: formData.get('finished') === 'on',
			paymentDueDate: formData.get('paymentDueDate')
				? new Date(formData.get('paymentDueDate') as string)
				: undefined,
			tournamentId: Number(formData.get('tournamentId')),
		})

		await db.insert(groups).values({
			name: data.name,
			joinable: data.joinable,
			finished: data.finished,
			paymentDueDate: data.paymentDueDate,
			tournamentId: data.tournamentId,
		})
	} catch (error) {
		return fromErrorToFormState(error)
	}

	redirect('/admin/groups')
}

const updateGroupSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
	joinable: z.boolean().optional(),
	finished: z.boolean().optional(),
	paymentDueDate: z.coerce.date().optional().nullable(),
})

export const updateGroup = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
	try {
		const data = updateGroupSchema.parse({
			id: Number(formData.get('id')),
			name: formData.get('name'),
			joinable: formData.get('joinable') === 'on',
			finished: formData.get('finished') === 'on',
			paymentDueDate: formData.get('paymentDueDate')
				? new Date(formData.get('paymentDueDate') as string)
				: null,
		})

		await db
			.update(groups)
			.set({
				name: data.name,
				joinable: data.joinable,
				finished: data.finished,
				paymentDueDate: data.paymentDueDate,
			})
			.where(eq(groups.id, data.id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	redirect('/admin/groups')
}

export const updateTournament = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const updateTeamSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
	shortName: z.string().min(1).max(3).optional(),
	sportId: z.coerce.number().int().positive().optional(),
})

export const updateTeam = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const createTeamSchema = z.object({
	name: z.string().min(1).max(30),
	shortName: z.string().min(1).max(3),
	sportId: z.coerce.number().int().positive(),
})

export const createTeam = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const createSportSchema = z.object({
	name: z.string().min(1).max(30),
})

export const createSport = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const updateSportSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(30).optional(),
})

export const updateSport = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
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
}

const updateUserSchema = z.object({
	id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	phone: z
		.string()
		.min(10, 'Phone number must be at least 10 characters long')
		.max(15, 'Phone number must be at most 15 characters long')
		.optional()
		.nullable(),
})

export const updateUser = async (
	_initialState: unknown,
	formData: FormData,
) => {
	await adminGuard()
	try {
		const data = updateUserSchema.parse({
			id: Number(formData.get('id')),
			name: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone'),
		})

		await db
			.update(users)
			.set({
				name: data.name,
				email: data.email,
				phone: data.phone,
			})
			.where(eq(users.id, data.id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	redirect(`/admin/users/${formData.get('id')}`)
}

export const deleteTournament = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.delete(tournaments).where(eq(tournaments.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}
}

export const deleteSport = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.delete(sports).where(eq(sports.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}
}

export const suspendUsers = async ({ ids }: { ids: number[] }) => {
	await adminGuard()
	try {
		await db
			.update(users)
			.set({ suspended: true })
			.where(inArray(users.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/users')
}

export const activateUsers = async ({ ids }: { ids: number[] }) => {
	await adminGuard()
	try {
		await db
			.update(users)
			.set({ suspended: false })
			.where(inArray(users.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/users')
}

export const activateGroups = async ({ ids }: { ids: number[] }) => {
	await adminGuard()
	try {
		await db
			.update(groups)
			.set({ finished: false })
			.where(inArray(groups.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/groups')
}

export const finishGroups = async ({ ids }: { ids: number[] }) => {
	await adminGuard()
	try {
		await db
			.update(groups)
			.set({ finished: true })
			.where(inArray(groups.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/groups')
}

export const updateJoinableGroups = async ({
	ids,
	joinable,
}: {
	ids: number[]
	joinable: boolean
}) => {
	await adminGuard()
	try {
		await db.update(groups).set({ joinable }).where(inArray(groups.id, ids))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath('/admin/groups')
}

export const suspendUser = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.update(users).set({ suspended: true }).where(eq(users.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath(`/admin/users/${id}`)
}

export const activateUser = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.update(users).set({ suspended: false }).where(eq(users.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath(`/admin/users/${id}`)
}

export const makeAdmin = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.update(users).set({ admin: true }).where(eq(users.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath(`/admin/users/${id}`)
}

export const removeAdmin = async ({ id }: { id: number }) => {
	await adminGuard()
	try {
		await db.update(users).set({ admin: false }).where(eq(users.id, id))
	} catch (error) {
		return fromErrorToFormState(error)
	}

	revalidatePath(`/admin/users/${id}`)
}
