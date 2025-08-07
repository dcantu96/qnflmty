import { db } from '~/server/db'

export default async function HomePage() {
	const posts = await db.query.posts.findMany()

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			Hello, QNFLMTY in progress
			{posts.map((post) => (
				<div key={post.id} className="m-2 rounded bg-gray-800 p-4">
					<h2 className="font-bold text-xl">{post.name}</h2>
					<p className="text-gray-400 text-sm">
						Created at: {new Date(post.createdAt).toLocaleString()}
					</p>
				</div>
			))}
		</main>
	)
}
