import type { ColumnDef } from '@tanstack/react-table'

export interface Tournament {
	id: number
	name: string
	year: number
	sport: string
}

export const columns: ColumnDef<Tournament>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'year',
		header: 'Year',
	},
	{
		accessorKey: 'sport',
		header: 'Sport',
	},
]
