import { ProfileCreationForm } from '~/components/profile/profile-creation-form'
import { auth } from '~/lib/auth'
import { db } from '~/server/db'

export default async function CreateProfilePage() {
	const { user } = await auth()
	const accounts = await db.query.userAccounts.findMany({
		where: (accounts, { eq }) => eq(accounts.userId, user.id),
	})

	const isFirstProfile = accounts.length === 0

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 text-center">
						<h1 className="mb-4 font-bold text-4xl text-gray-900 dark:text-white">
							{isFirstProfile ? 'Create Your Profile' : 'Create New Profile'}
						</h1>
						<p className="text-gray-600 text-lg dark:text-gray-300">
							{isFirstProfile
								? 'Choose a username and avatar to get started with Qnflmty'
								: 'Add another profile to your account'}
						</p>
					</div>

					<ProfileCreationForm />
				</div>
			</div>
		</div>
	)
}
