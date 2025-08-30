import { DataTable } from '~/components/ui/data-table/data-table'
import { columns } from './columns'
import { getSports } from '~/server/admin/queries'

export default async function DashboardPage() {
	const { items } = await getSports()

	return (
		<div className="container mx-auto">
			<DataTable
				columns={columns}
				data={items}
				schema="sports"
				label="Sports"
			/>
		</div>
	)
}
