import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	unique,
	serial,
	check,
	pgEnum,
} from 'drizzle-orm/pg-core'

import type { AdapterAccount } from 'next-auth/adapters'

// Define the avatar icon enum to match our centralized avatar system

export type AvatarIcon =
	| 'club'
	| 'crown'
	| 'diamond'
	| 'fire'
	| 'gamepad'
	| 'heart'
	| 'lightning'
	| 'moon'
	| 'rocket'
	| 'shield'
	| 'snowflake'
	| 'spade'
	| 'star'
	| 'sun'
	| 'user'

export const avatarEnum = pgEnum('avatar_icon', [
	'club',
	'crown',
	'diamond',
	'fire',
	'gamepad',
	'heart',
	'lightning',
	'moon',
	'rocket',
	'shield',
	'snowflake',
	'spade',
	'star',
	'sun',
	'user',
])

export const users = pgTable('user', {
	id: serial('id').primaryKey(),
	name: text('name'),
	email: text('email').unique(),
	admin: boolean('admin').default(false).notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	encryptedPassword: text('encryptedPassword'),
	phone: text('phone'),
	createdAt: timestamp('createdAt', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updatedAt', { withTimezone: true })
		.defaultNow()
		.notNull(),
})

export const accounts = pgTable(
	'account',
	{
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId],
			}),
		},
	],
)

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(verificationToken) => [
		{
			compositePk: primaryKey({
				columns: [verificationToken.identifier, verificationToken.token],
			}),
		},
	],
)

export const authenticators = pgTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: boolean('credentialBackedUp').notNull(),
		transports: text('transports'),
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID],
			}),
		},
	],
)

export const userAccounts = pgTable('user_account', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	username: text('username').notNull().unique(),
	avatar: avatarEnum('avatar').default('user').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})

export const sports = pgTable('sport', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})

export const tournaments = pgTable(
	'tournament',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		sportId: integer('sport_id')
			.notNull()
			.references(() => sports.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		year: integer('year').notNull(),
	},
	(t) => [unique().on(t.sportId, t.name, t.year)],
)

export const weeks = pgTable(
	'week',
	{
		id: serial('id').primaryKey(),
		number: integer('number').notNull(),
		finished: boolean('finished').default(false).notNull(),
		tournamentId: integer('tournament_id')
			.notNull()
			.references(() => tournaments.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(w) => [unique().on(w.number, w.tournamentId)],
)

export const groups = pgTable(
	'group',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		finished: boolean('finished').default(false),
		joinable: boolean('joinable').default(false),
		tournamentId: integer('tournament_id').notNull(),
		paymentDueDate: timestamp('payment_due_date', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [unique().on(t.tournamentId, t.name)],
)

export const requests = pgTable(
	'request',
	{
		id: serial('id').primaryKey(),
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		userAccountId: integer('user_account_id')
			.notNull()
			.references(() => userAccounts.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		denied: boolean('denied').default(false),
	},
	(r) => [unique().on(r.groupId, r.userAccountId)],
)

export const memberships = pgTable(
	'membership',
	{
		id: serial('id').primaryKey(),
		userAccountId: integer('user_account_id')
			.notNull()
			.references(() => userAccounts.id, { onDelete: 'cascade' }),
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		paid: boolean('paid').default(false),
		suspended: boolean('suspended').default(false),
		notes: text('notes'),
		position: integer('position').default(0),
		total: integer('total').default(0),
		forgotPicks: boolean('forgot_picks').default(false),
	},
	(m) => [unique().on(m.userAccountId, m.groupId)],
)

export const teams = pgTable('team', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	shortName: text('short_name').notNull(),
	sportId: integer('sport_id')
		.notNull()
		.references(() => sports.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})

export const membershipWeeks = pgTable(
	'membership_week',
	{
		id: serial('id').primaryKey(),
		membershipId: integer('membership_id')
			.notNull()
			.references(() => memberships.id, { onDelete: 'cascade' }),
		weekId: integer('week_id')
			.notNull()
			.references(() => weeks.id, { onDelete: 'cascade' }),
		points: integer('points').default(0).notNull(),
		weekWinner: boolean('week_winner').default(false).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		forgotPicks: boolean('forgot_picks').default(false),
	},
	(mw) => [unique().on(mw.membershipId, mw.weekId)],
)

export const matches = pgTable(
	'match',
	{
		id: serial('id').primaryKey(),
		weekId: integer('week_id').notNull(),
		homeTeamId: integer('home_team_id')
			.notNull()
			.references(() => teams.id, {
				onDelete: 'cascade',
			}),
		visitTeamId: integer('visit_team_id')
			.notNull()
			.references(() => teams.id, {
				onDelete: 'cascade',
			}),
		winningTeamId: integer('winning_team_id'),
		startTime: timestamp('start_time', { withTimezone: true }),
		untie: boolean('untie').default(false),
		premium: boolean('premium').default(false),
		visitTeamScore: integer('visit_team_score'),
		homeTeamScore: integer('home_team_score'),
		tie: boolean('tie').default(false),
		order: integer('order'),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(m) => [
		unique().on(m.weekId, m.homeTeamId),
		unique().on(m.weekId, m.visitTeamId),
		check(
			'winning_team_valid',
			sql`${m.winningTeamId} IS NULL OR ${m.winningTeamId} = ${m.homeTeamId} OR ${m.winningTeamId} = ${m.visitTeamId}`,
		),
	],
)

export const picks = pgTable(
	'pick',
	{
		id: serial('id').primaryKey(),
		matchId: integer('match_id')
			.notNull()
			.references(() => matches.id, { onDelete: 'cascade' }),
		membershipWeekId: integer('membership_week_id')
			.notNull()
			.references(() => membershipWeeks.id, { onDelete: 'cascade' }),
		pickedTeamId: integer('picked_team_id').references(() => teams.id, {
			onDelete: 'set null',
		}),
		correct: boolean('correct').default(false).notNull(),
		points: integer('points').default(0).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		modifiedByAdmin: boolean('modified_by_admin').default(false),
	},
	(p) => [unique().on(p.matchId, p.membershipWeekId)],
)

export const groupWeeks = pgTable(
	'group_week',
	{
		id: serial('id').primaryKey(),
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' }),
		weekId: integer('week_id')
			.notNull()
			.references(() => weeks.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		lowestValidPoints: integer('lowest_valid_points'),
	},
	(g) => [unique().on(g.groupId, g.weekId)],
)

export const sportsRelations = relations(sports, ({ many }) => ({
	tournaments: many(tournaments),
	teams: many(teams),
}))

export const tournamentsRelations = relations(tournaments, ({ one }) => ({
	sport: one(sports, {
		fields: [tournaments.sportId],
		references: [sports.id],
	}),
}))

export const teamsRelations = relations(teams, ({ one }) => ({
	sport: one(sports, {
		fields: [teams.sportId],
		references: [sports.id],
	}),
}))
