import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryItem, Playlist } from '@/types';
import { INITIAL_FAVORITES, INITIAL_HISTORY } from '@/data/mock';

const HISTORY_CAP = 50;

interface LibraryState {
  favorites: string[];
  favoriteArtistIds: string[];
  playlists: Playlist[];
  history: HistoryItem[];
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  toggleFavoriteArtist: (artistId: string) => void;
  createPlaylist: (title: string, description?: string) => string;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  moveInPlaylist: (playlistId: string, from: number, to: number) => void;
  pushHistory: (songId: string) => void;
  removeHistory: (songId: string) => void;
  clearHistory: () => void;
}

let playlistSeq = 0;
const nextPlaylistId = () => `user-pl-${Date.now()}-${playlistSeq++}`;

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [...INITIAL_FAVORITES],
      favoriteArtistIds: [],
      playlists: [],
      history: [...INITIAL_HISTORY],
      toggleFavorite: (songId) =>
        set((state) => ({
          favorites: state.favorites.includes(songId)
            ? state.favorites.filter((x) => x !== songId)
            : [songId, ...state.favorites],
        })),
      isFavorite: (songId) => get().favorites.includes(songId),
      toggleFavoriteArtist: (artistId) =>
        set((state) => ({
          favoriteArtistIds: state.favoriteArtistIds.includes(artistId)
            ? state.favoriteArtistIds.filter((x) => x !== artistId)
            : [artistId, ...state.favoriteArtistIds],
        })),
      createPlaylist: (title, description = '') => {
        const id = nextPlaylistId();
        const playlist: Playlist = {
          id,
          title,
          description,
          artwork: require('../../assets/artwork/playlist-focus-flow.png'),
          tint: '#7C5CFF',
          songIds: [],
          curator: 'You',
          isUserPlaylist: true,
        };
        set((state) => ({ playlists: [playlist, ...state.playlists] }));
        return id;
      },
      deletePlaylist: (playlistId) =>
        set((state) => ({ playlists: state.playlists.filter((p) => p.id !== playlistId) })),
      addToPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId && !p.songIds.includes(songId)
              ? { ...p, songIds: [...p.songIds, songId] }
              : p
          ),
        })),
      removeFromPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, songIds: p.songIds.filter((x) => x !== songId) } : p
          ),
        })),
      moveInPlaylist: (playlistId, from, to) =>
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            const songIds = [...p.songIds];
            const [moved] = songIds.splice(from, 1);
            songIds.splice(to, 0, moved);
            return { ...p, songIds };
          }),
        })),
      pushHistory: (songId) =>
        set((state) => {
          const filtered = state.history.filter((h) => h.songId !== songId);
          return {
            history: [{ songId, playedAt: Date.now() }, ...filtered].slice(0, HISTORY_CAP),
          };
        }),
      removeHistory: (songId) =>
        set((state) => ({ history: state.history.filter((h) => h.songId !== songId) })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'umusic-library', storage: createJSONStorage(() => AsyncStorage) }
  )
);
