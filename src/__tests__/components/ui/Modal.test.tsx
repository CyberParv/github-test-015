import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal from '@/components/ui/Modal';

describe('UI <Modal />', () => {
  test('does not render content when closed', () => {
    render(
      <Modal open={false} onClose={jest.fn()} title="My modal">
        Content
      </Modal> as any
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('renders dialog when open and is accessible', () => {
    render(
      <Modal open={true} onClose={jest.fn()} title="My modal">
        Content
      </Modal> as any
    );

    expect(screen.getByRole('dialog', { name: 'My modal' })).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('calls onClose on Escape', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Modal open={true} onClose={onClose} title="My modal">
        Content
      </Modal> as any
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
