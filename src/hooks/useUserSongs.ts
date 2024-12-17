import { useState, useEffect } from 'react';
import type { Song } from '../types/music';
import { getAllSongs, insertSong, deleteSong } from '../db';

export function useUserSongs() {
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const songs = await getAllSongs();
        setUserSongs(songs);
      } catch (error) {
        console.error('Failed to load songs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSongs();
  }, []);

  const addSong = async (songData: Omit<Song, 'id'>) => {
    try {
      const newSong = await insertSong(songData);
      setUserSongs(prev => [newSong, ...prev]);
      return newSong;
    } catch (error) {
      console.error('Failed to add song:', error);
      throw error;
    }
  };

  const removeSong = async (songId: string) => {
    try {
      await deleteSong(songId);
      setUserSongs(prev => prev.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Failed to remove song:', error);
      throw error;
    }
  };

  return {
    userSongs,
    isLoading,
    addSong,
    removeSong
  };
}