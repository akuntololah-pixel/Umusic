import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { useSongById } from '@/hooks';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useCacheStore } from '@/stores/cacheStore';
import { useUiStore } from '@/stores/uiStore';
import type { AppTheme } from '@/theme';

interface RowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  theme: AppTheme;
}

function SheetActionRow({ icon, label, onPress, danger, theme }: RowProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <MaterialCommunityIcons name={icon} size={22} color={danger ? theme.colors.error : theme.colors.textPrimary} />
      <Text style={[theme.font('medium'), { color: danger ? theme.colors.error : theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SongSheet({ songId }: { songId: string }) {
  const theme = useTheme();
  const router = useRouter();
  const song = useSongById(songId);
  const playSong = usePlayerStore((s) => s.playSong);
  const playNextInQueue = usePlayerStore((s) => s.playNextInQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const playlists = useLibraryStore((s) => s.playlists);
  const addToPlaylist = useLibraryStore((s) => s.addToPlaylist);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const statusFor = useCacheStore((s) => s.statusFor);
  const cacheSong = useCacheStore((s) => s.cacheSong);
  const removeCached = useCacheStore((s) => s.removeCached);
  const keepOffline = useCacheStore((s) => s.keepOffline);
  const removeOffline = useCacheStore((s) => s.removeOffline);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const [addToOpen, setAddToOpen] = useState(false);

  if (!song) return null;
  const fav = favorites.includes(song.id);
  const status = statusFor(song.id);
  const isOffline = status === 'OFFLINE';
  const row = (icon: keyof typeof MaterialCommunityIcons.glyphMap, label: string, onPress: () => void, danger?: boolean) => (
    <SheetActionRow icon={icon} label={label} onPress={onPress} danger={danger} theme={theme} />
  );

  return (
    <View>
      <View style={styles.songRow}>
        <Artwork source={song.artwork} size={48} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>
            {song.title}
          </Text>
          <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
            {song.artistName} · {song.albumTitle}
          </Text>
        </View>
      </View>

      {!addToOpen ? (
        <React.Fragment>
          {row('play-circle-outline', 'Play', () => { playSong(song.id); closeSheet(); })}
          {row('playlist-play', 'Play next', () => { playNextInQueue(song.id); closeSheet(); })}
          {row('playlist-plus', 'Add to queue', () => { addToQueue(song.id); closeSheet(); })}
          {row(
            fav ? 'heart' : 'heart-outline',
            fav ? 'Remove from favorites' : 'Add to favorites',
            () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined); toggleFavorite(song.id); }
          )}
          {row('album', 'Go to album', () => { closeSheet(); router.push(`/album/${song.albumId}` as never); })}
          {row('account-music', 'Go to artist', () => { closeSheet(); router.push(`/artist/${song.artistId}` as never); })}
          {row('playlist-music', 'Add to playlist', () => setAddToOpen(true))}
          {isOffline
            ? row('close-circle-outline', 'Remove from offline', () => { removeOffline(song.id); closeSheet(); })
            : row('download-outline', 'Keep offline', () => { keepOffline(song.id); closeSheet(); })}
          {status === 'CACHED' || isOffline
            ? row('delete-outline', 'Remove from cache', () => { removeCached(song.id); closeSheet(); }, true)
            : row('arrow-down-circle', 'Cache audio', () => { cacheSong(song.id); closeSheet(); })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {row('arrow-left', 'Back', () => setAddToOpen(false))}
          {row('plus-circle-outline', 'New playlist', () => {
            const id = createPlaylist(`My Playlist ${playlists.length + 1}`);
            addToPlaylist(id, song.id);
            closeSheet();
          })}
          <View style={{ maxHeight: 260 }}>
            {playlists.map((p) => (
              <SheetActionRow
                key={p.id}
                icon="playlist-music-outline"
                label={p.title}
                theme={theme}
                onPress={() => {
                  addToPlaylist(p.id, song.id);
                  closeSheet();
                }}
              />
            ))}
          </View>
        </React.Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  songRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 13 },
});
