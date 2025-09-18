import { handleRootRedirect } from '~/lib/auth-handlers'
import {
	Star,
	Calendar,
	MessageCircle,
	BarChart3,
	ArrowRight,
	Trophy,
	UserPlus,
	Users,
	TrendingUp,
	Shield,
	Zap,
	ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const steps = [
	{
		icon: UserPlus,
		title: 'Join the Group',
		description:
			'Request access to our exclusive NFL prediction community. Get approved by our moderators.',
		action: 'Request Access',
		href: '/login',
	},
	{
		icon: Calendar,
		title: 'Make Your Picks',
		description:
			'Submit your weekly predictions before kickoff. Every game counts toward your season score.',
		action: 'View Schedule',
		href: '/schedule',
	},
	{
		icon: Trophy,
		title: 'Climb the Leaderboard',
		description:
			'Track your performance, earn bragging rights, and compete for the top spot.',
		action: 'View Leaderboard',
		href: '/leaderboard',
	},
]

const features = [
	{
		icon: Star,
		title: 'Premium Picks',
		description:
			'High-stakes games later in the season are worth double points for bigger rewards.',
	},
	{
		icon: Calendar,
		title: 'Weekly Deadlines',
		description:
			'Submit predictions before each game starts. No late entries allowed.',
	},
	{
		icon: MessageCircle,
		title: 'Group Chat',
		description:
			'Private discussions, trash talk, and strategy sharing with fellow predictors.',
	},
	{
		icon: BarChart3,
		title: 'Advanced Stats',
		description:
			'Detailed analytics on your prediction accuracy and performance trends.',
	},
]

const stats = [
	{
		icon: Users,
		value: '50+',
		label: 'Active Members',
		description: 'Growing community of NFL fans',
	},
	{
		icon: TrendingUp,
		value: '85%',
		label: 'Avg. Accuracy',
		description: 'Community prediction success rate',
	},
	{
		icon: Shield,
		value: '100%',
		label: 'Private Group',
		description: 'Invite-only exclusive access',
	},
]

export default async function Page() {
	await handleRootRedirect()

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="relative overflow-hidden border-b">
				<div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
					<div className="space-y-8 text-center">
						<div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 font-medium text-sm">
							<Zap className="h-4 w-4" />
							NFL Prediction League
						</div>

						<h1 className="font-bold text-4xl tracking-tight sm:text-6xl">
							Welcome to <span className="text-primary">Qnflmty</span>
						</h1>

						<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
							Join our exclusive NFL prediction community where strategy meets
							competition. Test your football knowledge, make weekly picks, and
							climb the leaderboard in our premium prediction game.
						</p>

						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button size="lg" className="px-8 text-base" asChild>
								<Link href="/login">
									<UserPlus className="mr-2 h-5 w-5" />
									Get Started Now
								</Link>
							</Button>
							<Button variant="outline" size="lg" className="px-8 text-base">
								Learn More
								<ChevronRight className="ml-2 h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="border-b bg-muted/20 py-16">
				<div className="mx-auto max-w-4xl px-6">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
						{stats.map((stat) => {
							const Icon = stat.icon
							return (
								<div key={stat.label} className="text-center">
									<div className="mb-4 flex justify-center">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
											<Icon className="h-6 w-6" />
										</div>
									</div>
									<div className="font-bold text-2xl">{stat.value}</div>
									<div className="mt-1 font-medium text-sm">{stat.label}</div>
									<div className="mt-1 text-muted-foreground text-xs">
										{stat.description}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-4xl px-6 py-16">
				{/* Getting Started Section */}
				<div className="space-y-12">
					<div className="space-y-4 text-center">
						<h2 className="font-bold text-3xl">How It Works</h2>
						<p className="text-muted-foreground">
							Get started in three simple steps and join our competitive
							prediction community
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{steps.map((step, index) => {
							const Icon = step.icon
							return (
								<Card
									key={step.title}
									className="group hover:-translate-y-1 transition-all hover:shadow-md"
								>
									<CardHeader>
										<div className="mb-4 flex items-center justify-between">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
												<Icon className="h-5 w-5" />
											</div>
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
												{index + 1}
											</div>
										</div>
										<CardTitle className="text-xl">{step.title}</CardTitle>
										<CardDescription className="text-base">
											{step.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button variant="outline" className="w-full" asChild>
											<Link
												href={step.href}
												className="inline-flex items-center justify-center gap-2"
											>
												{step.action}
												<ArrowRight className="h-4 w-4" />
											</Link>
										</Button>
									</CardContent>
								</Card>
							)
						})}
					</div>
				</div>

				<Separator className="my-16" />

				{/* Features Section */}
				<div className="space-y-12">
					<div className="space-y-4 text-center">
						<h2 className="font-bold text-3xl">Premium Features</h2>
						<p className="text-muted-foreground">
							Experience the most comprehensive NFL prediction platform
						</p>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{features.map((feature) => {
							const Icon = feature.icon
							return (
								<Card key={feature.title} className="text-center">
									<CardHeader>
										<div className="mb-4 flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
												<Icon className="h-6 w-6" />
											</div>
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
										<CardDescription className="text-sm">
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							)
						})}
					</div>
				</div>

				{/* CTA Section */}
				<div className="mt-16">
					<Card className="bg-primary text-primary-foreground">
						<CardContent className="p-8 text-center">
							<div className="space-y-6">
								<div className="flex justify-center">
									<Trophy className="h-12 w-12 opacity-80" />
								</div>
								<h3 className="font-bold text-2xl">
									Ready to Prove Your NFL Knowledge?
								</h3>
								<p className="mx-auto max-w-2xl opacity-90">
									Join our exclusive prediction group and compete with the best
									NFL fans. Premium features, detailed stats, and friendly
									competition await!
								</p>
								<div className="flex flex-col justify-center gap-4 sm:flex-row">
									<Button
										size="lg"
										variant="secondary"
										className="px-8 text-base"
										asChild
									>
										<Link href="/login">
											<UserPlus className="mr-2 h-5 w-5" />
											Request Access
										</Link>
									</Button>
									<Button
										size="lg"
										variant="ghost"
										className="border border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary"
									>
										Learn More
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
