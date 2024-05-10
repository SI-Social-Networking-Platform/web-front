"use client";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
}

const fetchFeedPosts = async (): Promise<Post[] | null> => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to access the feed.");
    return null;
  }

  try {
    const response = await fetch("http://localhost:5073/feed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    alert("Error fetching the feed. Please try again.");
    return null;
  }
};

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFeed = async () => {
      setLoading(true);
      const data = await fetchFeedPosts();
      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    getFeed();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      <section className="flex flex-col gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-2 border p-4 rounded-md shadow-sm"
            >
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
            </article>
          ))
        ) : (
          <p>No posts available in your feed.</p>
        )}
      </section>
    </div>
  );
};

export default FeedPage;
