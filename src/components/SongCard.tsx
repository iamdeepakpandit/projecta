import React from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';
import type { Song } from '../types/music';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  isPlaying?: boolean;
  onDelete?: (song: Song) => void;
  showDelete?: boolean;
}

export default function SongCard({ 
  song, 
  onPlay, 
  isPlaying = false, 
  onDelete,
  showDelete = false 
}: SongCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(song);
    }
  };

  return (
    <div className="group relative bg-gray-900/30 p-4 rounded-lg hover:bg-gray-900/60 transition-all duration-300">
      <div className="aspect-square overflow-hidden rounded-md mb-4">
        <img 
          src={song.coverUrl} 
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={() => onPlay(song)}
          className="absolute right-6 bottom-20 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 transform shadow-lg hover:bg-purple-600"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>
        {showDelete && onDelete && (
          <button
            onClick={handleDelete}
            className="absolute left-6 bottom-20 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 transform shadow-lg hover:bg-red-600"
          >
            <Trash2 className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
      <div>
        <h3 className="font-medium text-white truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate mt-1">{song.artist}</p>
      </div>
    </div>
  );
}