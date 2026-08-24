import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { CacheIndicator } from './CacheIndicator';
import { useCacheStore } from '@/stores/cacheStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { formatMs } from '@/utils/format';
import type { Song } from '@/types';

interface Props {
  song: Song;
  index?: number;
  showCache?: boolean;
  contextSongIds?: string[];
  onRemove?: () => void;
  dragHandle?: React.ReactNode;
}

export function SongRow({ song, index, showCache, contextSongIds, onRemove, dragHandle }: Props) {
  const theme = useTheme();
  const currentId = usePlayerStore((s) => s.currentSongId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playSong = usePlayerStore((s) => s.playSong);
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const openSongSheet = useUiStore((s) => s.openSongSheet);
  const statusFor = useCacheStore((s) => s.statusFor);
  const isCurrent = currentId === song.id;
  const fav = favorites.includes(song.id);

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Play ${song.title} by ${song.artistName}`}
      onPress={() => playSong(song.id, contextSongIds ?? [song.id])}
      onLongPress={() => openSongSheet(song.id)}
      style={({ pressed }) => [
        styles.row,
        { paddingHorizontal: theme.spacing.lg, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      {dragHandle ?? (index !== undefined ? (
        <Text style={[theme.font('semibold'), styles.index, { color: isCurrent ? theme.colors.accent : theme.colors.textMuted, fontSize: theme.fs(theme.type.small), width: 22 }]}>
          {index + 1}
        </Text>
      ) : null)}
      <Artwork source={song.artwork} size={48} accessibilityLabel={`${song.albumTitle} artwork`} />
      <View style={styles.meta}>
        <Text
          numberOfLines={1}
          style={[theme.font(isCurrent ? 'bold' : 'medium'), { color: isCurrent ? theme.colors.accent : theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}
        >
          {song.title}
        </Text>
        <View style={styles.subRow}>
          <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small), flexShrink: 1 }]}>
            {isPlaying && isCurrent ? 'Now playing · ' : ''}
            {song.artistName}
          </Text>
          {showCache ? (
            <View style={{ marginLeft: 6 }}>
              <CacheIndicator status={statusFor(song.id)} size={12} />
            </View>
          ) : null}
        </View>
      </View>
      {onRemove ? (
        <IconButtonLike icon="close" label={`Remove ${song.title}`} onPress={onRemove} />
      ) : (
        <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
          {formatMs(song.durationMs)}
        </Text>
      )}
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={fav ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
        onPress={() => toggleFavorite(song.id)}
        hitSlop={10}
        style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}
      >
        <MaterialCommunityIcons
          name={fav ? 'heart' : 'heart-outline'}
          size={20}
          color={fav ? theme.colors.accent : theme.colors.textMuted}
        />
      </Pressable>
      {onRemove ? null : (
        <IconButtonLike icon="dots-vertical" label={`More options for ${song.title}`} onPress={() => openSongSheet(song.id)} />
      )}
    </Pressable>
  );
}

function IconButtonLike({ icon, label, onPress }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}
    >
      <MaterialCommunityIcons name={icon} size={20} color="#63636E" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  meta: { flex: 1, gap: 2 },
  subRow: { flexDirection: 'row', alignItems: 'center' },
  index: { textAlign: 'center' },
});
