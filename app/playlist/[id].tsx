import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState, LoadingSkeleton } from '@/components/common/States';
import { IconButton } from '@/components/common/IconButton';
import { PrimaryButton } from '@/components/common/Buttons';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { useLoadable } from '@/hooks/useLoadable';
import { mockMusicProvider } from '@/services/providers/mockMusicProvider';
import { SONG_BY_ID } from '@/data/mock/songs';
import { useLibraryStore } from '@/stores/libraryStore';
import type { Playlist } from '@/types';

export default function PlaylistScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = usePlayerStore();
  const openPlaylistSheet = useUiStore((s) => s.openPlaylistSheet);
  const userPlaylists = useLibraryStore((s) => s.playlists);
  const { data: editorial, loading } = useLoadable<Playlist>(() => mockMusicProvider.getPlaylist(id), [id]);
  const playlist = editorial ?? userPlaylists.find((p) => p.id === id) ?? null;

  if (loading && !playlist) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: 60 }]}>
        <LoadingSkeleton rows={5} />
      </View>
    );
  }
  if (!playlist) {
    return (
      <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
        <EmptyState title="Playlist not found" message="This playlist does not exist." />
      </View>
    );
  }

  const songs = playlist.songIds
    .map((songId) => SONG_BY_ID.get(songId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const totalMin = Math.round(songs.reduce((sum, s) => sum + s.durationMs, 0) / 60000);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 190 }}>
        <View>
          <LinearGradient colors={[`${playlist.tint}66`, 'transparent']} style={StyleSheet.absoluteFill} />
          <View style={styles.headerRow}>
            <IconButton icon="chevron-left" accessibilityLabel="Go back" useRouterBack />
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={theme.colors.textPrimary}
              accessibilityLabel="Playlist options"
              onPress={() => openPlaylistSheet(playlist.id)}
              style={{ padding: 8 }}
            />
          </View>
          <View style={styles.hero}>
            <Artwork source={playlist.artwork} size={180} accessibilityLabel={`${playlist.title} artwork`} />
            <Text style={[theme.font('bold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.large), textAlign: 'center' }]}>
              {playlist.title}
            </Text>
            <Text style={[theme.font('regular'), styles.desc, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.small), textAlign: 'center' }]}>
              {playlist.description}
            </Text>
            <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), marginTop: 6 }]}>
              {playlist.curator} · {songs.length} songs · {totalMin} min
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
              {playlist.isUserPlaylist ? (
                <PrimaryButton
                  label="Edit"
                  variant="secondary"
                  onPress={() => router.push({ pathname: '/playlist-editor', params: { id: playlist.id } } as never)}
                />
              ) : null}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 16 }}>
          {songs.length === 0 ? (
            <EmptyState title="This playlist is empty" message="Add songs from the song menu to fill it up." />
          ) : (
            songs.map((s, i) => <SongRow key={s.id} song={s} index={i} contextSongIds={songs.map((x) => x.id)} showCache />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 8 },
  hero: { alignItems: 'center', paddingTop: 6, paddingBottom: 8, paddingHorizontal: 24 },
  title: { marginTop: 16 },
  desc: { marginTop: 6, maxWidth: 320 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center' },
});
