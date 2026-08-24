import { create } from 'zustand';
import type { PlaybackMode, QueueItem, RepeatMode } from '@/types';
import { SONG_BY_ID, SONGS } from '@/data/mock/songs';
import { bindEngine, syncEngine } from '@/services/playback/engine';
import { useSettingsStore } from './settingsStore';

interface PlayerState {
  currentSongId: string | null;
  queue: QueueItem[];
  currentIndex: number;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  playbackMode: PlaybackMode;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  playSong: (songId: string, contextSongIds?: string[]) => void;
  togglePlay: () => void;
  next: (auto?: boolean) => void;
  previous: () => void;
  seek: (ms: number) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  playNextInQueue: (songId: string) => void;
  addToQueue: (songId: string) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (from: number, to: number) => void;
  tick: (deltaMs: number) => void;
}

const buildQueue = (contextSongIds: string[], startSongId: string): { queue: QueueItem[]; currentIndex: number } => {
  const now = Date.now();
  const items = contextSongIds.map((songId) => ({ songId, addedAt: now }));
  const currentIndex = Math.max(0, contextSongIds.indexOf(startSongId));
  return { queue: items, currentIndex };
};

export const usePlayerStore = create<PlayerState>()((set, get) => {
  const notify = () => {
    const s = get();
    syncEngine(s.isPlaying, s.currentSongId !== null);
  };

  const startSong = (songId: string) => {
    const song = SONG_BY_ID.get(songId);
    set({
      currentSongId: songId,
      progressMs: 0,
      durationMs: song ? song.durationMs : 0,
      isPlaying: true,
    });
  };

  return {
    currentSongId: null,
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    progressMs: 0,
    durationMs: 0,
    playbackMode: useSettingsStore.getState().defaultPlaybackMode,
    repeatMode: 'off',
    shuffleEnabled: false,

    playSong: (songId, contextSongIds) => {
      if (contextSongIds && contextSongIds.length > 0) {
        const { queue, currentIndex } = buildQueue(contextSongIds, songId);
        set({ queue, currentIndex });
      } else if (get().currentSongId === songId) {
        set({ isPlaying: true });
        notify();
        return;
      } else if (get().queue.length === 0) {
        set({ queue: [{ songId, addedAt: Date.now() }], currentIndex: 0 });
      }
      startSong(songId);
      notify();
    },

    togglePlay: () => {
      const { currentSongId, isPlaying } = get();
      if (!currentSongId) {
        const first = SONGS[0];
        if (first) get().playSong(first.id);
        return;
      }
      set({ isPlaying: !isPlaying });
      notify();
    },

    next: (auto = false) => {
      const { queue, currentIndex, repeatMode, shuffleEnabled } = get();
      if (queue.length === 0) return;
      if (auto && repeatMode === 'one') {
        set({ progressMs: 0, isPlaying: true });
        notify();
        return;
      }
      let nextIndex: number;
      if (shuffleEnabled && queue.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === currentIndex);
      } else {
        nextIndex = currentIndex + 1;
      }
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') nextIndex = 0;
        else {
          set({ isPlaying: false, progressMs: 0 });
          notify();
          return;
        }
      }
      set({ currentIndex: nextIndex });
      startSong(queue[nextIndex].songId);
      notify();
    },

    previous: () => {
      const { queue, currentIndex, progressMs } = get();
      if (progressMs > 3000) {
        set({ progressMs: 0 });
        notify();
        return;
      }
      if (queue.length === 0) return;
      const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
      set({ currentIndex: prevIndex });
      startSong(queue[prevIndex].songId);
      notify();
    },

    seek: (ms) => {
      const { durationMs } = get();
      set({ progressMs: Math.max(0, Math.min(ms, durationMs)) });
      notify();
    },

    setPlaybackMode: (playbackMode) => set({ playbackMode }),
    cycleRepeat: () =>
      set((state) => ({
        repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off',
      })),
    toggleShuffle: () => set((state) => ({ shuffleEnabled: !state.shuffleEnabled })),

    playNextInQueue: (songId) =>
      set((state) => {
        if (state.currentIndex < 0) return state;
        const item: QueueItem = { songId, addedAt: Date.now() };
        const queue = [...state.queue];
        queue.splice(state.currentIndex + 1, 0, item);
        return { queue };
      }),

    addToQueue: (songId) =>
      set((state) => ({
        queue: [...state.queue, { songId, addedAt: Date.now() }],
        currentIndex: state.currentIndex < 0 ? 0 : state.currentIndex,
      })),

    removeFromQueue: (index) =>
      set((state) => {
        if (index === state.currentIndex) return state;
        const queue = state.queue.filter((_, i) => i !== index);
        const currentIndex = index < state.currentIndex ? state.currentIndex - 1 : state.currentIndex;
        return { queue, currentIndex };
      }),

    moveQueueItem: (from, to) =>
      set((state) => {
        if (from === to || from === state.currentIndex || to === state.currentIndex) return state;
        const queue = [...state.queue];
        const [moved] = queue.splice(from, 1);
        queue.splice(to, 0, moved);
        const currentIndex = state.currentIndex;
        return { queue, currentIndex };
      }),

    tick: (deltaMs) => {
      const { isPlaying, progressMs, durationMs } = get();
      if (!isPlaying) return;
      const nextProgress = progressMs + deltaMs;
      if (durationMs > 0 && nextProgress >= durationMs) {
        get().next(true);
        return;
      }
      set({ progressMs: nextProgress });
    },
  };
});

bindEngine(
  () => ({
    isPlaying: usePlayerStore.getState().isPlaying,
    hasSong: usePlayerStore.getState().currentSongId !== null,
  }),
  (deltaMs) => usePlayerStore.getState().tick(deltaMs)
);
