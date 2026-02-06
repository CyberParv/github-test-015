import React from 'react';
import { render, screen } from '@testing-library/react';

import Card from '@/components/ui/Card';

describe('UI <Card />', () => {
  test('renders children content', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  test('can render as a semantic region when role provided', () => {
    render(
      <Card role="region" aria-label="Product card">
        Product
      </Card>
    );

    expect(screen.getByRole('region', { name: 'Product card' })).toBeInTheDocument();
  });
});
