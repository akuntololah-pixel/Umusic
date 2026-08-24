import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { PrimaryButton, SecondaryButton } from './Buttons';

interface BaseProps {
  title: string;
  message?: string;
}

interface EmptyProps extends BaseProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, icon = 'music-note-off', actionLabel, onAction }: EmptyProps) {
  const theme = useTheme();
  return (
    <View style={styles.center} accessibilityRole="text" accessibilityLabel={`${title}. ${message ?? ''}`}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl }]}>
        <MaterialCommunityIcons name={icon} size={30} color={theme.colors.textMuted} />
      </View>
      <Text style={[theme.font('bold'), styles.title, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium) }]}>
        {title}
      </Text>
      {message ? (
        <Text style={[theme.font('regular'), styles.message, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={{ marginTop: 16 }} />
      ) : null}
    </View>
  );
}

export function ErrorState({ title, message, onRetry }: BaseProps & { onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { borderRadius: 999, backgroundColor: `${theme.colors.error}1F` }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={30} color={theme.colors.error} />
      </View>
      <Text style={[theme.font('bold'), styles.title, { color: theme.colors.textPrimary, fontSize: 17 }]}>{title}</Text>
      {message ? <Text style={[theme.font('regular'), styles.message, { color: theme.colors.textSecondary, fontSize: 13 }]}>{message}</Text> : null}
      {onRetry ? <SecondaryButton label="Try Again" onPress={onRetry} style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

export function OfflineState({ title, message }: BaseProps) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { borderRadius: 999, backgroundColor: `${theme.colors.warning}1F` }]}>
        <MaterialCommunityIcons name="wifi-off" size={30} color={theme.colors.warning} />
      </View>
      <Text style={[theme.font('bold'), styles.title, { color: theme.colors.textPrimary, fontSize: 17 }]}>{title}</Text>
      {message ? <Text style={[theme.font('regular'), styles.message, { color: theme.colors.textSecondary, fontSize: 13 }]}>{message}</Text> : null}
    </View>
  );
}

export function LoadingSkeleton({ rows = 6, circle = false }: { rows?: number; circle?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.skeletonList} accessibilityLabel="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <View
            style={[
              styles.skeletonArt,
              {
                backgroundColor: theme.colors.skeleton,
                borderRadius: circle ? 28 : theme.radius.sm,
              },
            ]}
          />
          <View style={{ flex: 1, gap: 8 }}>
            <View style={[styles.skeletonLine, { backgroundColor: theme.colors.skeleton }]} />
            <View style={[styles.skeletonLine, { backgroundColor: theme.colors.skeleton, width: '55%' }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 32, paddingTop: 64 },
  iconWrap: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { textAlign: 'center' },
  message: { textAlign: 'center', marginTop: 6, lineHeight: 19 },
  skeletonList: { paddingHorizontal: 16, gap: 14 },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skeletonArt: { width: 56, height: 56 },
  skeletonLine: { height: 12, borderRadius: 6, width: '80%' },
});
