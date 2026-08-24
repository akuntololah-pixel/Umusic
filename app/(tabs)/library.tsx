import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { FilterChips } from '@/components/common/FilterChips';
import { SongRow } from '@/components/music/SongRow';
import { AlbumCard, PlaylistCard } from '@/components/music/Cards';
import { ArtistCard } from '@/components/music/ArtistCard';
import { EmptyState, OfflineState } from '@/components/common/States';
import { SONGS } from '@/data/mock/songs';
import { ALBUMS } from '@/data/mock/albums';
import { PLAYLISTS } from '@/data/mock/playlists';
import { ARTISTS } from '@/data/mock/artists';
import { useLibraryStore } from '@/stores/libraryStore';
import { useCacheStore } from '@/stores/cacheStore';
import { useOffline } from '@/hooks';

const FILTERS = ['Playlists', 'Artists', 'Albums', 'Songs', 'Offline'] as const;
type Filter = (typeof FILTERS)[number];

export default function LibraryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const offline = useOffline();
  const [filter, setFilter] = useState<Filter>('Playlists');
  const favorites = useLibraryStore((s) => s.favorites);
  const favoriteArtists = useLibraryStore((s) => s.favoriteArtistIds);
  const userPlaylists = useLibraryStore((s) => s.playlists);
  const history = useLibraryStore((s) => s.history);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const cacheItems = useCacheStore((s) => s.items);

  const cachedIds = useMemo(
    () => Object.entries(cacheItems).filter(([, v]) => v.status === 'CACHED' || v.status === 'OFFLINE').map(([k]) => k),
    [cacheItems]
  );
  const favoriteSongs = useMemo(() => SONGS.filter((s) => favorites.includes(s.id)), [favorites]);
  const favArtists = useMemo(() => ARTISTS.filter((a) => favoriteArtists.includes(a.id)), [favoriteArtists]);
  const recentSongs = useMemo(
    () => history.map((h) => SONGS.find((s) => s.id === h.songId)).filter((s): s is (typeof SONGS)[number] => Boolean(s)),
    [history]
  );
  const cached = useMemo(() => SONGS.filter((s) => cachedIds.includes(s.id)), [cachedIds]);
  const allPlaylists = [...userPlaylists, ...PLAYLISTS];
  const favoriteAlbums = useMemo(() => ALBUMS.filter((a) => favorites.some((f) => a.songIds.includes(f))), [favorites]);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 16 }}>
        <View style={styles.headerRow}>
          <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.hero) }]}>Library</Text>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={26}
            color={theme.colors.textPrimary}
            accessibilityLabel="Create playlist"
            onPress={() => {
              const id = createPlaylist(`My Playlist ${userPlaylists.length + 1}`);
              router.push({ pathname: '/playlist-editor', params: { id } } as never);
            }}
          />
        </View>
      </View>

      <View style={{ marginTop: 12, marginBottom: 14 }}>
        <FilterChips options={[...FILTERS]} selected={filter} onSelect={(f) => setFilter(f as Filter)} accessibilityLabel="Library filters" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
        {offline && filter !== 'Playlists' && filter !== 'Songs' ? (
          <OfflineState title="You're offline" message="Only local content is available right now." />
        ) : null}

        {filter === 'Playlists' ? (
          <React.Fragment>
            <View style={styles.quickRow}>
              <Pressable
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Favorites, ${favoriteSongs.length} songs`}
                onPress={() => router.push('/favorites')}
                style={({ pressed }) => [
                  styles.quickCard,
                  { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <MaterialCommunityIcons name="heart" size={22} color={theme.colors.accent} />
                <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>Favorites</Text>
                <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>{favoriteSongs.length} songs</Text>
              </Pressable>
              <Pressable
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Recently played, ${recentSongs.length} songs`}
                onPress={() => router.push('/history')}
                style={({ pressed }) => [
                  styles.quickCard,
                  { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <MaterialCommunityIcons name="history" size={22} color={theme.colors.success} />
                <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>History</Text>
                <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>{recentSongs.length} songs</Text>
              </Pressable>
            </View>
            {allPlaylists.length === 0 ? (
              <EmptyState
                title="No playlists yet"
                message="Create your first playlist to get started."
                actionLabel="Create Playlist"
                onAction={() => {
                  const id = createPlaylist('My Playlist 1');
                  router.push({ pathname: '/playlist-editor', params: { id } } as never);
                }}
              />
            ) : (
              <View style={styles.gridWrap}>
                {allPlaylists.map((p) => (
                  <PlaylistCard key={p.id} playlist={p} width={150} />
                ))}
              </View>
            )}
          </React.Fragment>
        ) : null}

        {filter === 'Artists' ? (
          favArtists.length === 0 ? (
            <EmptyState title="No followed artists" message="Artists you favorite will appear here." />
          ) : (
            <View style={styles.gridWrap}>
              {favArtists.map((a) => (
                <ArtistCard key={a.id} artist={a} width={110} />
              ))}
            </View>
          )
        ) : null}

        {filter === 'Albums' ? (
          favoriteAlbums.length === 0 ? (
            <EmptyState title="No albums yet" message="Albums from songs you love will show up here." />
          ) : (
            <View style={styles.gridWrap}>
              {favoriteAlbums.map((a) => (
                <AlbumCard key={a.id} album={a} width={150} />
              ))}
            </View>
          )
        ) : null}

        {filter === 'Songs' ? (
          favoriteSongs.length === 0 ? (
            <EmptyState title="Nothing saved yet" message="Tap the heart on any song to find it here." />
          ) : (
            favoriteSongs.map((s, i) => <SongRow key={s.id} song={s} index={i} contextSongIds={favoriteSongs.map((x) => x.id)} showCache />)
          )
        ) : null}

        {filter === 'Offline' ? (
          cached.length === 0 ? (
            <EmptyState title="No offline audio" message="Keep songs offline from the song menu to play them anywhere." icon="wifi-off" />
          ) : (
            cached.map((s) => <SongRow key={s.id} song={s} contextSongIds={cached.map((x) => x.id)} showCache />)
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 18 },
  quickCard: { flex: 1, padding: 14, gap: 4 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 16 },
});
