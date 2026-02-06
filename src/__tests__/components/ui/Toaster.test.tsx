import React from 'react';
import { render, screen } from '@testing-library/react';

import Toaster from '@/components/ui/Toaster';

describe('UI <Toaster />', () => {
  test('renders container (region/status) for announcements', () => {
    render(<Toaster />);

    // Many toaster libs render a region; be flexible.
    const region = screen.queryByRole('region') || screen.queryByRole('status');
    expect(region ?? screen.getByTestId?.('toaster')).toBeTruthy();
  });
});
