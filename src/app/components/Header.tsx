'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const { unique_name } = jwtDecode<any>(token);
      setUsername(unique_name);
    }
  }, []);

  return (
    <header className="flex justify-between p-5">
      <div className="flex gap-3 items-baseline">
        <Link href="/" className="text-lg font-bold mr-4">
          Social Platform
        </Link>
        <Link href="/search">Search</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/feed">Feed</Link>
      </div>
      <div className="flex gap-3">
        {username ? (
          <span className="font-semibold">{username}</span>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
