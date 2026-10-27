import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import PasswordInput from '.';

test('should hide password by default', async () => {
  render(<PasswordInput aria-label="password" />);

  const input = screen.getByLabelText('password');

  expect(input).toHaveAttribute('type', 'password');
});

test('should show show eye opened icon button when password is hidden', async () => {
  render(<PasswordInput aria-label="password" />);

  expect(screen.queryByRole('button', { name: /show/i })).toBeInTheDocument();
});

test('should show show eye closed icon button when password is hidden', async () => {
  const user = userEvent.setup();
  render(<PasswordInput aria-label="password" />);

  const toggleButton = screen.getByRole('switch', {
    name: /password/i,
    queryFallbacks: true,
  });

  await user.click(toggleButton);

  expect(screen.queryByRole('button', { name: /hide/i })).toBeInTheDocument();
});

test('should toggle password visibility when clicked on button', async () => {
  const user = userEvent.setup();
  render(<PasswordInput aria-label="password" />);

  const input = screen.getByLabelText('password');

  const toggleButton = screen.getByRole('switch', {
    name: /password/i,
    queryFallbacks: true,
  });

  expect(input).toHaveAttribute('type', 'password');

  await user.click(toggleButton);

  expect(input).toHaveAttribute('type', 'text');
});
