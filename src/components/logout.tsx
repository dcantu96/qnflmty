'use client'

import { signOut } from 'next-auth/react'
import { Button } from '~/components/ui/button'

export function Logout() {
	return (
		<Button type="button" onClick={() => signOut()}>
			Log out
		</Button>
	)
}
