import { useCallback, useEffect, useState } from 'react';
import { mockMusicProvider } from '@/services/providers/mockMusicProvider';
import type { FeedSection } from '@/types';

interface HomeFeedState {
  sections: FeedSection[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useHomeFeed(selectedArtistIds: string[]): HomeFeedState {
  const [sections, setSections] = useState<FeedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const key = selectedArtistIds.join(',');

  const reload = useCallback(() => {
    setNonce((n) => n + 1);
    setError(null);
    setLoading(true);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    mockMusicProvider
      .getHome(selectedArtistIds)
      .then((feed) => {
        if (active) {
          setSections(feed.sections);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError('Could not load your feed');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  return { sections, loading, error, reload };
}
