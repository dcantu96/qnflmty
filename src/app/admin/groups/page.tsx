import { columns } from './columns'
import { getGroups } from '~/server/admin/queries'
import {
	DataTable,
	DataTableHeader,
	DataTableContent,
	DataTablePagination,
} from '~/components/ui/data-table'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import Link from 'next/link'

type SearchParams = {
	/**
	 * if no kind is specified, only active groups will be returned
	 */
	kind?: 'all' | 'finished'
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<SearchParams>
}) {
	const filters = await searchParams
	const { items } = await getGroups({
		limit: 1000,
		page: 1,
		kind: filters.kind,
	})

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
					value="finished"
					variant="outline"
					asChild
				>
					<Link href="?kind=finished">Finished</Link>
				</ToggleGroupItem>
			</ToggleGroup>
			<DataTable columns={columns} data={items} schema="groups" label="Groups">
				<DataTableHeader className="mt-4" />
				<DataTableContent />
				<DataTablePagination />
			</DataTable>
		</div>
	)
}
