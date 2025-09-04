import { columns } from './columns'
import { getUsers } from '~/server/admin/queries'
import {
	DataTable,
	DataTableHeader,
	DataTableContent,
	DataTablePagination,
} from '~/components/ui/data-table'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import Link from 'next/link'
import { BulkSuspend } from './bulk-suspend'
import { BulkActivate } from './bulk-activate'

type UserSearchParams = {
	/**
	 * if no kind is specified, only active users will be returned
	 */
	kind?: 'all' | 'suspended'
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<UserSearchParams>
}) {
	const filters = await searchParams
	const { items } = await getUsers({ limit: 1000, page: 1, kind: filters.kind })

	return (
		<div className="container mx-auto">
			<ToggleGroup type="single" size="sm" value={filters.kind ?? 'none'}>
				<ToggleGroupItem className="w-24" value="all" variant="outline" asChild>
					<Link href="?kind=all">All</Link>
				</ToggleGroupItem>
				<ToggleGroupItem
					className="w-24"
					value="none"
					variant="outline"
					asChild
				>
					<Link href="?">Active</Link>
				</ToggleGroupItem>
				<ToggleGroupItem
					className="w-24"
					value="suspended"
					variant="outline"
					asChild
				>
					<Link href="?kind=suspended">Suspended</Link>
				</ToggleGroupItem>
			</ToggleGroup>
			<DataTable columns={columns} data={items} schema="users" label="Users">
				<DataTableHeader>
					{filters.kind === 'suspended' ? <BulkActivate /> : <BulkSuspend />}
				</DataTableHeader>
				<DataTableContent />
				<DataTablePagination />
			</DataTable>
		</div>
	)
}
