import React from 'react';
import { BottomSheet } from '@/components/common/BottomSheet';
import { SongSheet } from './SongSheet';
import { PlaylistSheet } from './PlaylistSheet';
import { useUiStore } from '@/stores/uiStore';

export function SheetsHost() {
  const sheet = useUiStore((s) => s.sheet);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const sheetSongId = useUiStore((s) => s.sheetSongId);
  const sheetPlaylistId = useUiStore((s) => s.sheetPlaylistId);

  return (
    <React.Fragment>
      <BottomSheet visible={sheet === 'song'} onClose={closeSheet} accessibilityLabel="Song options">
        {sheetSongId ? <SongSheet songId={sheetSongId} /> : null}
      </BottomSheet>
      <BottomSheet visible={sheet === 'playlist'} onClose={closeSheet} accessibilityLabel="Playlist options">
        {sheetPlaylistId ? <PlaylistSheet playlistId={sheetPlaylistId} /> : null}
      </BottomSheet>
    </React.Fragment>
  );
}
