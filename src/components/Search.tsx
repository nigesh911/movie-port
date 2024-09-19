import { useState } from 'react';
import { searchMovies } from '@/utils/tmdbApi';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface SearchProps {
  onAddMovie: (movie: Movie) => void;
}

export default function Search({ onAddMovie }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async () => {
    const searchResults = await searchMovies(query);
    setResults(searchResults);
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie"
        className="p-2 border rounded-l-lg"
      />
      <button 
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-r-lg"
      >
        Search
      </button>
      <div className="mt-4">
        {results.map((movie) => (
          <div key={movie.id} className="flex items-center justify-between mb-2">
            <span>{movie.title}</span>
            <button 
              onClick={() => onAddMovie(movie)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}