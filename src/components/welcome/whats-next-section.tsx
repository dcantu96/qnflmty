import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ArrowRight, UserPlus, Trophy, Calendar } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function WhatsNextSection() {
	const steps = [
		{
			icon: UserPlus,
			title: 'Create User Account',
			description:
				'Create your username and request access to join the prediction group.',
			action: 'Request Access',
			href: '/request-access',
		},
		{
			icon: Calendar,
			title: 'Make Predictions',
			description: 'Make your weekly NFL game predictions before the deadline.',
			action: 'View Schedule',
			href: '/schedule',
		},
		{
			icon: Trophy,
			title: 'Track Progress',
			description: 'Monitor your performance and climb the leaderboard.',
			action: 'View Leaderboard',
			href: '/leaderboard',
		},
	]

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-semibold text-2xl text-gray-900 dark:text-white">
					What's Next?
				</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-300">
					Get started with these simple steps
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{steps.map((step, index) => {
					const Icon = step.icon
					return (
						<Card key={step.title} className="relative">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Icon className="h-5 w-5 text-primary" />
									</div>
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
										{index + 1}
									</div>
								</div>
								<CardTitle className="text-lg">{step.title}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-gray-600 text-sm dark:text-gray-300">
									{step.description}
								</p>
								<Button variant="outline" className="w-full" asChild>
									<a
										href={step.href}
										className="inline-flex items-center gap-2"
									>
										{step.action}
										<ArrowRight className="h-4 w-4" />
									</a>
								</Button>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
