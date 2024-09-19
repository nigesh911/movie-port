'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsername = useCallback(async () => {
    try {
      const response = await axios.get('/api/username');
      setUsername(response.data.username || user?.nickname || '');
    } catch (error) {
      console.error('Failed to fetch username:', error);
    }
  }, [user?.nickname]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } else if (user) {
      fetchUsername();
    }
  }, [user, isLoading, router, fetchUsername]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/username', { username });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update username:', error);
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          {user.picture && (
            <Image
              src={user.picture}
              alt={user.name || 'Profile picture'}
              width={120}
              height={120}
              className="rounded-full border-4 border-blue-500"
            />
          )}
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-6">{user.name}</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">Email</h2>
          <p className="text-gray-300">{user.email}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">Username</h2>
          {isEditing ? (
            <form onSubmit={handleUsernameSubmit} className="flex items-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                placeholder="Enter new username"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors">
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-300">{username || user.nickname || 'Not set'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/api/auth/logout"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors inline-block"
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
}