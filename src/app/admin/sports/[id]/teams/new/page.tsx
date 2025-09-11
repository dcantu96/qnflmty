import Form from './form'
import { getSportById } from '~/server/admin/queries'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const sport = await getSportById(Number(id))

	if (!sport) notFound()

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Create Team</h1>

			<Form sport={sport} />
		</div>
	)
}
