'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { fetchTrendingMovies } from '@/utils/tmdbApi';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  // Add other properties as needed
}

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const trendingMovies = await fetchTrendingMovies(1);
      setMovies(trendingMovies);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}