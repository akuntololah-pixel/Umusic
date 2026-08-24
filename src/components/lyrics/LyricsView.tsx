import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlayerStore } from '@/stores/playerStore';
import { useSongById } from '@/hooks';
import { mockLyricsProvider } from '@/services/providers/mockProviders';
import type { Lyrics } from '@/types';

export function LyricsView() {
  const theme = useTheme();
  const song = useSongById(usePlayerStore((s) => s.currentSongId));
  const progressMs = usePlayerStore((s) => s.progressMs);
  const [lyrics, setLyrics] = React.useState<Lyrics | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const lineLayouts = useRef<number[]>([]);

  React.useEffect(() => {
    let active = true;
    if (song) {
      mockLyricsProvider.getLyrics(song.id).then((l) => {
        if (active) setLyrics(l);
      });
    } else {
      setLyrics(null);
    }
    return () => {
      active = false;
    };
  }, [song]);

  const activeIndex = lyrics?.synced
    ? lyrics.lines.findIndex((line) => progressMs >= line.startMs && progressMs < line.endMs)
    : -1;

  useEffect(() => {
    if (activeIndex >= 0 && lineLayouts.current[activeIndex] !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(lineLayouts.current[activeIndex] - 180, 0), animated: true });
    }
  }, [activeIndex]);

  if (!song) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.colors.background }]}>
        <Text style={[theme.font('medium'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body) }]}>Play a song to see lyrics</Text>
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.font('bold'), styles.header, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.small) }, { paddingHorizontal: 24 }]}>
        {lyrics ? `${song.title} — ${song.artistName}` : `No lyrics available for ${song.title}`}
      </Text>
      {lyrics && lyrics.synced ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 160 }} />
          {lyrics.lines.map((line, i) => {
            const active = i === activeIndex;
            return (
              <View
                key={i}
                onLayout={(e) => {
                  lineLayouts.current[i] = e.nativeEvent.layout.y;
                }}
              >
                <Text
                  accessible
                  accessibilityLabel={`Lyric line ${i + 1}: ${line.text}`}
                  onPress={() => usePlayerStore.getState().seek(line.startMs)}
                  style={[
                    theme.font(active ? 'bold' : 'medium'),
                    styles.line,
                    {
                      color: active ? theme.colors.textPrimary : theme.colors.textMuted,
                      fontSize: theme.fs(active ? theme.type.title : theme.type.medium),
                      opacity: active ? 1 : 0.65,
                    },
                  ]}
                >
                  {line.text}
                </Text>
              </View>
            );
          })}
          <View style={{ height: 260 }} />
        </ScrollView>
      ) : lyrics && lyrics.plainText ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[theme.font('regular'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body), lineHeight: theme.fs(26) }]}>
            {lyrics.plainText}
          </Text>
        </ScrollView>
      ) : (
        <View style={styles.emptyInner}>
          <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.body) }]}>
            This song has no lyrics yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { marginTop: 14, letterSpacing: 0.4 },
  scroll: { paddingHorizontal: 24, paddingBottom: 60 },
  line: { textAlign: 'center', lineHeight: 40, paddingVertical: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyInner: { flex: 1, alignItems: 'center', paddingTop: 80 },
});
