'use client';
import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
}

const searchUsers = async (name: string): Promise<User[] | null> => {
  const token = localStorage.getItem('token');
  console.log(name);
  if (!token) {
    alert('You must be logged in to search for users.');
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?name=${name}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to search users:', error);
    alert('Error searching users. Please try again.');
    return null;
  }
};

const followUser = async (userId: string) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to follow users.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5073/follow', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userId)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert(`Successfully followed user with ID: ${userId}`);
  } catch (error) {
    console.error('Failed to follow user:', error);
    alert('Error following user. Please try again.');
  }
};

const SearchPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (name: string) => {
    if (!name) {
      return;
    }
    setLoading(true);
    const result = await searchUsers(name);
    if (result) {
      setUsers(result);
    }
    setLoading(false);
  };

  const handleFollow = async (userId: string) => {
    await followUser(userId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Users</h1>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Enter name to search"
          className="py-2 px-4 border rounded-md w-full"
        />
      </div>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Follow
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  );
};

export default SearchPage;
