import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { FilterChips } from '@/components/common/FilterChips';
import { EmptyState, LoadingSkeleton } from '@/components/common/States';
import { ThemeProvider } from '@/theme/ThemeProvider';

const WithTheme = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

afterEach(() => {
  cleanup();
});

describe('FilterChips', () => {
  it('renders options and calls onSelect', async () => {
    const onSelect = jest.fn();
    const utils = await render(
      <WithTheme>
        <FilterChips options={['All', 'Songs']} selected="All" onSelect={onSelect} />
      </WithTheme>
    );
    fireEvent.press(utils.getByLabelText('Songs'));
    expect(onSelect).toHaveBeenCalledWith('Songs');
  });
});

describe('States', () => {
  it('renders empty state with action', async () => {
    const onAction = jest.fn();
    const utils = await render(
      <WithTheme>
        <EmptyState title="Nothing here" message="Try adding songs" actionLabel="Add" onAction={onAction} />
      </WithTheme>
    );
    expect(utils.getByText('Nothing here')).toBeTruthy();
    fireEvent.press(utils.getByText('Add'));
    expect(onAction).toHaveBeenCalled();
  });

  it('renders loading skeleton', async () => {
    const utils = await render(
      <WithTheme>
        <LoadingSkeleton rows={3} />
      </WithTheme>
    );
    expect(utils.getByLabelText('Loading')).toBeTruthy();
  });
});

