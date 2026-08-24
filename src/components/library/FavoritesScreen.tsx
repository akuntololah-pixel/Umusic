import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState } from '@/components/common/States';
import { useLibraryStore } from '@/stores/libraryStore';
import { SONGS } from '@/data/mock/songs';

export function FavoritesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const favorites = useLibraryStore((s) => s.favorites);
  const favoriteSongs = useMemo(() => SONGS.filter((s) => favorites.includes(s.id)), [favorites]);
  const ids = favoriteSongs.map((s) => s.id);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top + 6 }]}>
      <AppHeader title="Favorites" showBack />
      {favoriteSongs.length === 0 ? (
        <EmptyState title="No favorites yet" message="Tap the heart on any song to add it here." icon="heart-outline" />
      ) : (
        favoriteSongs.map((s, i) => <SongRow key={s.id} song={s} index={i} contextSongIds={ids} showCache />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
