import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { ArtistSelectionCard } from '@/components/onboarding/ArtistSelectionCard';
import { ARTISTS } from '@/data/mock/artists';
import { useSettingsStore } from '@/stores/settingsStore';

export function FavoriteArtistsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const selected = useSettingsStore((s) => s.selectedArtistIds);
  const setSelected = useSettingsStore((s) => s.setSelectedArtists);
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTISTS;
    return ARTISTS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top + 6 }]}>
      <AppHeader title="Favorite Artists" showBack />
      <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search artists" accessibilityLabel="Search favorite artists" />
      </View>
      <View style={styles.grid}>
        {list.map((artist) => (
          <ArtistSelectionCard
            key={artist.id}
            artist={artist}
            selected={selected.includes(artist.id)}
            onToggle={() => {
              if (selected.includes(artist.id)) {
                setSelected(selected.filter((x) => x !== artist.id));
              } else {
                setSelected([...selected, artist.id]);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
