"use client";
import React, { useEffect, useState } from "react";
import CreatePostModal from "../components/CreatePostModal";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const createPost = async (title: string, content: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to create a post.");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to create post:", error);
    alert("Error creating post. Please try again.");
  }
};

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (title: string, content: string) => {
    const success = await createPost(title, content);
    if (success) {
      fetchPosts();
    }
  };

  return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Your posts</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Post
          </button>
        </div>
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
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      </div>
  );
};

export default PostsPage;
