import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Star, Calendar, MessageCircle, BarChart3 } from 'lucide-react'

export function GroupInfoSection() {
	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-semibold text-2xl text-gray-900 dark:text-white">
					About the NFL Prediction Group
				</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-300">
					Here's how our exclusive prediction game works
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
							<Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
						</div>
						<CardTitle className="text-lg">Premium Picks</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-gray-600 text-sm dark:text-gray-300">
							Later in the season, select premium matches are worth 2 points
							instead of 1 for higher stakes predictions.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<CardTitle className="text-lg">Weekly Picks</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-gray-600 text-sm dark:text-gray-300">
							Make your predictions for each NFL game before the weekly
							deadline.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
							<MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<CardTitle className="text-lg">Private Chat</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-gray-600 text-sm dark:text-gray-300">
							Connect with fellow members through our private group chat feature
							for discussions and friendly banter.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
							<BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<CardTitle className="text-lg">Stats View</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-gray-600 text-sm dark:text-gray-300">
							Compare your prediction effectiveness and performance stats
							alongside other group members.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
				<CardContent className="p-6 text-center">
					<h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">
						Ready to Get Started?
					</h3>
					<p className="text-gray-600 dark:text-gray-300">
						Join our exclusive prediction group with premium features, private
						chat, and detailed stats tracking!
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
