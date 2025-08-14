import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { parse, type Options } from 'csv-parse/sync'
import * as schema from '~/server/db/schema'
import { db } from './scripts-db'
import { eq } from 'drizzle-orm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const csvConfig = {
	columns: true,
	skip_empty_lines: true,
} satisfies Options

function chunkArray<T>(arr: T[], size: number): T[][] {
	const chunks = []
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size))
	}
	return chunks
}
const batchSize = 200

interface CsvUser {
	id: string
	email: string
	encrypted_password: string
	full_name: string
	phone?: string
}

async function seedUsers() {
	const csvPath = join(__dirname, 'csv/users.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvUser[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.users).values({
				id: Number(row.id),
				email: row.email,
				name: row.full_name,
				encryptedPassword: row.encrypted_password,
				phone: row.phone,
			}),
		),
	)

	console.log('✅ Users imported successfully!')
}

interface CsvAccounts {
	id: string
	user_id: string
	username: string
}

async function seedAccounts() {
	const csvPath = join(__dirname, 'csv/accounts.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvAccounts[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.userAccounts).values({
				id: Number(row.id),
				userId: Number(row.user_id),
				username: row.username,
			}),
		),
	)

	console.log('✅ User Accounts imported successfully!')
}

interface CsvSport {
	id: string
	name: string
}

async function seedSports() {
	const csvPath = join(__dirname, 'csv/sports.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvSport[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.sports).values({
				id: Number(row.id),
				name: row.name,
			}),
		),
	)

	console.log('✅ Sports imported successfully!')
}

interface CsvTournament {
	id: string
	name: string
	sport_id: string
	year: string
}

async function seedTournaments() {
	const csvPath = join(__dirname, 'csv/tournaments.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvTournament[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.tournaments).values({
				id: Number(row.id),
				name: row.name,
				sportId: Number(row.sport_id),
				year: Number(row.year),
			}),
		),
	)

	console.log('✅ Tournaments imported successfully!')
}

interface CsvWeek {
	id: string
	number: string
	finished: string
	tournament_id: string
}

async function seedWeeks() {
	const csvPath = join(__dirname, 'csv/weeks.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvWeek[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.weeks).values({
				id: Number(row.id),
				number: Number(row.number),
				finished: row.finished === 't',
				tournamentId: Number(row.tournament_id),
			}),
		),
	)

	console.log('✅ Weeks imported successfully!')
}

interface CsvGroup {
	id: string
	name: string
	private: string
	tournament_id: string
	finished: string
	joinable: string
}

async function seedGroups() {
	const csvPath = join(__dirname, 'csv/groups.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvGroup[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.groups).values({
				id: Number(row.id),
				name: row.name,
				finished: row.finished === 't',
				joinable: row.joinable === 't',
				tournamentId: Number(row.tournament_id),
			}),
		),
	)

	console.log('✅ Groups imported successfully!')
}

interface CsvRequest {
	id: string
	group_id: string
	account_id: string
	denied: string
}

async function seedRequests() {
	const csvPath = join(__dirname, 'csv/requests.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvRequest[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.requests).values({
				id: Number(row.id),
				groupId: Number(row.group_id),
				userAccountId: Number(row.account_id),
				denied: row.denied === 't',
			}),
		),
	)

	console.log('✅ Requests imported successfully!')
}

interface CsvMembership {
	id: string
	account_id: string
	group_id: string
	paid?: string
	suspended?: string
	notes?: string
	position?: string
	total?: string
	forgot_picks?: string
}

async function seedMemberships() {
	const csvPath = join(__dirname, 'csv/memberships.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvMembership[] = parse(csvFile, csvConfig)

	const batches = chunkArray(records, batchSize)

	for (const batch of batches) {
		await Promise.all(
			batch.map((row) =>
				db.insert(schema.memberships).values({
					id: Number(row.id),
					userAccountId: Number(row.account_id),
					groupId: Number(row.group_id),
					paid: row.paid === 't',
					suspended: row.suspended === 't',
					notes: row.notes || null,
					position: row.position ? Number(row.position) : 0,
					total: row.total ? Number(row.total) : 0,
					forgotPicks: row.forgot_picks === 't',
				}),
			),
		)
	}

	console.log('✅ Memberships imported successfully!')
}

interface CsvTeam {
	id: string
	name: string
	short_name: string
	sport_id: string
}

async function seedTeams() {
	const csvPath = join(__dirname, 'csv/teams.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvTeam[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db.insert(schema.teams).values({
				id: Number(row.id),
				name: row.name,
				shortName: row.short_name,
				sportId: Number(row.sport_id),
			}),
		),
	)

	console.log('✅ Teams imported successfully!')
}

interface CsvMembershipWeek {
	id: string
	membership_id: string
	week_id: string
	points: string
	forgot_picks?: string
}

async function seedMembershipWeeks() {
	const csvPath = join(__dirname, 'csv/membership_weeks.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvMembershipWeek[] = parse(csvFile, csvConfig)
	const batches = chunkArray(records, batchSize)

	for (const batch of batches) {
		await Promise.all(
			batch.map((row) =>
				db.insert(schema.membershipWeeks).values({
					id: Number(row.id),
					membershipId: Number(row.membership_id),
					weekId: Number(row.week_id),
					points: Number(row.points),
					forgotPicks: row.forgot_picks === 't',
				}),
			),
		)
	}

	console.log('✅ Membership Weeks imported successfully!')
}

interface CsvMatch {
	id: string
	start_time: string
	week_id: string
	visit_team_id: string
	home_team_id: string
	winning_team_id?: string
	untie: string
	premium: string
	visit_team_score: string
	home_team_score: string
	order: string
	tie: string
}

async function seedMatches() {
	const csvPath = join(__dirname, 'csv/matches.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvMatch[] = parse(csvFile, csvConfig)

	const batches = chunkArray(records, batchSize)

	for (const batch of batches) {
		await Promise.all(
			batch.map((row) =>
				db.insert(schema.matches).values({
					id: Number(row.id),
					startTime: new Date(row.start_time),
					weekId: Number(row.week_id),
					visitTeamId: Number(row.visit_team_id),
					homeTeamId: Number(row.home_team_id),
					winningTeamId: row.winning_team_id
						? Number(row.winning_team_id)
						: null,
					untie: row.untie === 't',
					premium: row.premium === 't',
					visitTeamScore: Number(row.visit_team_score),
					homeTeamScore: Number(row.home_team_score),
					order: Number(row.order),
					tie: row.tie === 't',
				}),
			),
		)
	}

	console.log('✅ Matches imported successfully!')
}

interface CsvPick {
	id: string
	match_id: string
	picked_team_id?: string
	correct: string
	points: string
	membership_week_id: string
	modified_by_admin: string
	created_at: string
	updated_at: string
}

async function seedPicks() {
	const csvPath = join(__dirname, 'csv/picks.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvPick[] = parse(csvFile, csvConfig)

	const batches = chunkArray(records, batchSize)
	for (const batch of batches) {
		await Promise.all(
			batch.map((row) =>
				db.insert(schema.picks).values({
					id: Number(row.id),
					matchId: Number(row.match_id),
					pickedTeamId: row.picked_team_id ? Number(row.picked_team_id) : null,
					correct: row.correct === 't',
					points: Number(row.points),
					membershipWeekId: Number(row.membership_week_id),
					modifiedByAdmin: row.modified_by_admin === 't',
					createdAt: new Date(row.created_at),
					updatedAt: new Date(row.updated_at),
				}),
			),
		)
	}
	console.log('✅ Picks imported successfully!')
}

interface CsvGroupWeek {
	id: string
	group_id: string
	week_id: string
	forgotten_picks_email: string
	lowest_valid_points: string
}

async function seedGroupWeeks() {
	const csvPath = join(__dirname, 'csv/group_weeks.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvGroupWeek[] = parse(csvFile, csvConfig)
	await Promise.all(
		records.map((row) =>
			db.insert(schema.groupWeeks).values({
				id: Number(row.id),
				groupId: Number(row.group_id),
				weekId: Number(row.week_id),
				lowestValidPoints: row.lowest_valid_points
					? Number(row.lowest_valid_points)
					: null,
			}),
		),
	)
	console.log('✅ Group Weeks imported successfully!')
}

interface CsvWinner {
	id: string
	membership_week_id: string
}

async function seedWinners() {
	const csvPath = join(__dirname, 'csv/winners.csv')
	const csvFile = fs.readFileSync(csvPath, 'utf-8')

	const records: CsvWinner[] = parse(csvFile, csvConfig)

	await Promise.all(
		records.map((row) =>
			db
				.update(schema.membershipWeeks)
				.set({
					weekWinner: true,
				})
				.where(eq(schema.membershipWeeks.id, Number(row.membership_week_id))),
		),
	)

	console.log('✅ Winners imported successfully!')
}

async function seed() {
	try {
		await seedUsers()
		await seedAccounts()
		await seedSports()
		await seedTournaments()
		await seedWeeks()
		await seedGroups()
		await seedRequests()
		await seedMemberships()
		await seedTeams()
		await seedMembershipWeeks()
		await seedMatches()
		await seedPicks()
		await seedGroupWeeks()
		await seedWinners()
	} catch (error) {
		console.error('Error seeding data:', error)
	}
}

seed()
