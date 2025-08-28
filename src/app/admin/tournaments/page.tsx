import { DataTable } from '~/components/ui/data-table'
import { columns } from './columns'
import { getTournaments } from '~/server/admin/queries'

async function getTournamentsMapped() {
	const data = await getTournaments()

	return data.items.map((tournament) => ({
		id: tournament.id,
		name: tournament.name,
		sport: tournament.sportId.toString(),
		year: tournament.year,
	}))
}

export default async function DashboardPage() {
	const data = await getTournamentsMapped()

	return (
		<>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div>
			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={data} />
			</div>
		</>
	)
}
