'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  review?: string;
}

interface WatchedMoviesContextType {
  watchedMovies: Movie[];
  addToWatched: (movie: Movie) => void;
  removeFromWatched: (movieId: number) => void;
  updateReview: (movieId: number, review: string) => void;
}

const WatchedMoviesContext = createContext<WatchedMoviesContextType | undefined>(undefined);

export function WatchedMoviesProvider({ children }: { children: ReactNode }) {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchWatchedMovies();
  }, []);

  const fetchWatchedMovies = async () => {
    try {
      const response = await axios.get('/api/watchedMovies');
      setWatchedMovies(response.data);
    } catch (error) {
      console.error('Error fetching watched movies:', error);
    }
  };

  const saveWatchedMovies = async (movies: Movie[]) => {
    try {
      await axios.post('/api/watchedMovies', { movies });
    } catch (error) {
      console.error('Error saving watched movies:', error);
    }
  };

  const addToWatched = (movie: Movie) => {
    setWatchedMovies(prevMovies => {
      if (!prevMovies.some(m => m.id === movie.id)) {
        const newMovies = [...prevMovies, { ...movie, review: '' }];
        saveWatchedMovies(newMovies);
        return newMovies;
      }
      return prevMovies;
    });
  };

  const removeFromWatched = (movieId: number) => {
    setWatchedMovies(prevMovies => {
      const newMovies = prevMovies.filter(m => m.id !== movieId);
      saveWatchedMovies(newMovies);
      return newMovies;
    });
  };

  const updateReview = (movieId: number, review: string) => {
    setWatchedMovies(prevMovies => {
      const newMovies = prevMovies.map(movie =>
        movie.id === movieId ? { ...movie, review } : movie
      );
      saveWatchedMovies(newMovies);
      return newMovies;
    });
  };

  return (
    <WatchedMoviesContext.Provider value={{ watchedMovies, addToWatched, removeFromWatched, updateReview }}>
      {children}
    </WatchedMoviesContext.Provider>
  );
}

export function useWatchedMovies() {
  const context = useContext(WatchedMoviesContext);
  if (context === undefined) {
    throw new Error('useWatchedMovies must be used within a WatchedMoviesProvider');
  }
  return context;
}