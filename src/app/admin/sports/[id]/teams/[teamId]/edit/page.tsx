import { getTeamById, getSports } from '~/server/admin/queries'
import Form from './form'
import { notFound } from 'next/navigation'

interface Props {
	params: Promise<{ id: string; teamId: string }>
}

export default async function Page({ params }: Props) {
	const { teamId } = await params
	const team = await getTeamById(Number(teamId))
	if (!team) notFound()

	const { items } = await getSports()

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Edit Team</h1>

			<Form team={team} sports={items} />
		</div>
	)
}
