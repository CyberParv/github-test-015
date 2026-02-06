import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@/components/ui/Button';

describe('UI <Button />', () => {
  test('renders with label and is accessible by role', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('handles clicks when enabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button', { name: 'Click' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  test('supports loading state (aria-busy) when prop provided', () => {
    // If your Button uses a different prop name, update this test.
    render(<Button loading>Loading</Button> as any);
    const btn = screen.getByRole('button', { name: 'Loading' });
    expect(btn).toHaveAttribute('aria-busy');
  });
});
