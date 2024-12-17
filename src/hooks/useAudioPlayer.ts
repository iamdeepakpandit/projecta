import { useState, useRef, useEffect } from 'react';
import type { Song } from '../types/music';

export function useAudioPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, repeat]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.audioUrl;
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setQueue(prevQueue => [...prevQueue, song]);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number) => {
    if (!audioRef.current) return;
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const adjustVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let nextIndex = currentIndex + 1;
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0;
    }
    
    const nextSong = queue[nextIndex];
    if (nextSong) {
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    
    const prevSong = queue[prevIndex];
    if (prevSong) {
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  return {
    currentSong,
    isPlaying,
    progress,
    volume,
    shuffle,
    repeat,
    playSong,
    togglePlay,
    seek,
    adjustVolume,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious
  };
}