import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import type { Artist } from '@/types';

interface Props {
  artist: Artist;
  width?: number;
}

export function ArtistCard({ artist, width = 120 }: Props) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Open artist ${artist.name}`}
      onPress={() => router.push(`/artist/${artist.id}` as never)}
      style={({ pressed }) => [{ width, alignItems: 'center', opacity: pressed ? 0.8 : 1 }]}
    >
      <Artwork source={artist.artwork} size={width} shape="circle" accessibilityLabel={`${artist.name} artwork`} />
      <Text numberOfLines={1} style={[theme.font('semibold'), styles.name, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>
        {artist.name}
      </Text>
      <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
        Artist
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  name: { marginTop: 8, textAlign: 'center' },
});
