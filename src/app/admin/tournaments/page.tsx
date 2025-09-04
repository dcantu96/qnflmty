import {
	DataTable,
	DataTableHeader,
	DataTableContent,
	DataTablePagination,
} from '~/components/ui/data-table'
import { columns } from './columns'
import { getTournaments } from '~/server/admin/queries'

export default async function DashboardPage() {
	const { items } = await getTournaments()

	return (
		<div className="container mx-auto">
			<DataTable
				columns={columns}
				data={items}
				schema="tournaments"
				label="Tournaments"
			>
				<DataTableHeader />
				<DataTableContent />
				<DataTablePagination />
			</DataTable>
		</div>
	)
}
