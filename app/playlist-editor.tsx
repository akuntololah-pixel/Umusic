import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlaylistEditorScreen } from '@/components/library/PlaylistEditorScreen';

export default function PlaylistEditorRoute() {
  return (
    <View style={styles.fill}>
      <PlaylistEditorScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
