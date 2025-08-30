import Form from './form'
import { getSports } from '~/server/admin/queries'

export default async function Page() {
	const { items } = await getSports()
	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Create Tournament</h1>

			<Form sports={items} />
		</div>
	)
}
