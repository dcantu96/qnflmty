import { RequestAccessForm } from '~/components/request-access/request-access-form'
import { auth } from '~/lib/auth'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { avatarIconsMap } from '~/lib/avatar-icons'
import { UserCheck, Mail, Clock, Users, ArrowLeft } from 'lucide-react'
import {
	getActiveWithTournament,
	getRequestsByUserAccountId,
} from '~/server/user/queries'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

export default async function RequestAccessPage({
	params,
}: {
	params: Promise<{ username: string }>
}) {
	const { session } = await auth()
	const { username } = await params

	const userAccount = await db.query.userAccounts.findFirst({
		where: (accounts, { eq, and }) =>
			and(
				eq(accounts.userId, session.user.id),
				eq(accounts.username, username),
			),
	})

	if (!userAccount) {
		redirect('/create-profile')
	}
	const avatar = avatarIconsMap[userAccount.avatar]

	const requests = await getRequestsByUserAccountId(userAccount.id)
	const hasPendingRequest = requests.length > 0
	const group = await getActiveWithTournament()

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					<div className="space-y-8">
						{/* Profile Display */}
						<Card className="border-2">
							<CardContent className="p-8">
								<div className="flex flex-col items-center space-y-4">
									<div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
										<avatar.icon className={`h-12 w-12 ${avatar.color}`} />
									</div>
									<div className="text-center">
										<h2 className="font-bold text-2xl text-gray-900 dark:text-white">
											{userAccount.username}
										</h2>
										<p className="mt-2 text-green-600 text-sm dark:text-green-400">
											Profile Created
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						{/* Request Access Card */}
						<Card>
							<CardHeader className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
									<UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle className="text-2xl">
									Request Access to Qnflmty
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="text-center">
									<p className="text-gray-600 dark:text-gray-300">
										Your profile is ready! Now request access to join our
										exclusive NFL prediction group.
									</p>
								</div>

								{/* Steps */}
								<div className="grid gap-4 md:grid-cols-3">
									<div className="text-center">
										<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
											<Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										</div>
										<h3 className="font-semibold text-gray-900 dark:text-white">
											Send Request
										</h3>
										<p className="text-gray-600 text-sm dark:text-gray-300">
											Submit your access request to join the group
										</p>
									</div>

									<div className="text-center">
										<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
											<Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
										</div>
										<h3 className="font-semibold text-gray-900 dark:text-white">
											Wait for Approval
										</h3>
										<p className="text-gray-600 text-sm dark:text-gray-300">
											Admin will review and approve your request
										</p>
									</div>

									<div className="text-center">
										<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
											<Users className="h-5 w-5 text-green-600 dark:text-green-400" />
										</div>
										<h3 className="font-semibold text-gray-900 dark:text-white">
											Start Playing
										</h3>
										<p className="text-gray-600 text-sm dark:text-gray-300">
											Begin making predictions and competing
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="space-y-4 text-center">
									{group ? (
										<RequestAccessForm
											userAccountId={userAccount.id}
											groupId={group.id}
											hasPendingRequest={hasPendingRequest}
										/>
									) : (
										<div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
											<p className="text-sm text-yellow-700">
												There are currently no active groups available for
												requests. Please check back later.
											</p>
										</div>
									)}
									<Button
										type="button"
										variant="outline"
										size="lg"
										className="w-full px-8 py-3"
										asChild
									>
										<Link href="/select-profile">
											<ArrowLeft className="mr-2 h-4 w-4" />
											Switch Profile
										</Link>
									</Button>
									<p className="mt-3 text-gray-500 text-sm">
										You'll be notified once your request is reviewed
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
