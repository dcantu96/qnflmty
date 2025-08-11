import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { env } from '~/env'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import { users } from '~/server/db/schema'

export const authOptions = {
	adapter: DrizzleAdapter(db),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google') {
				const email = user.email
				if (!email) {
					throw new Error('Email is required for Google sign-in')
				}
				const existingUser = await db.query.users.findFirst({
					where: (u, { eq }) => eq(u.email, email),
				})

				if (!existingUser) {
					await db
						.update(users)
						.set({
							name: user.name ?? '',
							image: user.image ?? '',
						})
						.where(eq(users.id, user.id))
				}
			}

			return true
		},
	},
	session: {
		strategy: 'database',
	},
} satisfies NextAuthOptions
