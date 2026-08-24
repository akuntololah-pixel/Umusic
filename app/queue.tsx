import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QueueScreen } from '@/components/player/QueueScreen';

export default function QueueRoute() {
  return (
    <View style={styles.fill}>
      <QueueScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
