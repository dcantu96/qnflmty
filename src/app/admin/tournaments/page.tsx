import { DataTable } from '~/components/ui/data-table'
import { columns, type Tournament } from './columns'
import { trpcClient } from '~/lib/trpcClient'

async function getTournaments() {
	const list = await trpcClient.admin.list.query()
	return list.items.map(
		(item): Tournament => ({
			id: item.id,
			name: item.name,
			year: item.year,
			sport: item.sportId.toString(),
		}),
	)
}

export default async function DashboardPage() {
	const data = await getTournaments()
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
