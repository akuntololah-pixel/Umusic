import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { ACCENT_PRESETS } from '@/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useCacheStore, CACHE_LIMIT_OPTIONS } from '@/stores/cacheStore';
import { StorageUsage } from '@/components/library/StorageUsage';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { formatMb } from '@/utils/format';
import type { DisplaySize, NavStyle, PlaybackMode, ThemeMode } from '@/types';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

const SIZE_OPTIONS: { value: DisplaySize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

const NAV_OPTIONS: { value: NavStyle; label: string }[] = [
  { value: 'bottom', label: 'Bottom Bar' },
  { value: 'sidebar', label: 'Sidebar' },
];

const LIMIT_LABELS: Record<number, string> = {
  100: '100 MB',
  500: '500 MB',
  1024: '1 GB',
  2048: '2 GB',
  0: 'Unlimited',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[theme.font('bold'), styles.sectionTitle, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small), letterSpacing: 1.1 }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg }]}>{children}</View>
    </View>
  );
}

function Row({
  label,
  right,
  icon,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  right?: React.ReactNode;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessible
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed && onPress ? 0.6 : 1 }]}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={22} color={theme.colors.textSecondary} /> : null}
      <Text style={[theme.font('medium'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body), flex: 1 }]}>{label}</Text>
      {right}
    </Pressable>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  accessibilityLabel: string;
}) {
  const theme = useTheme();
  return (
    <View accessible accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} style={styles.segmentWrap}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessible
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              {
                backgroundColor: active ? theme.colors.accent : theme.colors.surfacePressed,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <Text style={[theme.font('semibold'), { color: active ? theme.colors.onAccent : theme.colors.textSecondary, fontSize: theme.fs(theme.type.small) }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const settings = useSettingsStore();
  const cache = useCacheStore();
  const clearHistory = useLibraryStore((s) => s.clearHistory);
  const historyCount = useLibraryStore((s) => s.history.length);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
        <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.hero), paddingHorizontal: 16 }]}>Settings</Text>

        <Section title="Appearance">
          <Row label="Theme" accessibilityLabel="Theme mode" right={<Segmented options={THEME_OPTIONS} value={settings.themeMode} onChange={settings.setThemeMode} accessibilityLabel="Theme" />} />
          <Row label="Navigation Style" right={<Segmented options={NAV_OPTIONS} value={settings.navStyle} onChange={settings.setNavStyle} accessibilityLabel="Navigation style" />} />
          <Row label="Display Size" right={<Segmented options={SIZE_OPTIONS} value={settings.displaySize} onChange={settings.setDisplaySize} accessibilityLabel="Display size" />} />
          <View style={styles.accentBlock}>
            <Text style={[theme.font('medium'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>Accent Color</Text>
            <View accessible accessibilityLabel="Accent color presets" accessibilityRole="radiogroup" style={styles.accentRow}>
              {ACCENT_PRESETS.map((preset) => {
                const active = settings.accentId === preset.id;
                return (
                  <Pressable
                    key={preset.id}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Accent ${preset.label}`}
                    onPress={() => settings.setAccent(preset.id)}
                    style={[
                      styles.accentDot,
                      {
                        backgroundColor: preset.color,
                        borderColor: active ? theme.colors.textPrimary : 'transparent',
                        borderRadius: theme.radius.pill,
                      },
                    ]}
                  >
                    {active ? <MaterialCommunityIcons name="check" size={16} color={theme.colors.onAccent} /> : null}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.customAccentRow}>
              <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>Custom hex:</Text>
              {['#E91E63', '#00BCD4', '#C6FF00', '#FF9100'].map((hex) => (
                <Pressable
                  key={hex}
                  accessible
                  accessibilityRole="radio"
                  accessibilityLabel={`Custom accent ${hex}`}
                  onPress={() => settings.setAccent(hex)}
                  style={[styles.accentDot, styles.customDot, { backgroundColor: hex, borderColor: settings.accentId === hex ? theme.colors.textPrimary : 'transparent', borderRadius: theme.radius.pill }]}
                />
              ))}
            </View>
          </View>
        </Section>

        <Section title="Playback">
          <Row
            label="Autoplay"
            icon="play-circle-outline"
            right={
              <Switch
                accessible
                accessibilityLabel="Autoplay"
                value={settings.autoplay}
                onValueChange={settings.setAutoplay}
                trackColor={{ false: theme.colors.surfacePressed, true: theme.colors.accent }}
              />
            }
          />
          <Row
            label="Default Audio Mode"
            icon="music-circle-outline"
            right={
              <Switch
                accessible
                accessibilityLabel="Default audio mode"
                value={settings.defaultPlaybackMode === 'AUDIO'}
                onValueChange={(on) => settings.setDefaultPlaybackMode((on ? 'AUDIO' : 'VIDEO') as PlaybackMode)}
                trackColor={{ false: theme.colors.surfacePressed, true: theme.colors.accent }}
              />
            }
          />
        </Section>

        <Section title="Storage & Cache">
          <StorageUsage />
          <Row
            label="Auto Cache"
            icon="arrow-down-circle-outline"
            right={
              <Switch
                accessible
                accessibilityLabel="Auto cache"
                value={cache.autoCache}
                onValueChange={cache.setAutoCache}
                trackColor={{ false: theme.colors.surfacePressed, true: theme.colors.accent }}
              />
            }
          />
          <Row
            label="Keep Offline"
            icon="cloud-check-outline"
            right={
              <Switch
                accessible
                accessibilityLabel="Keep offline"
                value={cache.keepOfflineEnabled}
                onValueChange={cache.setKeepOffline}
                trackColor={{ false: theme.colors.surfacePressed, true: theme.colors.accent }}
              />
            }
          />
          <View style={styles.limitBlock}>
            <Text style={[theme.font('medium'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}>Cache Limit</Text>
            <View accessible accessibilityLabel="Cache limit" accessibilityRole="radiogroup" style={styles.accentRow}>
              {CACHE_LIMIT_OPTIONS.map((limit) => {
                const active = cache.cacheLimitMb === limit;
                return (
                  <Pressable
                    key={limit}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Cache limit ${LIMIT_LABELS[limit]}`}
                    onPress={() => cache.setCacheLimit(limit)}
                    style={[
                      styles.limitChip,
                      {
                        backgroundColor: active ? theme.colors.accent : theme.colors.surfacePressed,
                        borderRadius: theme.radius.pill,
                      },
                    ]}
                  >
                    <Text style={[theme.font('semibold'), { color: active ? theme.colors.onAccent : theme.colors.textSecondary, fontSize: theme.fs(theme.type.tiny) }]}>
                      {LIMIT_LABELS[limit]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.buttonRow}>
            <SecondaryButton label="Clear Audio Cache" onPress={cache.clearAudioCache} />
            <SecondaryButton label="Clear All Cache" onPress={cache.clearAllCache} />
          </View>
        </Section>

        <Section title="Library">
          <Row
            label="Clear History"
            icon="delete-sweep-outline"
            accessibilityLabel={`Clear history, ${historyCount} items`}
            onPress={clearHistory}
            right={<MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textMuted} />}
          />
        </Section>

        <Section title="Music Preferences">
          <Row label="Favorite Artists" icon="account-music" onPress={() => router.push('/settings/favorite-artists')} right={<MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.textMuted} />} />
          <View style={styles.resetWrap}>
            <PrimaryButton
              label="Reset Music Preferences"
              onPress={() => {
                settings.resetMusicPreferences();
                router.replace('/onboarding');
              }}
            />
          </View>
        </Section>

        <Section title="About">
          <Row label="Umusic" icon="music-note-outline" right={<Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>Version 1.0.0</Text>} />
          <Row label="Credits" icon="information-outline" right={<Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>Zero-server foundation</Text>} />
        </Section>

        <Text style={[theme.font('regular'), styles.offlineHint, { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>
          Storage used: {formatMb(cache.totalSizeMb())} · {cache.cachedCount()} cached songs
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  section: { marginTop: 22, paddingHorizontal: 16 },
  sectionTitle: { marginBottom: 8, paddingHorizontal: 4 },
  card: { overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, flexWrap: 'wrap' },
  segmentWrap: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  segment: { paddingHorizontal: 14, height: 32, alignItems: 'center', justifyContent: 'center' },
  accentBlock: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  accentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  accentDot: { width: 30, height: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  customAccentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customDot: { width: 24, height: 24 },
  limitBlock: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  limitChip: { paddingHorizontal: 14, height: 30, alignItems: 'center', justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', paddingVertical: 14, flexWrap: 'wrap' },
  resetWrap: { paddingVertical: 12 },
  offlineHint: { textAlign: 'center', marginTop: 8 },
});
