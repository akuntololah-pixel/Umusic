import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { SongRow } from '@/components/music/SongRow';
import { ArtistCard } from '@/components/music/ArtistCard';
import { AlbumCard } from '@/components/music/Cards';
import { Shelf } from '@/components/music/Shelf';
import { EmptyState, LoadingSkeleton } from '@/components/common/States';
import { IconButton } from '@/components/common/IconButton';
import { PrimaryButton } from '@/components/common/Buttons';
import { mockMusicProvider } from '@/services/providers/mockMusicProvider';
import { SONGS } from '@/data/mock/songs';
import { ALBUMS } from '@/data/mock/albums';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useLoadable } from '@/hooks/useLoadable';
import { formatListeners } from '@/utils/format';
import type { Artist } from '@/types';

export default function ArtistScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = usePlayerStore();
  const favoriteArtistIds = useLibraryStore((s) => s.favoriteArtistIds);
  const toggleFavoriteArtist = useLibraryStore((s) => s.toggleFavoriteArtist);
  const { data: artist, loading } = useLoadable<Artist>(() => mockMusicProvider.getArtist(id), [id]);
  const [related, setRelated] = useState<Artist[]>([]);

  useEffect(() => {
    let active = true;
    mockMusicProvider
      .getRelated(id)
      .then((list) => {
        if (active) setRelated(list);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: 60 }]}>
        <LoadingSkeleton rows={6} />
      </View>
    );
  }
  if (!artist) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
        <EmptyState title="Artist not found" message="This artist does not exist in the catalog." />
      </View>
    );
  }

  const artistSongs = SONGS.filter((s) => s.artistId === artist.id);
  const popular = [...artistSongs].sort((a, b) => b.plays - a.plays);
  const albums = ALBUMS.filter((a) => a.artistId === artist.id);
  const following = favoriteArtistIds.includes(artist.id);
  const songIds = popular.map((s) => s.id);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 190 }}>
        <View>
          <LinearGradient colors={[`${artist.tint}66`, 'transparent']} style={StyleSheet.absoluteFill} />
          <View style={styles.headerRow}>
            <IconButton icon="chevron-left" accessibilityLabel="Go back" useRouterBack />
            <MaterialCommunityIcons
              name={following ? 'heart' : 'heart-outline'}
              size={24}
              color={following ? theme.colors.accent : theme.colors.textPrimary}
              onPress={() => toggleFavoriteArtist(artist.id)}
              accessibilityLabel={following ? `Unfollow ${artist.name}` : `Follow ${artist.name}`}
              style={{ padding: 8 }}
            />
          </View>
          <View style={styles.hero}>
            <Artwork source={artist.artwork} size={140} shape="circle" accessibilityLabel={`${artist.name} artwork`} />
            <Text style={[theme.font('bold'), styles.name, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.large), textAlign: 'center' }]}>
              {artist.name}
            </Text>
            <Text style={[theme.font('regular'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.small), marginTop: 4 }]}>
              {formatListeners(artist.monthlyListeners)}
            </Text>
            <View style={styles.actions}>
              <PrimaryButton
                label="Play"
                icon='play'
                onPress={() => {
                  if (popular[0]) store.playSong(popular[0].id, songIds);
                }}
              />
              <PrimaryButton
                label="Shuffle"
                variant="secondary"
                icon='shuffle-variant'
                onPress={() => {
                  if (!store.shuffleEnabled) store.toggleShuffle();
                  const random = popular[Math.floor(Math.random() * popular.length)];
                  if (random) store.playSong(random.id, songIds);
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 22 }}>
          <Text style={[theme.font('bold'), styles.groupTitle, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium), paddingHorizontal: 16 }]}>
            Popular Songs
          </Text>
          {popular.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} contextSongIds={songIds} showCache />
          ))}
        </View>

        {albums.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Shelf title="Albums & Singles">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
                {albums.map((a) => (
                  <AlbumCard key={a.id} album={a} width={140} />
                ))}
              </ScrollView>
            </Shelf>
          </View>
        ) : null}

        {related.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Shelf title="Related Artists">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {related.map((r) => (
                  <ArtistCard key={r.id} artist={r} width={104} />
                ))}
              </ScrollView>
            </Shelf>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 8 },
  hero: { alignItems: 'center', paddingTop: 6, paddingBottom: 8, paddingHorizontal: 24 },
  name: { marginTop: 14 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  groupTitle: { marginBottom: 10 },
});
