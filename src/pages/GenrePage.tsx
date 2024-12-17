import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music } from 'lucide-react';
import { songs } from '../data/songs';
import { genres } from '../data/genres';
import { getSongsByGenre } from '../db';
import SongCard from '../components/SongCard';
import type { Song } from '../types/music';

interface GenrePageProps {
  onPlaySong: (song: Song) => void;
}

export default function GenrePage({ onPlaySong }: GenrePageProps) {
  const { id } = useParams<{ id: string }>();
  const genre = genres.find(g => g.id === id);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserSongs = async () => {
      if (genre) {
        try {
          const songs = await getSongsByGenre(genre.name);
          setUserSongs(songs);
        } catch (error) {
          console.error('Failed to load user songs:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadUserSongs();
  }, [genre]);

  // Filter built-in songs by genre
  const defaultSongs = songs.filter(song => 
    song.genre.toLowerCase() === genre?.name.toLowerCase()
  );

  // Combine built-in and user-uploaded songs
  const allSongs = [...defaultSongs, ...userSongs];

  if (!genre) {
    return (
      <div className="text-center text-gray-400 mt-12">
        <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-xl">Genre not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 mt-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Loading songs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 mb-8">
        <img
          src={genre.coverUrl}
          alt={genre.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent rounded-lg">
          <div className="absolute bottom-6 left-6">
            <h1 className="text-5xl font-bold mb-2">{genre.name}</h1>
            <p className="text-gray-300">{allSongs.length} songs</p>
          </div>
        </div>
      </div>

      {allSongs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allSongs.map(song => (
            <SongCard key={song.id} song={song} onPlay={onPlaySong} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No songs found in this genre</p>
        </div>
      )}
    </div>
  );
}