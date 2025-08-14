import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LoginForm } from '~/components/login-form'
import { authOptions } from '~/app/api/auth/[...nextauth]'

export default async function LoginPage() {
	const session = await getServerSession(authOptions)

	if (session) {
		redirect('/')
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					className="flex items-center gap-2 self-center font-medium"
					href="/"
				>
					<div className="flex size-6 items-center justify-center rounded-md">
						<img
							src="/logo.svg"
							alt="QNFLMTY Logo"
							className="inset-0 w-6 object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
					QNFLMTY
				</Link>
				<LoginForm />
			</div>
		</div>
	)
}
