import { DataTable } from '~/components/ui/data-table/data-table'
import { columns } from './columns'
import { getTournaments } from '~/server/admin/queries'

async function getTournamentsMapped() {
	const data = await getTournaments()

	return data.items.map((tournament) => ({
		id: tournament.id,
		name: tournament.name,
		sport: tournament.sport.name,
		year: tournament.year,
	}))
}

export default async function DashboardPage() {
	const data = await getTournamentsMapped()

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
