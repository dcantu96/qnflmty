import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { env } from '~/env'
import { db } from '~/server/db'
import { eq } from 'drizzle-orm'
import { users, accounts } from '~/server/db/schema'
import type { AdapterAccount } from 'next-auth/adapters'

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
				} else {
					await db.insert(accounts).values({
						userId: existingUser.id,
						type: account.type as unknown as AdapterAccount,
						provider: account.provider,
						providerAccountId: account.providerAccountId,
						access_token: account.access_token,
						token_type: account.token_type,
						expires_at: account.expires_at,
						scope: account.scope,
						id_token: account.id_token,
						session_state: account.session_state,
					})
				}
			}

			return true
		},
	},
	session: {
		strategy: 'database',
	},
} satisfies NextAuthOptions
