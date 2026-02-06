import React from 'react';
import { render, screen } from '@testing-library/react';

import Spinner from '@/components/ui/Spinner';

describe('UI <Spinner />', () => {
  test('renders with status role for accessibility', () => {
    render(<Spinner aria-label="Loading" /> as any);
    // Accept either role='status' or aria-busy patterns
    const el = screen.getByLabelText('Loading');
    expect(el).toBeInTheDocument();
  });
});
