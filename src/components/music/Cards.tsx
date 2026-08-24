import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import type { Album, Playlist } from '@/types';

interface AlbumProps {
  album: Album;
  width?: number;
}

export function AlbumCard({ album, width = 150 }: AlbumProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Open album ${album.title} by ${album.artistName}`}
      onPress={() => router.push(`/album/${album.id}` as never)}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.8 : 1 }]}
    >
      <Artwork source={album.artwork} size={width} accessibilityLabel={`${album.title} artwork`} />
      <Text numberOfLines={1} style={[theme.font('semibold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>
        {album.title}
      </Text>
      <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
        {album.year} · {album.artistName}
      </Text>
    </Pressable>
  );
}

interface PlaylistProps {
  playlist: Playlist;
  width?: number;
}

export function PlaylistCard({ playlist, width = 150 }: PlaylistProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Open playlist ${playlist.title}`}
      onPress={() => router.push(`/playlist/${playlist.id}` as never)}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.8 : 1 }]}
    >
      <Artwork source={playlist.artwork} size={width} accessibilityLabel={`${playlist.title} artwork`} />
      <Text numberOfLines={1} style={[theme.font('semibold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>
        {playlist.title}
      </Text>
      <Text numberOfLines={2} style={[theme.font('regular'), styles.desc, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
        {playlist.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  desc: { marginTop: 2, lineHeight: 15 },
});
