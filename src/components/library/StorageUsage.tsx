import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useCacheStore } from '@/stores/cacheStore';
import { formatMb } from '@/utils/format';

export function StorageUsage() {
  const theme = useTheme();
  const totalSize = useCacheStore((s) => s.items);
  const limit = useCacheStore((s) => s.cacheLimitMb);
  const used = Object.values(totalSize)
    .filter((x) => x.status === 'CACHED')
    .reduce((sum, x) => sum + x.sizeMb, 0);
  const count = Object.values(totalSize).filter((x) => x.status === 'CACHED').length;
  const limitMb = limit === 0 ? 4096 : limit;
  const ratio = Math.min(used / limitMb, 1);
  const available = Math.max(limitMb - used, 0);

  return (
    <View accessible accessibilityLabel={`Storage: ${formatMb(used)} used of ${limit === 0 ? 'unlimited' : formatMb(limit)}`} style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={[theme.font('medium'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>Storage</Text>
        <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
          {count} cached · {formatMb(used)} used · {limit === 0 ? 'unlimited' : `${formatMb(available)} available`}
        </Text>
      </View>
      <View style={[styles.bar, { backgroundColor: theme.colors.surfacePressed, borderRadius: theme.radius.pill }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(ratio * 100, used > 0 ? 4 : 0)}%`,
              backgroundColor: theme.colors.accent,
              borderRadius: theme.radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  headerRow: { gap: 4 },
  bar: { height: 8, overflow: 'hidden' },
  fill: { height: '100%' },
});
