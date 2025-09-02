'use client'

import {
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getFilteredRowModel,
	getSortedRowModel,
} from '@tanstack/react-table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useState } from 'react'

import { Button } from '../button'
import { Input } from '../input'
import { DataTablePagination } from './data-table-pagination'
import { Settings2 } from 'lucide-react'
import Link from 'next/link'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	schema: string
	label?: string
	createLink?: string
}

export function DataTable<TData, TValue>({
	columns,
	data,
	createLink,
	schema,
	label,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const createButtonHref = createLink
		? createLink
		: schema
			? `/admin/${schema}/new`
			: undefined

	const filterPlaceholder = `Filter ${label ?? schema}...`

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		globalFilterFn: 'includesString',
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder={filterPlaceholder}
					onChange={(e) => table.setGlobalFilter(String(e.target.value))}
					className="max-w-xs"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto" size="sm">
							<Settings2 />
							View
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button size="sm" className="ml-2" asChild>
					{createButtonHref && (
						<Link href={createButtonHref}>Add {label ?? schema}</Link>
					)}
				</Button>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="py-4">
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
