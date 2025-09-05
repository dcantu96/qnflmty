import { getUserById } from '~/server/admin/queries'
import Form from './form'

interface Props {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
	const { id } = await params
	const user = await getUserById(Number(id))

	if (!user) {
		return <div>User not found</div>
	}

	return (
		<div className="container mx-auto">
			<h1 className="font-bold text-2xl text-primary">Edit User</h1>

			<Form user={user} />
		</div>
	)
}
