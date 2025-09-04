import {
	DataTable,
	DataTableHeader,
	DataTableContent,
	DataTablePagination,
} from '~/components/ui/data-table'
import { columns } from './columns'
import { getTeamsBySportId } from '~/server/admin/queries'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const { items } = await getTeamsBySportId({ sportId: Number(id) })

	return (
		<div className="container mx-auto">
			<DataTable
				columns={columns}
				data={items}
				schema="teams"
				label="Teams"
				createLink={`/admin/sports/${id}/teams/new`}
			>
				<DataTableHeader />
				<DataTableContent />
				<DataTablePagination />
			</DataTable>
		</div>
	)
}
