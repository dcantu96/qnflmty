'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthButtons() {
	const { data: session } = useSession()

	if (session) {
		return (
			<>
				<p>Signed in as {session.user?.email}</p>
				<button type="button" onClick={() => signOut()}>
					Sign out
				</button>
			</>
		)
	}

	return (
		<button type="button" onClick={() => signIn('google')}>
			Sign in with Google
		</button>
	)
}
