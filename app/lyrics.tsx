import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LyricsView } from '@/components/lyrics/LyricsView';

export default function LyricsScreen() {
  return (
    <View style={styles.fill}>
      <LyricsView />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
