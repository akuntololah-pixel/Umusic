import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { PrimaryButton } from '@/components/common/Buttons';
import { ArtistSelectionCard } from '@/components/onboarding/ArtistSelectionCard';
import { ARTISTS, ONBOARDING_ARTISTS } from '@/data/mock/artists';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRouter } from 'expo-router';

const MIN_ARTISTS = 3;
const MAX_ARTISTS = 15;

export default function ArtistSelectionScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selected = useSettingsStore((s) => s.selectedArtistIds);
  const toggleSelected = useSettingsStore((s) => s.toggleSelectedArtist);
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ONBOARDING_ARTISTS;
    return ARTISTS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  const count = selected.length;
  const canContinue = count >= MIN_ARTISTS;
  const atMax = count >= MAX_ARTISTS;

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <AppHeader title="Pick your favorites" showBack />
      <Text style={[theme.font('regular'), styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body), paddingHorizontal: 16 }]}>
        Choose at least {MIN_ARTISTS} artists to personalize your feed.
      </Text>
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search artists" accessibilityLabel="Search artists" />
      </View>

      <View accessible accessibilityLabel={`${count} artists selected`} style={styles.countRow}>
        <Text style={[theme.font('semibold'), { color: canContinue ? theme.colors.accent : theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
          {count} artist{count === 1 ? '' : 's'} selected
          {atMax ? ' (max)' : ''}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {list.map((artist) => (
          <ArtistSelectionCard
            key={artist.id}
            artist={artist}
            selected={selected.includes(artist.id)}
            disabled={atMax}
            onToggle={() => toggleSelected(artist.id, MAX_ARTISTS)}
          />
        ))}
        {list.length === 0 ? (
          <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.body), padding: 24 }]}>
            No artists match &quot;{query}&quot;.
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton label="Continue" disabled={!canContinue} onPress={() => router.push('/onboarding/confirm')} style={{ width: 240 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  subtitle: { marginTop: 2, marginBottom: 4 },
  countRow: { paddingHorizontal: 16, paddingVertical: 10 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 120,
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
});
