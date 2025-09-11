// import Form from './form'
import { getSports, getTournamentById } from '~/server/admin/queries'
import Form from './form'
import { notFound } from 'next/navigation'

interface Props {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
	const { id } = await params
	const tournament = await getTournamentById(Number(id))

	if (!tournament) {
		notFound()
	}

	const { items } = await getSports()
	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Edit Tournament</h1>

			<Form tournament={tournament} sports={items} />
		</div>
	)
}
