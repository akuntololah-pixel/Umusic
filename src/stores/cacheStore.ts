import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CacheItem, CacheStatus } from '@/types';
import { SONG_BY_ID } from '@/data/mock/songs';

export const CACHE_LIMIT_OPTIONS = [100, 500, 1024, 2048, 0] as const;

const mockSizeMb = (songId: string): number => {
  const song = SONG_BY_ID.get(songId);
  if (!song) return 3.5;
  return Math.round((song.durationMs / 1000) * 0.016 * 10) / 10 + 0.4;
};

interface CacheState {
  items: Record<string, CacheItem>;
  offline: string[];
  autoCache: boolean;
  keepOfflineEnabled: boolean;
  cacheLimitMb: number;
  statusFor: (songId: string) => CacheStatus;
  cacheSong: (songId: string) => void;
  removeCached: (songId: string) => void;
  keepOffline: (songId: string) => void;
  removeOffline: (songId: string) => void;
  clearAudioCache: () => void;
  clearAllCache: () => void;
  setAutoCache: (on: boolean) => void;
  setKeepOffline: (on: boolean) => void;
  setCacheLimit: (limitMb: number) => void;
  totalSizeMb: () => number;
  cachedCount: () => number;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      items: {},
      offline: [],
      autoCache: true,
      keepOfflineEnabled: true,
      cacheLimitMb: 1024,

      statusFor: (songId) => {
        const { offline, items } = get();
        if (offline.includes(songId)) return 'OFFLINE';
        return items[songId]?.status ?? 'NOT_CACHED';
      },

      cacheSong: (songId) => {
        if (get().items[songId]?.status === 'CACHED') return;
        set((state) => ({
          items: {
            ...state.items,
            [songId]: { songId, sizeMb: 0, cachedAt: Date.now(), status: 'CACHING' },
          },
        }));
        setTimeout(() => {
          set((state) => {
            const item = state.items[songId];
            if (!item || item.status !== 'CACHING') return state;
            return {
              items: {
                ...state.items,
                [songId]: { ...item, sizeMb: mockSizeMb(songId), status: 'CACHED', cachedAt: Date.now() },
              },
            };
          });
        }, 900);
      },

      removeCached: (songId) =>
        set((state) => {
          const items = { ...state.items };
          delete items[songId];
          return { items };
        }),

      keepOffline: (songId) => {
        get().cacheSong(songId);
        set((state) => ({
          offline: state.offline.includes(songId) ? state.offline : [...state.offline, songId],
        }));
      },

      removeOffline: (songId) =>
        set((state) => ({ offline: state.offline.filter((x) => x !== songId) })),

      clearAudioCache: () => set((state) => ({ items: {} })),

      clearAllCache: () => set({ items: {}, offline: [] }),

      setAutoCache: (autoCache) => set({ autoCache }),
      setKeepOffline: (keepOfflineEnabled) => set({ keepOfflineEnabled }),
      setCacheLimit: (cacheLimitMb) => set({ cacheLimitMb }),

      totalSizeMb: () =>
        Object.values(get().items).reduce((sum, item) => sum + (item.status === 'CACHED' ? item.sizeMb : 0), 0),
      cachedCount: () => Object.values(get().items).filter((x) => x.status === 'CACHED').length,
    }),
    { name: 'umusic-cache', storage: createJSONStorage(() => AsyncStorage) }
  )
);
