'use client';

import { useState } from 'react';
import { useWatchedMovies } from '@/contexts/WatchedMoviesContext';
import MovieCard from '@/components/MovieCard';
import { searchMovies } from '@/utils/tmdbApi';
import Image from 'next/image';
import { FaShare } from 'react-icons/fa';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Watched() {
  const { watchedMovies, addToWatched } = useWatchedMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      const results = await searchMovies(value);
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    addToWatched(movie);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const generateShareableLink = async () => {
    try {
      const response = await fetch('/api/generateShareableLink', {
        method: 'POST',
      });
      const data = await response.json();
      setShareableLink(`${window.location.origin}/shared/${data.shareableId}`);
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Watched Movies</h1>
        <button
          onClick={generateShareableLink}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors duration-300"
        >
          <FaShare className="mr-2" />
          Share List
        </button>
      </div>
      {shareableLink && (
        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-white mb-2">Your shareable link:</p>
          <div className="flex items-center">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="flex-grow bg-gray-600 text-white p-2 rounded-l"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareableLink);
                alert('Link copied to clipboard!');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition-colors duration-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div className="mb-8 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for movies to add..."
          className="w-full p-2 border rounded bg-gray-700 text-white"
        />
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg max-h-96 overflow-y-auto">
            {searchResults.map(movie => (
              <div
                key={movie.id}
                className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                onClick={() => handleSelectMovie(movie)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  width={46}
                  height={69}
                  className="mr-2"
                />
                <span className="text-white">{movie.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4">Your Watched Movies:</h2>
      {watchedMovies.length === 0 ? (
        <p className="text-center text-gray-500">You haven't watched any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {watchedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} isWatchedPage={true} />
          ))}
        </div>
      )}
    </div>
  );
}