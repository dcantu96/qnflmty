import { DataTable } from '~/components/ui/data-table/data-table'
import { columns } from './columns'
import { getUsers } from '~/server/admin/queries'

export default async function Page() {
	const { items } = await getUsers()

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={items} schema="users" label="Users" />
		</div>
	)
}
