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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center p-16">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded absolute right-12"
      >
        Add Post
      </button>
      <div>
        <div className="">
          <h1 className="text-4xl font-bold mb-16">Your posts</h1>
        </div>
        <section className="flex flex-col gap-4 justify-start">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
            </article>
          ))}
        </section>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default PostsPage;
