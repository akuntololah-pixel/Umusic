import { useEffect, useState } from 'react';
import { SONG_BY_ID } from '@/data/mock/songs';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';
import type { Song } from '@/types';

export function useCurrentSong(): Song | null {
  const id = usePlayerStore((s) => s.currentSongId);
  return id ? SONG_BY_ID.get(id) ?? null : null;
}

export function useSongById(songId: string | null): Song | null {
  return songId ? SONG_BY_ID.get(songId) ?? null : null;
}

export function useIsFavorite(songId: string | null): boolean {
  const favorites = useLibraryStore((s) => s.favorites);
  return songId ? favorites.includes(songId) : false;
}

export function useOffline(): boolean {
  return useUiStore((s) => s.offlineSimulation);
}

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
