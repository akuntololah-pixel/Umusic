import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DisplaySize, NavStyle, PlaybackMode, ThemeMode } from '@/types';

interface SettingsState {
  themeMode: ThemeMode;
  accentId: string;
  displaySize: DisplaySize;
  navStyle: NavStyle;
  onboardingCompleted: boolean;
  selectedArtistIds: string[];
  autoplay: boolean;
  defaultPlaybackMode: PlaybackMode;
  setThemeMode: (mode: ThemeMode) => void;
  setAccent: (accentId: string) => void;
  setDisplaySize: (size: DisplaySize) => void;
  setNavStyle: (style: NavStyle) => void;
  completeOnboarding: (artistIds: string[]) => void;
  skipOnboarding: () => void;
  setSelectedArtists: (ids: string[]) => void;
  toggleSelectedArtist: (id: string, max: number) => void;
  setAutoplay: (on: boolean) => void;
  setDefaultPlaybackMode: (mode: PlaybackMode) => void;
  resetMusicPreferences: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      accentId: 'default',
      displaySize: 'default',
      navStyle: 'bottom',
      onboardingCompleted: false,
      selectedArtistIds: [],
      autoplay: true,
      defaultPlaybackMode: 'AUDIO',
      setThemeMode: (themeMode) => set({ themeMode }),
      setAccent: (accentId) => set({ accentId }),
      setDisplaySize: (displaySize) => set({ displaySize }),
      setNavStyle: (navStyle) => set({ navStyle }),
      completeOnboarding: (artistIds) =>
        set({ onboardingCompleted: true, selectedArtistIds: artistIds }),
      skipOnboarding: () => set({ onboardingCompleted: true }),
      setSelectedArtists: (selectedArtistIds) => set({ selectedArtistIds }),
      toggleSelectedArtist: (id, max) =>
        set((state) => {
          const has = state.selectedArtistIds.includes(id);
          if (has) {
            return { selectedArtistIds: state.selectedArtistIds.filter((x) => x !== id) };
          }
          if (state.selectedArtistIds.length >= max) return state;
          return { selectedArtistIds: [...state.selectedArtistIds, id] };
        }),
      setAutoplay: (autoplay) => set({ autoplay }),
      setDefaultPlaybackMode: (defaultPlaybackMode) => set({ defaultPlaybackMode }),
      resetMusicPreferences: () =>
        set({ onboardingCompleted: false, selectedArtistIds: [] }),
    }),
    { name: 'umusic-settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
