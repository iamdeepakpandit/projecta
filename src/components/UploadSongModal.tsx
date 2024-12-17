import React, { useState } from 'react';
import { X, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { useUserSongs } from '../hooks/useUserSongs';
import { genres } from '../data/genres';

interface UploadSongModalProps {
  onClose: () => void;
}

const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/x-m4a'
];

export default function UploadSongModal({ onClose }: UploadSongModalProps) {
  const { addSong } = useUserSongs();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const validateAudioFile = (file: File): Promise<{ duration: number, url: string }> => {
    return new Promise((resolve, reject) => {
      if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        reject(new Error('Invalid audio file type'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
          resolve({
            duration: Math.round(audio.duration),
            url: e.target?.result as string
          });
        };
        audio.onerror = () => reject(new Error('Failed to load audio file'));
        audio.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read audio file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !genre || !coverFile || !audioFile) {
      setError('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Read and validate the audio file
      const { duration, url: audioUrl } = await validateAudioFile(audioFile);

      // Read the cover image
      const coverUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read cover image'));
        reader.readAsDataURL(coverFile);
      });

      const newSong = await addSong({
        title,
        artist,
        genre,
        coverUrl,
        audioUrl,
        duration
      });

      if (!newSong) {
        throw new Error('Failed to add song');
      }

      onClose();
    } catch (err) {
      console.error('Failed to upload song:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload song. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'audio') {
        if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
            setError('Please upload a valid audio file (MP3, WAV, OGG, or M4A)');
            return;
        }
        setAudioFile(file);
    } else {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file');
            return;
        }
        setCoverFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    setError('');
};
  
  const clearFile = (type: 'audio' | 'cover') => {
    if (type === 'audio') {
      setAudioFile(null);
    } else {
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Upload a Song</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Song Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter song title"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
              Artist Name
            </label>
            <input
              type="text"
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter artist name"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
              Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select genre</option>
              {genres.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cover Image
            </label>
            <div className="flex items-center justify-center w-full">
              {coverPreview ? (
                <div className="relative w-full h-32">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => clearFile('cover')}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">Click to upload cover image</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'cover')}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Audio File
            </label>
            <div className="flex items-center justify-center w-full">
              {audioFile ? (
                <div className="relative w-full p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 truncate">{audioFile.name}</span>
                    <button
                      type="button"
                      onClick={() => clearFile('audio')}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-purple-500 bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">Click to upload audio file</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={ACCEPTED_AUDIO_TYPES.join(',')}
                    onChange={(e) => handleFileChange(e, 'audio')}
                  />
                </label>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}