import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { PlayerControls } from '@/components/player/PlayerControls';
import { ThemeProvider } from '@/theme/ThemeProvider';

const WithTheme = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

afterEach(() => {
  cleanup();
});

describe('PlayerControls', () => {
  it('fires control callbacks', async () => {
    const onTogglePlay = jest.fn();
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    const utils = await render(
      <WithTheme>
        <PlayerControls
          isPlaying={false}
          shuffle={false}
          repeatMode="off"
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          onPrevious={onPrevious}
          onToggleShuffle={jest.fn()}
          onCycleRepeat={jest.fn()}
          size="normal"
        />
      </WithTheme>
    );
    fireEvent.press(utils.getByLabelText('Play'));
    fireEvent.press(utils.getByLabelText('Next track'));
    fireEvent.press(utils.getByLabelText('Previous track'));
    expect(onTogglePlay).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
    expect(onPrevious).toHaveBeenCalled();
  });
});

