import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { CacheIndicator } from './CacheIndicator';
import { useCacheStore } from '@/stores/cacheStore';
import { usePlayerStore } from '@/stores/playerStore';
import { formatMs } from '@/utils/format';
import type { Song } from '@/types';

interface Props {
  song: Song;
  width?: number;
}

export function SongCard({ song, width = 150 }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const playSong = usePlayerStore((s) => s.playSong);
  const statusFor = useCacheStore((s) => s.statusFor);
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Play ${song.title} by ${song.artistName}`}
      onPress={() => playSong(song.id)}
      onLongPress={() => router.push(`/album/${song.albumId}` as never)}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.8 : 1 }]}
    >
      <Artwork source={song.artwork} size={width} accessibilityLabel={`${song.albumTitle} artwork`} />
      <Text numberOfLines={1} style={[theme.font('semibold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>
        {song.title}
      </Text>
      <View style={styles.sub}>
        <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), flexShrink: 1 }]}>
          {song.artistName}
        </Text>
        <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
          {formatMs(song.durationMs)}
        </Text>
      </View>
      {statusFor(song.id) !== 'NOT_CACHED' ? (
        <View style={styles.cache}>
          <CacheIndicator status={statusFor(song.id)} size={11} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  cache: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: 4 },
});
