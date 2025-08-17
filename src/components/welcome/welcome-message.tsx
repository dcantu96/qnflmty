interface WelcomeMessageProps {
	userName?: string
}

export function WelcomeMessage({ userName }: WelcomeMessageProps) {
	return (
		<div className="space-y-4 text-center">
			<h1 className="font-bold text-4xl text-gray-900 dark:text-white">
				Welcome to Qnflmty{userName ? `, ${userName}` : ''}!
			</h1>
			<p className="mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300">
				Get ready to test your NFL knowledge and compete with friends in our
				weekly prediction game. Make your picks, track your progress, and climb
				the leaderboard!
			</p>
		</div>
	)
}
