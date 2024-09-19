'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import CreatePost from '@/components/CreatePost';
import PostList from '@/components/PostList';

interface Post {
  _id: string;
  user: string;
  content: string;
  timestamp: string;
}

export default function MovieTalks() {
  const { user, isLoading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!isLoading) {
      fetchPosts();
    }
  }, [isLoading]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      // Sort posts by timestamp in descending order (latest first)
      const sortedPosts = data.sort((a: Post, b: Post) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleNewPost = async (newPost: Omit<Post, '_id'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      const createdPost = await response.json();
      // Add the new post to the beginning of the posts array
      setPosts(prevPosts => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-accent">Movie Talks</h1>
      {user ? (
        <CreatePost onNewPost={handleNewPost} />
      ) : (
        <p className="text-center mb-8">Please sign in to join the conversation.</p>
      )}
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-center">No posts yet. Be the first to start a conversation!</p>
      )}
    </div>
  );
}