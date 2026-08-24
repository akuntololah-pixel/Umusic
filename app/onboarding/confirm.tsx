import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { ArtistCard } from '@/components/music/ArtistCard';
import { ARTIST_BY_ID } from '@/data/mock/artists';
import { useSettingsStore } from '@/stores/settingsStore';

export default function ConfirmScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selected = useSettingsStore((s) => s.selectedArtistIds);
  const complete = useSettingsStore((s) => s.completeOnboarding);
  const artists = selected.map((id) => ARTIST_BY_ID.get(id)).filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <AppHeader title="Confirm your picks" showBack />
      <Text style={[theme.font('regular'), styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body), paddingHorizontal: 16 }]}>
        Your home feed will be shaped around {artists.length} artist{artists.length === 1 ? '' : 's'}. You can change this anytime in Settings.
      </Text>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} width={104} />
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="Start Listening"
          onPress={() => {
            complete(selected);
            router.replace('/(tabs)/home');
          }}
          style={{ width: 240 }}
        />
        <SecondaryButton label="Go back" onPress={() => router.back()} style={{ width: 240, marginTop: 10 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  subtitle: { marginTop: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 150,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
});
