import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HistoryScreen } from '@/components/library/HistoryScreen';

export default function HistoryRoute() {
  return (
    <View style={styles.fill}>
      <HistoryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
