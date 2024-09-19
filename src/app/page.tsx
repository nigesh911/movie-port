'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '@/components/MovieCard';
import { fetchMovies } from '@/utils/tmdbApi';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  // Add other properties as needed
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const newMovies = await fetchMovies(page);
      setMovies(prevMovies => [...prevMovies, ...newMovies]);
      setLoading(false);
    };

    loadMovies();
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Popular Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {movies.map((movie, index) => (
          <div key={movie.id} ref={index === movies.length - 1 ? lastMovieElementRef : null}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading more movies...</p>}
    </div>
  );
}
