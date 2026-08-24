import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useCacheStore } from '@/stores/cacheStore';
import { SONGS } from '@/data/mock/songs';

describe('libraryStore', () => {
  beforeEach(() => {
    useLibraryStore.setState({ favorites: [], favoriteArtistIds: [], playlists: [], history: [] });
  });

  it('toggles favorites', () => {
    const store = useLibraryStore.getState();
    store.toggleFavorite('s01');
    expect(useLibraryStore.getState().favorites).toContain('s01');
    useLibraryStore.getState().toggleFavorite('s01');
    expect(useLibraryStore.getState().favorites).not.toContain('s01');
  });

  it('pushes history without duplicates and caps size', () => {
    const store = useLibraryStore.getState();
    store.pushHistory('s01');
    store.pushHistory('s01');
    expect(useLibraryStore.getState().history.filter((h) => h.songId === 's01')).toHaveLength(1);
    for (let i = 0; i < 60; i++) {
      useLibraryStore.getState().pushHistory(SONGS[i % SONGS.length].id);
    }
    expect(useLibraryStore.getState().history.length).toBeLessThanOrEqual(50);
  });

  it('removes history entry and clears all', () => {
    useLibraryStore.getState().pushHistory('s01');
    useLibraryStore.getState().pushHistory('s02');
    useLibraryStore.getState().removeHistory('s01');
    expect(useLibraryStore.getState().history.some((h) => h.songId === 's01')).toBe(false);
    useLibraryStore.getState().clearHistory();
    expect(useLibraryStore.getState().history).toHaveLength(0);
  });

  it('creates, edits and deletes user playlists', () => {
    const store = useLibraryStore.getState();
    const id = store.createPlaylist('My Mix');
    expect(useLibraryStore.getState().playlists[0].title).toBe('My Mix');
    useLibraryStore.getState().addToPlaylist(id, 's01');
    useLibraryStore.getState().addToPlaylist(id, 's02');
    useLibraryStore.getState().addToPlaylist(id, 's01');
    expect(useLibraryStore.getState().playlists[0].songIds).toEqual(['s01', 's02']);
    useLibraryStore.getState().moveInPlaylist(id, 1, 0);
    expect(useLibraryStore.getState().playlists[0].songIds).toEqual(['s02', 's01']);
    useLibraryStore.getState().removeFromPlaylist(id, 's02');
    expect(useLibraryStore.getState().playlists[0].songIds).toEqual(['s01']);
    useLibraryStore.getState().deletePlaylist(id);
    expect(useLibraryStore.getState().playlists).toHaveLength(0);
  });

  it('toggles favorite artists', () => {
    useLibraryStore.getState().toggleFavoriteArtist('aurora-waves');
    expect(useLibraryStore.getState().favoriteArtistIds).toContain('aurora-waves');
    useLibraryStore.getState().toggleFavoriteArtist('aurora-waves');
    expect(useLibraryStore.getState().favoriteArtistIds).not.toContain('aurora-waves');
  });
});

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      themeMode: 'dark',
      accentId: 'default',
      displaySize: 'default',
      navStyle: 'bottom',
      onboardingCompleted: false,
      selectedArtistIds: [],
    });
  });

  it('enforces artist selection limits', () => {
    const store = useSettingsStore.getState();
    for (let i = 0; i < 15; i++) {
      store.toggleSelectedArtist(`artist-${i}`, 15);
    }
    expect(useSettingsStore.getState().selectedArtistIds).toHaveLength(15);
    useSettingsStore.getState().toggleSelectedArtist('artist-99', 15);
    expect(useSettingsStore.getState().selectedArtistIds).toHaveLength(15);
    useSettingsStore.getState().toggleSelectedArtist('artist-0', 15);
    expect(useSettingsStore.getState().selectedArtistIds).not.toContain('artist-0');
  });

  it('reset only clears onboarding and selected artists', () => {
    useSettingsStore.setState({ onboardingCompleted: true, selectedArtistIds: ['a', 'b'] });
    useLibraryStore.setState({ favorites: ['s01'] });
    useSettingsStore.getState().resetMusicPreferences();
    expect(useSettingsStore.getState().onboardingCompleted).toBe(false);
    expect(useSettingsStore.getState().selectedArtistIds).toEqual([]);
    expect(useLibraryStore.getState().favorites).toEqual(['s01']);
  });

  it('updates theme, accent, display and nav', () => {
    useSettingsStore.getState().setThemeMode('light');
    useSettingsStore.getState().setAccent('rose');
    useSettingsStore.getState().setDisplaySize('large');
    useSettingsStore.getState().setNavStyle('sidebar');
    const s = useSettingsStore.getState();
    expect(s.themeMode).toBe('light');
    expect(s.accentId).toBe('rose');
    expect(s.displaySize).toBe('large');
    expect(s.navStyle).toBe('sidebar');
  });

  it('skipOnboarding completes onboarding', () => {
    useSettingsStore.getState().skipOnboarding();
    expect(useSettingsStore.getState().onboardingCompleted).toBe(true);
  });
});

describe('cacheStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useCacheStore.setState({ items: {}, offline: [], autoCache: true, keepOfflineEnabled: true, cacheLimitMb: 1024 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('caches a song with mock delay', () => {
    useCacheStore.getState().cacheSong('s01');
    expect(useCacheStore.getState().statusFor('s01')).toBe('CACHING');
    jest.advanceTimersByTime(1000);
    expect(useCacheStore.getState().statusFor('s01')).toBe('CACHED');
    expect(useCacheStore.getState().totalSizeMb()).toBeGreaterThan(0);
  });

  it('keep offline marks OFFLINE status', () => {
    useCacheStore.getState().keepOffline('s02');
    expect(useCacheStore.getState().statusFor('s02')).toBe('OFFLINE');
    jest.advanceTimersByTime(1000);
    expect(useCacheStore.getState().statusFor('s02')).toBe('OFFLINE');
  });

  it('removes cached song and clears cache', () => {
    useCacheStore.getState().cacheSong('s01');
    jest.advanceTimersByTime(1000);
    useCacheStore.getState().removeCached('s01');
    expect(useCacheStore.getState().statusFor('s01')).toBe('NOT_CACHED');
    useCacheStore.getState().keepOffline('s03');
    useCacheStore.getState().clearAllCache();
    expect(useCacheStore.getState().statusFor('s03')).toBe('NOT_CACHED');
  });

  it('cache limit and settings update', () => {
    useCacheStore.getState().setCacheLimit(500);
    useCacheStore.getState().setAutoCache(false);
    useCacheStore.getState().setKeepOffline(false);
    const s = useCacheStore.getState();
    expect(s.cacheLimitMb).toBe(500);
    expect(s.autoCache).toBe(false);
    expect(s.keepOfflineEnabled).toBe(false);
  });
});
