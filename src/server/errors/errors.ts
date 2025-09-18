import { NeonDbError } from '@neondatabase/serverless'
import { ZodError } from 'zod'

export const fromErrorToFormState = async (error: unknown) => {
	if (error instanceof ZodError) {
		return {
			message: error.errors[0]?.message,
		}
	}

	if (error instanceof NeonDbError) {
		switch (error.code) {
			case '23505':
				if (error.constraint === 'group_tournament_id_name_unique') {
					return {
						message:
							'A group with this name already exists for this tournament',
					}
				}
				if (error.constraint === 'tournament_sport_id_name_year_unique') {
					return {
						message:
							'A tournament with this name and year already exists for this sport',
					}
				}
				if (error.constraint === 'sport_name_unique') {
					return {
						message: 'A sport with this name already exists',
					}
				}
				if (error.constraint === 'team_name_unique') {
					return {
						message: 'A team with this name already exists',
					}
				}
				if (error.constraint === 'user_account_username_unique') {
					return {
						message: 'Username is already taken',
					}
				}
				return {
					message: `This ${error.table || 'item'} already exists`,
				}
			case '23514':
				if (error.constraint === 'username_not_empty') {
					return {
						message: 'Username is required',
					}
				}
				if (error.constraint === 'username_max_length') {
					return {
						message: 'Username must be 20 characters or less',
					}
				}
				if (error.constraint === 'username_format') {
					return {
						message:
							'Username can only contain letters, numbers, underscores, and hyphens',
					}
				}
				return {
					message: 'Invalid data provided',
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
