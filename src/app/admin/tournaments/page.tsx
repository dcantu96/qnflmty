import { DataTable } from '~/components/ui/data-table/data-table'
import { columns } from './columns'
import { getTournaments } from '~/server/admin/queries'

export default async function DashboardPage() {
	const { items } = await getTournaments()

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={items} />
		</div>
	)
}
