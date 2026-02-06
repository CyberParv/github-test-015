import React from 'react';
import { render, screen } from '@testing-library/react';

import Badge from '@/components/ui/Badge';

describe('UI <Badge />', () => {
  test('renders text content', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('supports different variants via prop', () => {
    render(<Badge variant="success">Success</Badge> as any);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
