'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface CreatePostProps {
  onNewPost: (post: { user: string; content: string; timestamp: string }) => void;
}

export default function CreatePost({ onNewPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && user) {
      onNewPost({
        user: user.name || 'Anonymous',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      });
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts on movies..."
        className="w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      <button 
        type="submit" 
        className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Post
      </button>
    </form>
  );
}