import '~/styles/globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from './providers'

export const metadata: Metadata = {
	title: 'QNFLMTY',
	description: 'Your Premium NFL Experience',
	icons: [
		{ rel: 'icon', url: '/logo.svg', type: 'image/svg+xml' },
		{ rel: 'icon', url: '/favicon.ico', sizes: '32x32' },
		{ rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
	],
}

const geist = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
})

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
				<meta name="mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
