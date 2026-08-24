import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppHeader } from '@/components/common/AppHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { SongRow } from '@/components/music/SongRow';
import { EmptyState } from '@/components/common/States';
import { useLibraryStore } from '@/stores/libraryStore';
import { SONGS, SONG_BY_ID } from '@/data/mock/songs';

export function PlaylistEditorScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const playlists = useLibraryStore((s) => s.playlists);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const addToPlaylist = useLibraryStore((s) => s.addToPlaylist);
  const removeFromPlaylist = useLibraryStore((s) => s.removeFromPlaylist);
  const moveInPlaylist = useLibraryStore((s) => s.moveInPlaylist);

  const existing = params.id ? playlists.find((p) => p.id === params.id) ?? null : null;
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [createdId, setCreatedId] = useState<string | null>(existing?.id ?? null);
  const [query, setQuery] = useState('');

  const playlistId = createdId;
  const playlist = playlistId ? playlists.find((p) => p.id === playlistId) ?? null : null;
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SONGS.slice(0, 8);
    return SONGS.filter((s) => s.title.toLowerCase().includes(q) || s.artistName.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  const ensurePlaylist = (): string | null => {
    if (playlistId) return playlistId;
    if (!title.trim()) return null;
    const id = createPlaylist(title.trim(), description.trim());
    setCreatedId(id);
    return id;
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top + 6 }]}>
      <AppHeader title={existing ? 'Edit Playlist' : 'New Playlist'} showBack />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <Text style={[theme.font('semibold'), styles.fieldLabel, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1 }]}>
          TITLE
        </Text>
        <TextInput
          accessible
          accessibilityLabel="Playlist title"
          value={title}
          onChangeText={setTitle}
          placeholder="Playlist title"
          placeholderTextColor={theme.colors.textMuted}
          style={[theme.font('bold'), styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderRadius: theme.radius.md, borderColor: theme.colors.divider, fontSize: theme.fs(theme.type.medium) }]}
        />
        <Text style={[theme.font('semibold'), styles.fieldLabel, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1 }]}>
          DESCRIPTION
        </Text>
        <TextInput
          accessible
          accessibilityLabel="Playlist description"
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          placeholderTextColor={theme.colors.textMuted}
          multiline
          style={[theme.font('regular'), styles.input, styles.descInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderRadius: theme.radius.md, borderColor: theme.colors.divider, fontSize: theme.fs(theme.type.small) }]}
        />
        {!createdId ? (
          <PrimaryButton label={title.trim() ? 'Create & Add Songs' : 'Enter a title first'} disabled={!title.trim()} onPress={() => ensurePlaylist()} />
        ) : null}
      </View>

      {playlist ? (
        <React.Fragment>
          <View style={styles.sectionHead}>
            <Text style={[theme.font('bold'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1.2 }]}>
              IN THIS PLAYLIST ({playlist.songIds.length})
            </Text>
          </View>
          {playlist.songIds.length === 0 ? (
            <EmptyState title="Empty playlist" message="Search below and add songs." icon="playlist-music-outline" />
          ) : (
            playlist.songIds.map((songId, i) => {
              const song = SONG_BY_ID.get(songId);
              if (!song) return null;
              return (
                <View key={`${songId}-${i}`} style={styles.editRow}>
                  <View style={{ flex: 1 }}>
                    <SongRow song={song} index={i} contextSongIds={playlist.songIds} />
                  </View>
                  <View style={styles.editActions}>
                    <MaterialCommunityIcons
                      name="arrow-up"
                      size={20}
                      color={i === 0 ? theme.colors.textMuted : theme.colors.textSecondary}
                      onPress={i === 0 ? undefined : () => moveInPlaylist(playlist.id, i, i - 1)}
                      accessibilityLabel={`Move ${song.title} up`}
                      style={{ padding: 4 }}
                    />
                    <MaterialCommunityIcons
                      name="arrow-down"
                      size={20}
                      color={i === playlist.songIds.length - 1 ? theme.colors.textMuted : theme.colors.textSecondary}
                      onPress={i === playlist.songIds.length - 1 ? undefined : () => moveInPlaylist(playlist.id, i, i + 1)}
                      accessibilityLabel={`Move ${song.title} down`}
                      style={{ padding: 4 }}
                    />
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={theme.colors.error}
                      onPress={() => removeFromPlaylist(playlist.id, songId)}
                      accessibilityLabel={`Remove ${song.title} from playlist`}
                      style={{ padding: 4 }}
                    />
                  </View>
                </View>
              );
            })
          )}

          <View style={styles.sectionHead}>
            <Text style={[theme.font('bold'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), letterSpacing: 1.2 }]}>
              ADD SONGS
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Search songs to add" accessibilityLabel="Search songs to add" />
          </View>
          {results.map((song) => {
            const inList = playlist.songIds.includes(song.id);
            return (
              <View key={song.id} style={styles.addRow}>
                <View style={{ flex: 1 }}>
                  <SongRow song={song} contextSongIds={results.map((x) => x.id)} />
                </View>
                <Pressable
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={inList ? `${song.title} already in playlist` : `Add ${song.title} to playlist`}
                  onPress={inList ? undefined : () => addToPlaylist(playlist.id, song.id)}
                  style={({ pressed }) => ({ padding: 8, opacity: pressed ? 0.6 : inList ? 0.3 : 1 })}
                >
                  <MaterialCommunityIcons name={inList ? 'check' : 'plus'} size={22} color={theme.colors.accent} />
                </Pressable>
              </View>
            );
          })}
          <SecondaryButton label="Done" onPress={() => router.back()} style={{ marginTop: 18 }} />
        </React.Fragment>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  fieldLabel: { marginTop: 4 },
  input: { padding: 14, borderWidth: 1 },
  descInput: { minHeight: 64, textAlignVertical: 'top' },
  sectionHead: { paddingHorizontal: 16, marginTop: 22, marginBottom: 6 },
  editRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 10 },
  editActions: { alignItems: 'center', gap: 2 },
  addRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
});
