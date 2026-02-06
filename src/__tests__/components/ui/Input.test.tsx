import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input from '@/components/ui/Input';

describe('UI <Input />', () => {
  test('renders with accessible label via aria-label', () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('accepts typing and triggers onChange', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    expect(onChange).toHaveBeenCalled();
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Jane');
  });

  test('supports error state (aria-invalid) when prop provided', () => {
    render(<Input aria-label="Email" aria-invalid={true} />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});
