import Form from './form'
import { getTournaments } from '~/server/admin/queries'

export default async function Page() {
	const { items } = await getTournaments()
	return (
		<div className="container mx-auto">
			<h1 className="mb-4 font-bold text-2xl text-primary">Create Group</h1>

			<Form tournaments={items} />
		</div>
	)
}
