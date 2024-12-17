import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { songs } from '../data/songs';
import SongCard from '../components/SongCard';
import type { Song } from '../types/music';

interface SearchProps {
  onPlaySong: (song: Song) => void;
}

export default function Search({ onPlaySong }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);

  useEffect(() => {
    const searchSongs = () => {
      const searchQuery = query.toLowerCase().trim();
      if (!searchQuery) {
        setResults([]);
        return;
      }

      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(searchQuery) ||
        song.artist.toLowerCase().includes(searchQuery) ||
        song.genre.toLowerCase().includes(searchQuery)
      );
      setResults(filtered);
    };

    const debounce = setTimeout(searchSongs, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, or genres..."
            className="w-full pl-12 pr-4 py-4 bg-gray-900/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {query && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {results.length > 0 ? 'Search Results' : 'No results found'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map(song => (
              <SongCard key={song.id} song={song} onPlay={onPlaySong} />
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center text-gray-400 mt-12">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">Start typing to search for music</p>
        </div>
      )}
    </div>
  );
}