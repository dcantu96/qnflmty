import { getGroupById } from '~/server/admin/queries'
import { notFound } from 'next/navigation'
import Form from './form'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const group = await getGroupById(Number(id))

	if (!group) {
		notFound()
	}

	return (
		<div className="container mx-auto">
			<h1 className="mb-4 font-bold text-2xl text-primary">Edit Group</h1>

			<Form group={group} />
		</div>
	)
}
