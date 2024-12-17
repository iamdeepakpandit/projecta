import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import GenreCard from '../components/GenreCard';
import SongCard from '../components/SongCard';
import { songs } from '../data/songs';
import { genres } from '../data/genres';
import type { Song } from '../types/music';

interface HomeProps {
  onPlaySong: (song: Song) => void;
}

const INITIAL_SONGS_TO_SHOW = 5;

export default function Home({ onPlaySong }: HomeProps) {
  const [showAllSongs, setShowAllSongs] = useState(false);
  const displayedSongs = showAllSongs ? songs : songs.slice(0, INITIAL_SONGS_TO_SHOW);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to Sanगीत </h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-6">Select the Genre</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map(genre => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Songs</h2>
          <button
            onClick={() => setShowAllSongs(!showAllSongs)}
            className="flex items-center gap-1 text-white-400 hover:text-purple-300 transition-colors duration-300"
          >
            <span>{showAllSongs ? 'Show Less' : 'See More'}</span>
            <ChevronRight className={`w-5 h-5 transform transition-transform duration-300 ${showAllSongs ? 'rotate-90' : ''}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedSongs.map(song => (
            <SongCard key={song.id} song={song} onPlay={onPlaySong} />
          ))}
        </div>
      </section>
    </div>
  );
}