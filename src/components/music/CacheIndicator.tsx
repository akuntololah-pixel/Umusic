import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import type { CacheStatus } from '@/types';

interface Props {
  status: CacheStatus;
  size?: number;
  withLabel?: boolean;
}

export function CacheIndicator({ status, size = 14, withLabel }: Props) {
  const theme = useTheme();
  if (status === 'NOT_CACHED' || status === 'CACHING' || status === 'CACHE_FAILED') {
    if (status === 'CACHING') {
      return (
        <View accessible style={styles.row} accessibilityLabel="Caching">
          <MaterialCommunityIcons name="progress-download" size={size} color={theme.colors.textMuted} />
          {withLabel ? <Text style={[styles.label, { color: theme.colors.textMuted }]}>Caching…</Text> : null}
        </View>
      );
    }
    if (status === 'CACHE_FAILED') {
      return (
        <View accessible style={styles.row} accessibilityLabel="Cache failed">
          <MaterialCommunityIcons name="alert-circle-outline" size={size} color={theme.colors.error} />
          {withLabel ? <Text style={[styles.label, { color: theme.colors.error }]}>Failed</Text> : null}
        </View>
      );
    }
    return null;
  }
  const isOffline = status === 'OFFLINE';
  return (
    <View accessible style={styles.row} accessibilityLabel={isOffline ? 'Available offline' : 'Cached'}>
      <MaterialCommunityIcons
        name={isOffline ? 'check-circle' : 'arrow-down-circle'}
        size={size}
        color={isOffline ? theme.colors.success : theme.colors.textMuted}
      />
      {withLabel ? (
        <Text style={[styles.label, { color: isOffline ? theme.colors.success : theme.colors.textMuted }]}>
          {isOffline ? 'Offline' : 'Cached'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 11, fontWeight: '500' },
});
