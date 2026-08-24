import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState, PrimaryButton } from '@/components/common';
import { useLibraryStore } from '@/stores/libraryStore';
import { SONG_BY_ID } from '@/data/mock/songs';

export function HistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const history = useLibraryStore((s) => s.history);
  const removeHistory = useLibraryStore((s) => s.removeHistory);
  const clearHistory = useLibraryStore((s) => s.clearHistory);

  const entries = history
    .map((h) => ({ ...h, song: SONG_BY_ID.get(h.songId) }))
    .filter((h): h is typeof h & { song: NonNullable<ReturnType<typeof SONG_BY_ID.get>> } => Boolean(h.song));

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top + 6 }]}>
      <AppHeader title="Recently Played" showBack />
      {entries.length === 0 ? (
        <EmptyState title="No history yet" message="Songs you play will show up here." icon="history" />
      ) : (
        <React.Fragment>
          {entries.map(({ song, songId }) => (
            <SongRow key={`${songId}-${history.length}`} song={song} contextSongIds={[songId]} onRemove={() => removeHistory(songId)} showCache />
          ))}
          <PrimaryButton
            label="Clear History"
            variant="secondary"
            onPress={() => {
              Alert.alert('Clear History', 'Remove all recently played songs?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearHistory },
              ]);
            }}
            style={{ marginTop: 20 }}
          />
        </React.Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
