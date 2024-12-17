import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import GenrePage from './pages/GenrePage';
import { useAudioPlayer } from './hooks/useAudioPlayer';

function App() {
  const {
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
  } = useAudioPlayer();

  return (
    <Router>
      <div className="flex dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-b from-blue-900 to-black dark:from-gray-800 dark:to-gray-900 min-h-screen text-white p-8 pb-32 overflow-auto">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<Home onPlaySong={playSong} />} />
            <Route path="/search" element={<Search onPlaySong={playSong} />} />
            <Route path="/library" element={<Library onPlaySong={playSong} />} />
            <Route path="/genre/:id" element={<GenrePage onPlaySong={playSong} />} />
          </Routes>
        </main>
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onVolumeChange={adjustVolume}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onNext={playNext}
          onPrevious={playPrevious}
        />
      </div>
    </Router>
  );
}

export default App;