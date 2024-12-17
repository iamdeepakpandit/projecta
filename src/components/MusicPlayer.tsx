import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';
import type { Song } from '../types/music';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  shuffle?: boolean;
  repeat?: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function MusicPlayer({
  currentSong,
  isPlaying,
  progress,
  volume,
  shuffle = false,
  repeat = false,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onNext,
  onPrevious
}: MusicPlayerProps) {
  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentTime = (currentSong.duration * progress) / 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-gray-900 text-white p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div>
            <h4 className="font-medium">{currentSong.title}</h4>
            <p className="text-sm text-gray-400">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl px-4">
          <div className="flex items-center gap-6">
            <button 
              className={`hover:text-purple-400 transition ${shuffle ? 'text-purple-500' : ''}`}
              onClick={onToggleShuffle}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              className="hover:text-purple-400 transition"
              onClick={onPrevious}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              className="hover:text-purple-400 transition"
              onClick={onNext}
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button 
              className={`hover:text-purple-400 transition ${repeat ? 'text-purple-500' : ''}`}
              onClick={onToggleRepeat}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10">
              {formatTime(currentTime)}
            </span>
            <div 
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = (x / rect.width) * 100;
                onSeek(percent);
              }}
            >
              <div 
                className="h-full bg-purple-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 hover:opacity-100 transition"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}