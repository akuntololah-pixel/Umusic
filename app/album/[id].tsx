import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState, LoadingSkeleton } from '@/components/common/States';
import { IconButton } from '@/components/common/IconButton';
import { PrimaryButton } from '@/components/common/Buttons';
import { usePlayerStore } from '@/stores/playerStore';
import { useLoadable } from '@/hooks/useLoadable';
import { mockMusicProvider } from '@/services/providers/mockMusicProvider';
import { SONG_BY_ID } from '@/data/mock/songs';
import type { Album } from '@/types';

export default function AlbumScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = usePlayerStore();
  const { data: album, loading } = useLoadable<Album>(() => mockMusicProvider.getAlbum(id), [id]);

  if (loading) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: 60 }]}>
        <LoadingSkeleton rows={5} />
      </View>
    );
  }
  if (!album) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
        <EmptyState title="Album not found" message="This album does not exist in the catalog." />
      </View>
    );
  }

  const songs = album.songIds
    .map((songId) => SONG_BY_ID.get(songId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 190 }}>
        <View>
          <LinearGradient colors={[`${album.tint}66`, 'transparent']} style={StyleSheet.absoluteFill} />
          <View style={styles.headerRow}>
            <IconButton icon="chevron-left" accessibilityLabel="Go back" useRouterBack />
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={theme.colors.textPrimary}
              accessibilityLabel="Album options"
              style={{ padding: 8 }}
            />
          </View>
          <View style={styles.hero}>
            <Artwork source={album.artwork} size={190} accessibilityLabel={`${album.title} artwork`} />
            <Text style={[theme.font('bold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.large), textAlign: 'center' }]}>
              {album.title}
            </Text>
            <Text style={[theme.font('regular'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.small), marginTop: 4 }]}>
              {album.artistName} · {album.year} · {songs.length} {album.type === 'single' ? 'single' : 'tracks'}
            </Text>
            <View style={styles.actions}>
              <PrimaryButton
                label="Play"
                icon='play'
                onPress={() => {
                  if (songs[0]) store.playSong(songs[0].id, songs.map((s) => s.id));
                }}
              />
              <PrimaryButton
                label="Shuffle"
                variant="secondary"
                icon='shuffle-variant'
                onPress={() => {
                  if (!store.shuffleEnabled) store.toggleShuffle();
                  const random = songs[Math.floor(Math.random() * songs.length)];
                  if (random) store.playSong(random.id, songs.map((s) => s.id));
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ marginTop: 16 }}>
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} contextSongIds={songs.map((x) => x.id)} showCache />
          ))}
        </View>
        <Text style={[theme.font('regular'), styles.credit, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
          {album.title} · ℗ {album.year} Umusic Mock Records
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 8 },
  hero: { alignItems: 'center', paddingTop: 6, paddingBottom: 8, paddingHorizontal: 24 },
  title: { marginTop: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  credit: { textAlign: 'center', marginTop: 20 },
});
