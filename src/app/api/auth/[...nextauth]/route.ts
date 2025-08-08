import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { env } from '~/env'
import { db } from '~/server/db'

export const authOptions = {
	adapter: DrizzleAdapter(db),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	session: {
		strategy: 'database',
	},
} satisfies NextAuthOptions

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
