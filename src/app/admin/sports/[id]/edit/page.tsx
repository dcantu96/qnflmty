import { getSportById } from '~/server/admin/queries'
import Form from './form'
import { notFound } from 'next/navigation'

interface Props {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
	const { id } = await params
	const sport = await getSportById(Number(id))

	if (!sport) {
		notFound()
	}

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Edit Sport</h1>

			<Form sport={sport} />
		</div>
	)
}
