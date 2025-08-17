import { AuthButtons } from '~/components/auth-buttons'
import { FullPageLayout } from '~/components/layout/full-page-layout'
import { WelcomeMessage } from '~/components/welcome/welcome-message'
import { WhatsNextSection } from '~/components/welcome/whats-next-section'
import { GroupInfoSection } from '~/components/welcome/group-info-section'
import { RootRedirect } from '~/components/root-redirect'
import { db } from '~/server/db'
import { useAuthenticatedSession } from '~/hooks/use-authenticated-session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
	const session = await useAuthenticatedSession()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
	})

	// Use client-side component to handle localStorage check and routing
	return <RootRedirect hasAccounts={accounts.length > 0} />
}
