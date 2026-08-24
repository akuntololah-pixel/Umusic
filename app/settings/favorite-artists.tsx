import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FavoriteArtistsScreen } from '@/components/library/FavoriteArtistsScreen';

export default function FavoriteArtistsRoute() {
  return (
    <View style={styles.fill}>
      <FavoriteArtistsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
