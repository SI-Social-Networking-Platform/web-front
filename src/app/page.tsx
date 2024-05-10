
const fetchPosts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/all`);
  return response.json();
}

async function HomePage() {
  const posts: Post[] = await fetchPosts();
  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <div>
      <h1 className="text-4xl font-bold mb-16">Welcome to the Social Platform</h1>
      <section className="flex flex-col gap-4 justify-start">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </article>
        ))}
      </section>
      </div>
    </main>
  );
}

export default HomePage;

// [{"id":8,"title":"Post1","content":"Post2","createdAt":"0001-01-01T00:00:00","userId":5},{"id":9,"title":"Post3","content":"Post4","createdAt":"0001-01-01T00:00:00","userId":5},{"id":10,"title":"firstPost","content":"xdddddd","createdAt":"0001-01-01T00:00:00","userId":9},{"id":11,"title":"firstPost","content":"xdddddd","createdAt":"0001-01-01T00:00:00","userId":9}]


interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userId: number;
}