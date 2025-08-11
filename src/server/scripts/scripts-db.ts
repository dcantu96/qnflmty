import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from '../db/schema'

// Read DATABASE_URL directly from env, no extra layers
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is required for seeding')
}

const sql = neon(connectionString)
export const db = drizzle({ client: sql, schema })
