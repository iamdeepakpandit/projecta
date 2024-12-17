import React, { useState } from 'react';
import { Plus, Upload, Music, Clock } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { useUserSongs } from '../hooks/useUserSongs';
import type { Song } from '../types/music';
import UploadSongModal from '../components/UploadSongModal';
import SongCard from '../components/SongCard';

interface LibraryProps {
  onPlaySong: (song: Song) => void;
}

export default function Library({ onPlaySong }: LibraryProps) {
  const { playlists } = usePlaylists();
  const { userSongs, removeSong } = useUserSongs();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSong = async (song: Song) => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      try {
        setIsDeleting(true);
        await removeSong(song.id);
      } catch (error) {
        console.error('Failed to delete song:', error);
        alert('Failed to delete song. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Library</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-purple-600 text-white rounded-full transition-colors duration-300"
            disabled={isDeleting}
          >
            <Upload className="w-5 h-5" />
            <span>Upload Song</span>
          </button>
        </div>

        {userSongs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Your Uploaded Songs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {userSongs.map(song => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onPlay={onPlaySong}
                  onDelete={handleDeleteSong}
                  showDelete={true}
                />
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                className="bg-gray-900/30 p-4 rounded-lg hover:bg-gray-900/60 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-md mb-4">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-medium text-white truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400 truncate mt-1">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </p>
              </div>
            ))}
          </div>

          {playlists.length === 0 && !userSongs.length && (
            <div className="text-center text-gray-400 mt-12">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Upload songs or create a playlist to get started</p>
            </div>
          )}
        </section>
      </div>

      {showUploadModal && (
        <UploadSongModal onClose={() => setShowUploadModal(false)} />
      )}
    </>
  );
}