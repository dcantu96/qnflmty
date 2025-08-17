interface FullPageLayoutProps {
	children: React.ReactNode
	className?: string
}

export function FullPageLayout({
	children,
	className = '',
}: FullPageLayoutProps) {
	return <div className={`min-h-screen w-full ${className}`}>{children}</div>
}
