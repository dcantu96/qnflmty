import { RootRedirect } from '~/components/root-redirect'
import { db } from '~/server/db'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'

export default async function HomePage() {
	const session = await useAuthenticatedSession()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	// Use client-side component to handle localStorage check and routing
	return <RootRedirect hasAccounts={accounts.length > 0} />
}
