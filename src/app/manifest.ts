import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'QNFLMTY',
		short_name: 'QNFLMTY',
		description: 'Your Premium NFL Experience',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '32x32',
				type: 'image/x-icon',
			},
			{
				src: '/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
			{
				src: '/logo.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'maskable',
			},
		],
	}
}
