import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FullPlayer } from '@/components/player/FullPlayer';

export default function PlayerScreen() {
  return (
    <View style={styles.fill}>
      <FullPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
