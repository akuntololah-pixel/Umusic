import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { ArtistSelectionCard } from '@/components/onboarding/ArtistSelectionCard';
import { CacheIndicator } from '@/components/music/CacheIndicator';
import { StorageUsage } from '@/components/library/StorageUsage';
import { ARTISTS } from '@/data/mock/artists';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useCacheStore } from '@/stores/cacheStore';

const WithTheme = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

afterEach(() => {
  cleanup();
});

describe('ArtistSelectionCard', () => {
  it('toggles selection', async () => {
    const onToggle = jest.fn();
    const artist = ARTISTS[0];
    const utils = await render(
      <WithTheme>
        <ArtistSelectionCard artist={artist} selected={false} onToggle={onToggle} />
      </WithTheme>
    );
    fireEvent.press(utils.getByText(artist.name));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

describe('CacheIndicator', () => {
  it('shows cached and offline indicators', async () => {
    const utils = await render(
      <WithTheme>
        <React.Fragment>
          <CacheIndicator status="NOT_CACHED" />
          <CacheIndicator status="CACHED" />
          <CacheIndicator status="OFFLINE" />
        </React.Fragment>
      </WithTheme>
    );
    expect(utils.getByLabelText('Cached')).toBeTruthy();
    expect(utils.getByLabelText('Available offline')).toBeTruthy();
  });
});

describe('StorageUsage', () => {
  it('reflects cache size', async () => {
    useCacheStore.setState({
      items: { s01: { songId: 's01', sizeMb: 5, cachedAt: 1, status: 'CACHED' } },
      cacheLimitMb: 100,
    });
    const utils = await render(
      <WithTheme>
        <StorageUsage />
      </WithTheme>
    );
    expect(utils.getByLabelText('Storage: 5 MB used of 100 MB')).toBeTruthy();
  });
});
