import {
	DataTable,
	DataTableHeader,
	DataTableContent,
	DataTablePagination,
} from '~/components/ui/data-table'
import { columns } from './columns'
import {
	getTournamentById,
	getWeeksByTournamentId,
} from '~/server/admin/queries'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const tournament = await getTournamentById(Number(id))

	if (!tournament) {
		notFound()
	}

	const { items } = await getWeeksByTournamentId({ tournamentId: Number(id) })

	return (
		<div className="container mx-auto">
			<div className="md: mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="rounded-md py-4 shadow-none">
					<CardHeader className="px-4">
						<CardTitle>Tournament</CardTitle>
						<CardDescription>{tournament.name}</CardDescription>
					</CardHeader>
				</Card>
				<Card className="rounded-md py-4 shadow-none">
					<CardHeader className="px-4">
						<CardTitle>Year</CardTitle>
						<CardDescription>{tournament.year}</CardDescription>
					</CardHeader>
				</Card>
				<Card className="rounded-md py-4 shadow-none">
					<CardHeader className="px-4">
						<CardTitle>Sport</CardTitle>
						<CardDescription>{tournament.sport.name}</CardDescription>
					</CardHeader>
				</Card>
			</div>
			<DataTable columns={columns} data={items} schema="weeks" label="Weeks">
				<DataTableHeader />
				<DataTableContent />
				<DataTablePagination />
			</DataTable>
		</div>
	)
}
