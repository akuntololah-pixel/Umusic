import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterChips } from '@/components/common/FilterChips';
import { SongRow } from '@/components/music/SongRow';
import { ArtistCard } from '@/components/music/ArtistCard';
import { AlbumCard, PlaylistCard } from '@/components/music/Cards';
import { EmptyState, LoadingSkeleton, OfflineState } from '@/components/common/States';
import { mockMusicProvider } from '@/services/providers/mockMusicProvider';
import { useDebouncedValue, useOffline } from '@/hooks';
import { useUiStore } from '@/stores/uiStore';
import { GENRE_TILES } from '@/data/mock/genreTiles';
import type { Album, Artist, Playlist, Song } from '@/types';

const FILTERS = ['All', 'Songs', 'Artists', 'Albums', 'Playlists'] as const;
type Filter = (typeof FILTERS)[number];

export default function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const offline = useOffline();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [results, setResults] = useState<{ songs: Song[]; artists: Artist[]; albums: Album[]; playlists: Playlist[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const debounced = useDebouncedValue(query, 220);
  const recentSearches = useUiStore((s) => s.recentSearches);
  const pushRecentSearch = useUiStore((s) => s.pushRecentSearch);
  const clearRecentSearches = useUiStore((s) => s.clearRecentSearches);

  const onQueryChange = (text: string) => {
    setQuery(text);
    setLoading(true);
  };

  useEffect(() => {
    if (!debounced.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }
    let active = true;
    mockMusicProvider
      .search(debounced)
      .then((r) => {
        if (!active) return;
        setResults(r);
        pushRecentSearch(debounced);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debounced, pushRecentSearch]);

  const showResults = Boolean(query.trim());
  const showSongs = !filter || filter === 'All' || filter === 'Songs';
  const showArtists = !filter || filter === 'All' || filter === 'Artists';
  const showAlbums = !filter || filter === 'All' || filter === 'Albums';
  const showPlaylists = !filter || filter === 'All' || filter === 'Playlists';
  const hasAny =
    results && (results.songs.length > 0 || results.artists.length > 0 || results.albums.length > 0 || results.playlists.length > 0);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, gap: 12 }}>
        <SearchBar
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search songs, artists, albums, playlists"
          accessibilityLabel="Search Umusic"
        />
        {showResults ? <FilterChips options={[...FILTERS]} selected={filter} onSelect={(f) => setFilter(f as Filter)} accessibilityLabel="Result filters" /> : null}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 190, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {offline ? (
          <OfflineState title="You're offline" message="Search needs a connection in the final app. Local results only." />
        ) : !showResults ? (
          <React.Fragment>
            {recentSearches.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHead}>
                  <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>Recent searches</Text>
                  <Text
                    onPress={clearRecentSearches}
                    accessibilityRole="button"
                    accessibilityLabel="Clear recent searches"
                    style={[theme.font('semibold'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}
                  >
                    Clear
                  </Text>
                </View>
                {recentSearches.map((q) => (
                  <Text
                    key={q}
                    onPress={() => setQuery(q)}
                    accessibilityRole="button"
                    accessibilityLabel={`Search for ${q}`}
                    style={[theme.font('medium'), styles.recentItem, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body) }]}
                  >
                    {q}
                  </Text>
                ))}
              </View>
            ) : null}
            <Text style={[theme.font('bold'), styles.sectionTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium), paddingHorizontal: 16 }]}>
              Browse all
            </Text>
            <View style={styles.genreGrid}>
              {GENRE_TILES.map((tile) => (
                <View key={tile.label} accessible accessibilityLabel={`Explore ${tile.label}`} style={[styles.genreTile, { backgroundColor: `${tile.tint}26`, borderColor: `${tile.tint}55`, borderRadius: theme.radius.md }]}>
                  <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>{tile.label}</Text>
                </View>
              ))}
            </View>
          </React.Fragment>
        ) : loading ? (
          <LoadingSkeleton rows={6} />
        ) : !hasAny ? (
          <EmptyState title="No results found" message={`Nothing matched "${query}". Try a different search.`} icon="magnify-remove-outline" />
        ) : (
          <React.Fragment>
            {showArtists && results.artists.length > 0 ? (
              <View style={styles.section}>
                <Text style={[theme.font('bold'), styles.groupTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>Artists</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                  {results.artists.map((a) => (
                    <ArtistCard key={a.id} artist={a} width={110} />
                  ))}
                </ScrollView>
              </View>
            ) : null}
            {showAlbums && results.albums.length > 0 ? (
              <View style={styles.section}>
                <Text style={[theme.font('bold'), styles.groupTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>Albums</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
                  {results.albums.map((a) => (
                    <AlbumCard key={a.id} album={a} width={140} />
                  ))}
                </ScrollView>
              </View>
            ) : null}
            {showPlaylists && results.playlists.length > 0 ? (
              <View style={styles.section}>
                <Text style={[theme.font('bold'), styles.groupTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>Playlists</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
                  {results.playlists.map((p) => (
                    <PlaylistCard key={p.id} playlist={p} width={140} />
                  ))}
                </ScrollView>
              </View>
            ) : null}
            {showSongs && results.songs.length > 0 ? (
              <View style={styles.section}>
                <Text style={[theme.font('bold'), styles.groupTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>Songs</Text>
                {results.songs.map((s) => (
                  <SongRow key={s.id} song={s} contextSongIds={results.songs.map((x) => x.id)} showCache />
                ))}
              </View>
            ) : null}
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  section: { marginBottom: 26 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { marginBottom: 12 },
  groupTitle: { paddingHorizontal: 16, marginBottom: 10 },
  recentItem: { paddingVertical: 10, paddingHorizontal: 16 },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  genreTile: { width: '47%', height: 72, justifyContent: 'flex-end', padding: 12, borderWidth: 1 },
});
