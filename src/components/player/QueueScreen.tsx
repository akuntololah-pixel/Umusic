import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState } from '@/components/common/States';
import { usePlayerStore } from '@/stores/playerStore';
import { useSongById } from '@/hooks';
import { SONG_BY_ID } from '@/data/mock/songs';

export function QueueScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const store = usePlayerStore();

  const current = useSongById(currentIndex >= 0 ? queue[currentIndex]?.songId ?? null : null);
  const upNext = queue
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== currentIndex)
    .map(({ item }) => ({ song: SONG_BY_ID.get(item.songId), songId: item.songId }))
    .filter((x): x is { song: NonNullable<ReturnType<typeof SONG_BY_ID.get>>; songId: string } => Boolean(x.song));

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top + 6 }]}>
      <AppHeader title="Queue" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {current ? (
          <React.Fragment>
            <Text style={[theme.font('bold'), styles.label, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1.2, paddingHorizontal: 16 }]}>
              NOW PLAYING
            </Text>
            <SongRow song={current} contextSongIds={[current.id]} />
          </React.Fragment>
        ) : (
          <EmptyState title="Nothing playing" message="Play a song to build your queue." icon="music-off" />
        )}

        {upNext.length > 0 ? (
          <React.Fragment>
            <View style={styles.nextHead}>
              <Text style={[theme.font('bold'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1.2 }]}>
                UP NEXT
              </Text>
              <MaterialCommunityIcons
                name="shuffle-variant"
                size={20}
                color={theme.colors.textSecondary}
                onPress={store.toggleShuffle}
                accessibilityLabel="Toggle shuffle"
                style={{ padding: 4 }}
              />
            </View>
            {upNext.map(({ song, songId }, i) => (
              <SongRow
                key={`${songId}-${i}`}
                song={song}
                contextSongIds={queue.map((q) => q.songId)}
                onRemove={() => store.removeFromQueue(queue.findIndex((q) => q.songId === songId))}
              />
            ))}
          </React.Fragment>
        ) : current ? (
          <Text style={[theme.font('regular'), styles.emptyNext, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
            Queue is empty. Add songs from any song menu.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  label: { marginTop: 14, marginBottom: 4 },
  nextHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 18, marginBottom: 4 },
  emptyNext: { paddingHorizontal: 16, marginTop: 10 },
});
