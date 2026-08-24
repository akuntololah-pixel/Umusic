import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettingsStore } from '@/stores/settingsStore';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import { songsByIds, albumsByIds, artistsByIds, playlistsByIds } from '@/services/providers/mockMusicProvider';
import { Shelf } from '@/components/music/Shelf';
import { SongCard } from '@/components/music/SongCard';
import { AlbumCard, PlaylistCard } from '@/components/music/Cards';
import { ArtistCard } from '@/components/music/ArtistCard';
import { FilterChips } from '@/components/common/FilterChips';
import { LoadingSkeleton, ErrorState } from '@/components/common/States';
import { greeting } from '@/utils/format';

const FILTERS = ['All', 'For You', 'New', 'Charts'] as const;
type Filter = (typeof FILTERS)[number];

const GENRES = [
  { id: 'g1', label: 'Dream Pop', tint: '#7C5CFF' },
  { id: 'g2', label: 'Synthwave', tint: '#FF5C8A' },
  { id: 'g3', label: 'Lo-fi', tint: '#39D0D8' },
  { id: 'g4', label: 'Indie Rock', tint: '#FFB13D' },
  { id: 'g5', label: 'Ambient', tint: '#8AFF80' },
  { id: 'g6', label: 'Chillhop', tint: '#B28AFF' },
  { id: 'g7', label: 'Soul', tint: '#FF7A45' },
  { id: 'g8', label: 'Post Rock', tint: '#4DA6FF' },
];

function sectionVisible(id: string, filter: Filter): boolean {
  if (filter === 'All') return true;
  if (filter === 'For You') return ['made-for-you', 'recommended', 'favorites'].includes(id) || id.startsWith('artist-');
  if (filter === 'New') return ['new-releases', 'recent'].includes(id);
  return ['trending', 'popular-artists'].includes(id);
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selectedArtists = useSettingsStore((s) => s.selectedArtistIds);
  const { sections, loading, error, reload } = useHomeFeed(selectedArtists);
  const [filter, setFilter] = useState<Filter>('All');

  const visibleSections = useMemo(() => sections.filter((s) => sectionVisible(s.id, filter)), [sections, filter]);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 190 }}
      >
        <View style={styles.header}>
          <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.hero), letterSpacing: 0.4 }]}>
            Umusic
          </Text>
          <View style={styles.headerActions}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={theme.colors.textPrimary}
              onPress={() => router.push('/(tabs)/search')}
              accessibilityLabel="Search"
              style={{ marginRight: 14 }}
            />
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={theme.colors.textPrimary}
              onPress={() => router.push('/(tabs)/settings')}
              accessibilityLabel="Settings"
            />
          </View>
        </View>
        <Text style={[theme.font('medium'), styles.greeting, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body), paddingHorizontal: 16 }]}>
          {greeting()}
        </Text>

        <View style={{ marginTop: 12, marginBottom: 18 }}>
          <FilterChips options={[...FILTERS]} selected={filter} onSelect={(f) => setFilter(f as Filter)} accessibilityLabel="Home filters" />
        </View>

        {loading ? (
          <LoadingSkeleton rows={7} />
        ) : error ? (
          <ErrorState title="Something went wrong" message={error} onRetry={reload} />
        ) : (
          visibleSections.map((section) => {
            if (section.type === 'songs') {
              const songs = songsByIds(section.itemIds);
              if (songs.length === 0) return null;
              return (
                <Shelf key={section.id} title={section.title}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
                    {songs.map((song) => (
                      <SongCard key={`${section.id}-${song.id}`} song={song} width={148} />
                    ))}
                  </ScrollView>
                </Shelf>
              );
            }
            if (section.type === 'albums') {
              const albums = albumsByIds(section.itemIds);
              if (albums.length === 0) return null;
              return (
                <Shelf key={section.id} title={section.title}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
                    {albums.map((album) => (
                      <AlbumCard key={`${section.id}-${album.id}`} album={album} width={150} />
                    ))}
                  </ScrollView>
                </Shelf>
              );
            }
            if (section.type === 'artists') {
              const artists = artistsByIds(section.itemIds);
              if (artists.length === 0) return null;
              return (
                <Shelf key={section.id} title={section.title}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
                    {artists.map((artist) => (
                      <ArtistCard key={`${section.id}-${artist.id}`} artist={artist} width={116} />
                    ))}
                  </ScrollView>
                </Shelf>
              );
            }
            const playlists = playlistsByIds(section.itemIds);
            if (playlists.length === 0) return null;
            return (
              <Shelf key={section.id} title={section.title}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
                  {playlists.map((playlist) => (
                    <PlaylistCard key={`${section.id}-${playlist.id}`} playlist={playlist} width={150} />
                  ))}
                </ScrollView>
              </Shelf>
            );
          })
        )}

        {!loading && !error ? (
          <Shelf title="Genres & Moods">
            <View style={styles.genreGrid}>
              {GENRES.map((genre) => (
                <View
                  key={genre.id}
                  accessible
                  accessibilityLabel={`Genre ${genre.label}`}
                  style={[styles.genreTile, { backgroundColor: `${genre.tint}26`, borderColor: `${genre.tint}55`, borderRadius: theme.radius.md }]}
                >
                  <MaterialCommunityIcons name="music-circle" size={22} color={genre.tint} />
                  <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>
                    {genre.label}
                  </Text>
                </View>
              ))}
            </View>
          </Shelf>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  greeting: { marginTop: 2 },
  shelf: { paddingHorizontal: 16, gap: 14 },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  genreTile: {
    width: '47%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
});
