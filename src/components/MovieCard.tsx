'use client';

import { useState } from 'react';
import { useWatchedMovies } from '@/contexts/WatchedMoviesContext';
import { FaEdit } from 'react-icons/fa';
import Image from 'next/image';

interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    review?: string;
  };
  isWatchedPage?: boolean;
}

export default function MovieCard({ movie, isWatchedPage = false }: MovieProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [review, setReview] = useState(movie.review || '');
  const { addToWatched, watchedMovies, updateReview } = useWatchedMovies();

  const isWatched = watchedMovies.some(m => m.id === movie.id);

  const handleAddToWatched = () => {
    addToWatched(movie);
  };

  const handleReviewSubmit = () => {
    updateReview(movie.id, review);
    setIsEditing(false);
  };

  return (
    <div className="movie-card relative w-full max-w-[200px] mx-auto rounded-lg overflow-hidden group">
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!isWatchedPage && !isWatched && (
            <button 
              onClick={handleAddToWatched}
              className="btn-primary px-4 py-2 rounded-lg text-sm"
            >
              Add to Watched
            </button>
          )}
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-semibold text-sm text-center truncate">{movie.title}</h3>
      </div>
      {isWatchedPage && (
        <div className="p-2">
          <p className="text-xs text-secondary line-clamp-2">{review || "No review yet."}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 text-accent hover:text-primary bg-card-bg rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaEdit />
          </button>
          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-md w-full">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-2 text-black dark:text-white bg-gray-100 dark:bg-gray-700 rounded border"
                  rows={3}
                  placeholder="Write your review..."
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReviewSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}