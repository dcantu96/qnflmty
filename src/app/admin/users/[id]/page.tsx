import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Mail, Phone, CreditCard, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'
import { getUserDetailsById } from '~/server/admin/queries'
import { SettingsDropdown } from './settings-dropdown'

export interface TimelineEvent {
	type: 'payment' | 'suspension'
	date: string
	title: string
	description: string
	status: 'pending' | 'completed' | 'failed' | 'resolved'
	icon: 'payment' | 'alert'
}

type User = NonNullable<Awaited<ReturnType<typeof getUserDetailsById>>>

export default async function UserPage({ params }: { params: { id: string } }) {
	const user = await getUserDetailsById(Number(params.id))

	if (!user) return <div>User not found</div>

	return (
		<Tabs defaultValue="overview" className="space-y-2">
			<div className="flex items-center justify-between">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="projects">Accounts</TabsTrigger>
					<TabsTrigger value="activities">Memberships</TabsTrigger>
				</TabsList>
				<SettingsDropdown
					id={user.id}
					suspended={user.suspended}
					admin={user.admin}
				/>
			</div>

			<TabOverview user={user} />
		</Tabs>
	)
}

const TabOverview = ({ user }: { user: User }) => {
	const hasPendingPayments = false
	const notes = undefined
	const referrals: User[] = []
	const timelineEvents: TimelineEvent[] = [
		{
			type: 'payment',
			date: '2025-09-01',
			title: 'Payment Registered',
			description: 'Cash Payment - $110.00 received @ CEM Legal',
			status: 'completed',
			icon: 'payment',
		},
		{
			type: 'suspension',
			date: '2024-09-20',
			title: 'Suspicious Activity',
			description:
				'Account suspended for 3 days. Issue has been resolved and user can continue normal activities.',
			status: 'resolved',
			icon: 'alert',
		},
		{
			type: 'payment',
			date: '2024-09-01',
			title: 'Payment Registered',
			description: 'Cash Payment - $110.00 received @ Home',
			status: 'completed',
			icon: 'payment',
		},
	]
	return (
		<TabsContent value="overview">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{/* Left Sidebar - User Info */}
				<div className="flex flex-col gap-4 md:col-span-1">
					<div className="relative rounded-lg border bg-card p-4 text-card-foreground">
						{/* Status Badges - positioned like "Pro" badge */}
						<div className="absolute top-4 left-4 flex gap-1">
							{user.suspended && (
								<Badge variant="destructive" className="text-xs">
									Suspended
								</Badge>
							)}
							{hasPendingPayments && (
								<Badge
									variant="secondary"
									className="bg-yellow-500 text-white text-xs"
								>
									Pending
								</Badge>
							)}
							{user.admin && (
								<Badge className="bg-black text-white text-xs">Admin</Badge>
							)}
						</div>

						<div className="mt-8 flex flex-col items-center space-y-4">
							{/* Avatar and Basic Info */}
							<div className="relative">
								<Avatar className="h-12 w-12">
									<AvatarFallback className="font-semibold text-xl">
										{user.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
							</div>

							<div className="text-center">
								<h2 className="font-semibold text-xl">{user.name}</h2>
								<p className="text-muted-foreground text-sm">
									joined {new Date(user.createdAt).toLocaleDateString('en-GB')}
								</p>
							</div>

							{/* Stats Grid */}
							<div className="grid w-full grid-cols-2 gap-4 text-center">
								<div>
									<div className="font-bold text-xl">
										{user.userAccounts.length}
									</div>
									<div className="text-muted-foreground text-xs">Accounts</div>
								</div>
								<div>
									<div className="font-bold text-xl">-</div>
									<div className="text-muted-foreground text-xs">
										Memberships
									</div>
								</div>
							</div>

							<Separator />

							{/* Contact Info */}
							<div className="w-full space-y-3">
								<div className="flex items-center space-x-3">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.email}</span>
								</div>
								<div className="flex items-center space-x-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.phone}</span>
								</div>
							</div>
						</div>
					</div>

					{/* User Notes Card */}
					<div className="rounded-lg border bg-card p-4 text-card-foreground">
						<h3 className="mb-4 font-medium text-sm">User Notes</h3>
						{notes ? (
							<p className="text-muted-foreground text-sm leading-relaxed">
								{notes}
							</p>
						) : (
							<p className="text-muted-foreground text-sm italic">
								No notes available for this user.
							</p>
						)}
					</div>

					<div className="rounded-lg border bg-card p-4 text-card-foreground">
						<h3 className="mb-4 font-semibold text-lg">Referrals</h3>
						<div className="space-y-4">
							{referrals.length === 0 && (
								<p className="text-muted-foreground text-sm italic">
									No referrals available for this user.
								</p>
							)}
							{referrals.map((referral) => (
								<div
									key={referral.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center space-x-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="text-xs">
												{referral.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div>
											<Link
												href={`/admin/users/${referral.id}`}
												className="font-medium text-sm"
											>
												{referral.name}
											</Link>
											<p className="text-muted-foreground text-xs">
												{referral.email}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="md:col-span-2">
					{/* Activity Timeline */}
					<div className="rounded-lg border bg-card p-4 text-card-foreground">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h3 className="font-semibold text-lg">Latest Activity</h3>
							</div>
							<Button variant="ghost" size="sm">
								View All
							</Button>
						</div>
						<div className="space-y-0">
							{/* Render timeline events */}
							{timelineEvents
								.sort(
									(a, b) =>
										new Date(b.date).getTime() - new Date(a.date).getTime(),
								)
								.slice(0, 6)
								.map((event, index) => (
									<div
										key={`${event.type}-${event.date}-${index}`}
										className="relative flex items-start space-x-4 pb-6"
									>
										<div className="relative flex flex-col items-center">
											<div className="flex h-6 w-6 items-center justify-center rounded-full border bg-muted">
												{event.icon === 'alert' ? (
													<AlertTriangle className="h-3 w-3" />
												) : (
													<CreditCard className="h-3 w-3" />
												)}
											</div>
											{index < timelineEvents.slice(0, 6).length - 1 && (
												<div className="absolute top-6 h-22 w-px bg-border" />
											)}
										</div>
										<div className="min-h-22 flex-1 space-y-1">
											<div className="flex items-center space-x-2">
												<h4 className="font-medium text-sm">{event.title}</h4>
												{event.type === 'suspension' && (
													<Badge variant="secondary" className="text-xs">
														Resolved
													</Badge>
												)}
												{event.type === 'payment' && (
													<Badge
														variant={
															event.status === 'completed'
																? 'default'
																: event.status === 'failed'
																	? 'destructive'
																	: 'secondary'
														}
														className="text-xs"
													>
														{event.status}
													</Badge>
												)}
											</div>
											<p className="flex items-center text-muted-foreground text-sm">
												<Clock className="mr-1 h-3 w-3" />
												{new Date(event.date).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: 'numeric',
													minute: 'numeric',
													second: 'numeric',
												})}
											</p>
											<p className="text-muted-foreground text-sm">
												{event.description}
											</p>
										</div>
									</div>
								))}

							{/* Show beginning message if fewer than 5 events */}
							{timelineEvents.length < 5 && (
								<div className="-mt-6 flex items-center justify-center py-6">
									<div className="space-y-4 text-center">
										<div className="flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-muted-foreground/30 border-dashed bg-muted/30">
												<Clock className="h-5 w-5 text-muted-foreground" />
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-muted-foreground text-sm italic">
												This is the beginning of user's activity regarding
												suspensions and payments
											</p>
											<Button variant="outline" size="sm" className="text-xs">
												<CreditCard className="mr-2 h-3 w-3" />
												Register Payment
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</TabsContent>
	)
}
