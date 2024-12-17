import { useState, useEffect } from 'react';
import type { Playlist, Song } from '../types/music';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('playlists');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      description,
      songs: [],
      createdAt: new Date(),
      coverUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&auto=format&fit=crop'
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId && !playlist.songs.some(s => s.id === song.id)) {
        return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    }));
  };

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) };
      }
      return playlist;
    }));
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  return {
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
  };
}