import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import { SongCard } from '../components/SongCard';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setLoading(true);
        axios.get(`/api/songs/search?q=${query}`)
          .then(res => setResults(res.data))
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div>
      <div className="relative mb-12">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xl bg-zinc-900 border-none rounded-full py-3 pl-12 pr-6 text-white focus:ring-2 focus:ring-white outline-none"
        />
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">{query ? `Results for "${query}"` : 'Browse all'}</h2>
        
        {loading ? (
          <div className="text-zinc-500">Searching...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((song: any) => (
              <SongCard key={song._id} song={song} />
            ))}
            {query && results.length === 0 && (
              <div className="col-span-full py-20 text-center text-zinc-500">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
