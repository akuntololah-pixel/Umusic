import { usePlayerStore } from '@/stores/playerStore';
import { SONGS } from '@/data/mock/songs';

describe('playerStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    usePlayerStore.setState({
      currentSongId: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      progressMs: 0,
      durationMs: 0,
      playbackMode: 'AUDIO',
      repeatMode: 'off',
      shuffleEnabled: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('plays a song with queue context', () => {
    const ids = SONGS.slice(0, 5).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[2], ids);
    const state = usePlayerStore.getState();
    expect(state.currentSongId).toBe(ids[2]);
    expect(state.isPlaying).toBe(true);
    expect(state.queue).toHaveLength(5);
    expect(state.currentIndex).toBe(2);
    expect(state.durationMs).toBeGreaterThan(0);
  });

  it('toggles play and pause', () => {
    const ids = SONGS.slice(0, 3).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('advances next and wraps with repeat all', () => {
    const ids = SONGS.slice(0, 3).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[2], ids);
    usePlayerStore.getState().cycleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('all');
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().currentSongId).toBe(ids[0]);
  });

  it('stops at end of queue with repeat off', () => {
    const ids = SONGS.slice(0, 2).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[1], ids);
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('restarts song with repeat one on auto next', () => {
    const ids = SONGS.slice(0, 2).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    usePlayerStore.getState().cycleRepeat();
    usePlayerStore.getState().cycleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('one');
    usePlayerStore.getState().next(true);
    expect(usePlayerStore.getState().currentSongId).toBe(ids[0]);
    expect(usePlayerStore.getState().progressMs).toBe(0);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('previous restarts song when progress is small', () => {
    const ids = SONGS.slice(0, 3).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[1], ids);
    usePlayerStore.getState().previous();
    expect(usePlayerStore.getState().currentSongId).toBe(ids[0]);
  });

  it('previous restarts current song when progress is large', () => {
    const ids = SONGS.slice(0, 3).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[1], ids);
    usePlayerStore.getState().seek(5000);
    usePlayerStore.getState().previous();
    expect(usePlayerStore.getState().currentSongId).toBe(ids[1]);
    expect(usePlayerStore.getState().progressMs).toBe(0);
  });

  it('seek clamps to duration', () => {
    const ids = SONGS.slice(0, 2).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    const duration = usePlayerStore.getState().durationMs;
    usePlayerStore.getState().seek(duration + 99999);
    expect(usePlayerStore.getState().progressMs).toBe(duration);
  });

  it('tick advances progress', () => {
    const ids = SONGS.slice(0, 2).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    usePlayerStore.getState().tick(500);
    expect(usePlayerStore.getState().progressMs).toBe(500);
  });

  it('tick auto-advances at song end', () => {
    const ids = SONGS.slice(0, 2).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    usePlayerStore.getState().tick(999999);
    expect(usePlayerStore.getState().currentSongId).toBe(ids[1]);
  });

  it('queue operations work', () => {
    const ids = SONGS.slice(0, 3).map((s) => s.id);
    const extra = SONGS.slice(3, 7).map((s) => s.id);
    usePlayerStore.getState().playSong(ids[0], ids);
    usePlayerStore.getState().playNextInQueue(extra[2]);
    let queue = usePlayerStore.getState().queue;
    expect(queue[1].songId).toBe(extra[2]);
    usePlayerStore.getState().addToQueue(extra[3]);
    queue = usePlayerStore.getState().queue;
    expect(queue[queue.length - 1].songId).toBe(extra[3]);
    usePlayerStore.getState().removeFromQueue(1);
    queue = usePlayerStore.getState().queue;
    expect(queue.some((q) => q.songId === extra[2])).toBe(false);
    usePlayerStore.getState().moveQueueItem(3, 1);
    queue = usePlayerStore.getState().queue;
    expect(queue[1].songId).toBe(extra[3]);
  });

  it('playback mode changes', () => {
    usePlayerStore.getState().setPlaybackMode('VIDEO');
    expect(usePlayerStore.getState().playbackMode).toBe('VIDEO');
    usePlayerStore.getState().setPlaybackMode('AUDIO');
    expect(usePlayerStore.getState().playbackMode).toBe('AUDIO');
  });

  it('shuffle toggles', () => {
    usePlayerStore.getState().toggleShuffle();
    expect(usePlayerStore.getState().shuffleEnabled).toBe(true);
    usePlayerStore.getState().toggleShuffle();
    expect(usePlayerStore.getState().shuffleEnabled).toBe(false);
  });
});
