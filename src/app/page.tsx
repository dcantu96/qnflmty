import { db } from "~/server/db";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      Hello, QNFLMTY in progress
      {posts.map((post) => (
        <div key={post.id} className="p-4 m-2 bg-gray-800 rounded">
          <h2 className="text-xl font-bold">{post.name}</h2>
          <p className="text-sm text-gray-400">
            Created at: {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}
