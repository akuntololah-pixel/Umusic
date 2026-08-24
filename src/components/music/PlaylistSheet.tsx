import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import type { AppTheme } from '@/theme';
import { Artwork } from '@/components/common/Artwork';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { PLAYLIST_BY_ID } from '@/data/mock/playlists';
import { useLibraryStore } from '@/stores/libraryStore';

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

export function PlaylistSheet({ playlistId }: { playlistId: string }) {
  const theme = useTheme();
  const router = useRouter();
  const togglePlayShuffle = usePlayerStore((s) => s.toggleShuffle);
  const playSong = usePlayerStore((s) => s.playSong);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const editorial = PLAYLIST_BY_ID.get(playlistId);
  const userPlaylists = useLibraryStore((s) => s.playlists);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const userPlaylist = userPlaylists.find((p) => p.id === playlistId);
  const playlist = editorial ?? userPlaylist;

  if (!playlist) return null;

  const play = (shuffle: boolean) => {
    if (shuffle) togglePlayShuffle();
    const first = playlist.songIds[0];
    if (first) playSong(first, playlist.songIds);
    closeSheet();
  };

  const row = (icon: keyof typeof MaterialCommunityIcons.glyphMap, label: string, onPress: () => void, danger?: boolean) => (
    <SheetActionRow icon={icon} label={label} onPress={onPress} danger={danger} theme={theme} />
  );

  return (
    <View>
      <View style={styles.songRow}>
        <Artwork source={playlist.artwork} size={48} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>
            {playlist.title}
          </Text>
          <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
            {playlist.songIds.length} songs · {playlist.curator}
          </Text>
        </View>
      </View>
      {row('play-circle-outline', 'Play', () => play(false))}
      {row('shuffle-variant', 'Shuffle play', () => play(true))}
      {userPlaylist ? (
        <React.Fragment>
          {row('pencil-outline', 'Edit playlist', () => {
            closeSheet();
            router.push({ pathname: '/playlist-editor', params: { id: playlist.id } } as never);
          })}
          {row('delete-outline', 'Delete playlist', () => {
            deletePlaylist(playlist.id);
            closeSheet();
          }, true)}
        </React.Fragment>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  songRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 13 },
});
