import { DataTable } from '~/components/ui/data-table/data-table'
import { columns } from './columns'
import { getWeeksByTournamentId } from '~/server/admin/queries'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const { items } = await getWeeksByTournamentId({ tournamentId: Number(id) })

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={items} schema="weeks" label="Weeks" />
		</div>
	)
}
