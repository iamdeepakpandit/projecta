export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  genre: string;
}

export interface Genre {
  id: string;
  name: string;
  coverUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  songs: Song[];
  createdAt: Date;
}