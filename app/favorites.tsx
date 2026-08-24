import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FavoritesScreen } from '@/components/library/FavoritesScreen';

export default function FavoritesRoute() {
  return (
    <View style={styles.fill}>
      <FavoritesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
