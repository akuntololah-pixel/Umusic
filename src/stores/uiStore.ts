import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SheetKind = 'song' | 'playlist' | null;

interface UiState {
  sheet: SheetKind;
  sheetSongId: string | null;
  sheetPlaylistId: string | null;
  sidebarCollapsed: boolean;
  recentSearches: string[];
  offlineSimulation: boolean;
  openSongSheet: (songId: string) => void;
  openPlaylistSheet: (playlistId: string) => void;
  closeSheet: () => void;
  toggleSidebarCollapsed: () => void;
  pushRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setOfflineSimulation: (on: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sheet: null,
      sheetSongId: null,
      sheetPlaylistId: null,
      sidebarCollapsed: false,
      recentSearches: [],
      offlineSimulation: false,
      openSongSheet: (sheetSongId) => set({ sheet: 'song', sheetSongId, sheetPlaylistId: null }),
      openPlaylistSheet: (sheetPlaylistId) => set({ sheet: 'playlist', sheetPlaylistId, sheetSongId: null }),
      closeSheet: () => set({ sheet: null, sheetSongId: null, sheetPlaylistId: null }),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      pushRecentSearch: (query) =>
        set((state) => {
          const q = query.trim();
          if (!q) return state;
          return { recentSearches: [q, ...state.recentSearches.filter((x) => x !== q)].slice(0, 8) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setOfflineSimulation: (offlineSimulation) => set({ offlineSimulation }),
    }),
    {
      name: 'umusic-ui',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
