import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, Music } from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal';
import { usePlaylists } from '../hooks/usePlaylists';

export default function Sidebar() {
  const location = useLocation();
  const { createPlaylist, playlists } = usePlaylists();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    flex items-center gap-4 transition-colors duration-200
    ${isActive(path) 
      ? 'text-white font-semibold' 
      : 'text-gray-400 hover:text-white'
    }
  `;

  const handleCreatePlaylist = (name: string, description: string) => {
    createPlaylist(name, description);
  };

  return (
    <>
      <div className="w-64 bg-black dark:bg-gray-900 text-gray-300 p-6 h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Music className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold text-white">Sangeet</span>
        </div>

        <nav className="space-y-4">
          <Link to="/" className={linkClass('/')}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/search" className={linkClass('/search')}>
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link to="/library" className={linkClass('/library')}>
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-200 w-full"
          >
            <PlusSquare className="w-5 h-5" />
            <span>Create Playlist</span>
          </button>
          <button className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-200 w-full">
            <Heart className="w-5 h-5" />
            <span>Liked Songs</span>
          </button>
        </div>

        {playlists.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">YOUR PLAYLISTS</h3>
            <div className="space-y-2 overflow-y-auto max-h-48">
              {playlists.map(playlist => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="block text-gray-400 hover:text-white transition-colors duration-200 truncate"
                >
                  {playlist.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="text-sm text-gray-400">
            <p>© 2024 Sangeet</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlaylist}
        />
      )}
    </>
  );
}