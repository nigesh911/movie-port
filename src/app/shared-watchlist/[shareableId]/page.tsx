'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import MovieCard from '@/components/MovieCard';

interface WatchedMovie {
  id: number;
  title: string;
  poster_path: string;
}

export default function SharedWatchlist() {
  const params = useParams();
  const shareableId = params?.shareableId as string;
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSharedWatchlist() {
      try {
        const response = await axios.get(`/api/sharedWatchedList/${shareableId}`);
        setWatchedMovies(response.data.watchedMovies);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching shared watchlist:', error);
        setError('Failed to fetch shared watchlist');
      } finally {
        setIsLoading(false);
      }
    }

    if (shareableId) {
      fetchSharedWatchlist();
    }
  }, [shareableId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shared Watchlist</h1>
      {error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : watchedMovies.length === 0 ? (
        <p className="text-center">This watchlist is empty or doesn&apos;t exist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {watchedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} isWatchedPage={false} />
          ))}
        </div>
      )}
    </div>
  );
}