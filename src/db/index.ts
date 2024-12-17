import { openDB } from 'idb';
import type { Song } from '../types/music';

const DB_NAME = 'sangeet-db';
const SONGS_STORE = 'songs';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        const store = db.createObjectStore(SONGS_STORE, { 
          keyPath: 'id'
        });
        store.createIndex('genre', 'genre');
        store.createIndex('title', 'title');
        store.createIndex('artist', 'artist');
      }
    },
  });
  return db;
};

export const insertSong = async (song: Omit<Song, 'id'>): Promise<Song> => {
  const db = await initDB();
  const tx = db.transaction(SONGS_STORE, 'readwrite');
  const store = tx.objectStore(SONGS_STORE);
  

  const id = crypto.randomUUID();
  const songWithId = { ...song, id };
  
  await store.add(songWithId);
  await tx.done;
  
  return songWithId;
};

export const getAllSongs = async (): Promise<Song[]> => {
  const db = await initDB();
  return db.getAll(SONGS_STORE);
};

export const getSongsByGenre = async (genre: string): Promise<Song[]> => {
  const db = await initDB();
  const tx = db.transaction(SONGS_STORE, 'readonly');
  const index = tx.store.index('genre');
  return index.getAll(genre);
};

export const deleteSong = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete(SONGS_STORE, id);
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  const db = await initDB();
  const tx = db.transaction(SONGS_STORE, 'readonly');
  const store = tx.objectStore(SONGS_STORE);
  const songs = await store.getAll();
  
  const searchQuery = query.toLowerCase();
  return songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery) ||
    song.artist.toLowerCase().includes(searchQuery) ||
    song.genre.toLowerCase().includes(searchQuery)
  );
};