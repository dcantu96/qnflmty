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
		orientation: 'portrait-primary',
		scope: '/',
		icons: [
			// Favicon for browsers
			{
				src: '/favicon.ico',
				sizes: '32x32',
				type: 'image/x-icon',
			},
			// Apple touch icon for iOS (must be first PNG for iOS compatibility)
			{
				src: '/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
			// Standard PNG icons (ordered by size for better fallback)
			{
				src: '/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			// Maskable icons for Android adaptive icons
			{
				src: '/icon-192-maskable.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon-512-maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
			// SVG as fallback for any size (last for compatibility)
			{
				src: '/logo.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any',
			},
		],
	}
}
