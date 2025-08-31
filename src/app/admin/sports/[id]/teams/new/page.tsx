import Form from './form'
import { getSportById } from '~/server/admin/queries'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const sport = await getSportById(Number(id))

	if (!sport) return <div>Sport not found</div>

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Create Team</h1>

			<Form sport={sport} />
		</div>
	)
}
