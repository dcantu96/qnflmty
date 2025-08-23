import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '~/server/db/schema'

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb(connectionString: string) {
	if (!db) {
		if (!connectionString) {
			throw new Error(
				'DATABASE_URL environment variable is required for Cypress tasks',
			)
		}

		const sql = neon(connectionString)
		db = drizzle({ client: sql, schema })
	}

	return db
}
