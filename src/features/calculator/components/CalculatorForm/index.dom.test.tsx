import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import CalculatorForm from '.';

test('should shows validation errors after submission', async () => {
  const user = userEvent.setup();

  render(<CalculatorForm />);

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  expect(screen.queryByText(/operator is required/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/numbers are required/i)).not.toBeInTheDocument();

  await user.click(submitButton);

  expect(screen.queryByText(/operator is required/i)).toBeInTheDocument();
  expect(screen.queryByText(/numbers are required/i)).toBeInTheDocument();
});

test('should show required validation errors', async () => {
  const user = userEvent.setup();

  render(<CalculatorForm />);

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  await user.click(submitButton);

  expect(screen.queryByText(/operator is required/i)).toBeInTheDocument();
  expect(screen.queryByText(/numbers are required/i)).toBeInTheDocument();
});

test('should numbers field has at least two numbers', async () => {
  const user = userEvent.setup();

  render(<CalculatorForm />);

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  const numbersField = screen.getByLabelText(/numbers/i);

  await user.type(numbersField, '10');
  await user.keyboard('{Enter}');
  await user.click(submitButton);

  expect(
    screen.queryByText(/at least two numbers are required/i),
  ).toBeInTheDocument();

  await user.type(numbersField, '10');
  await user.keyboard('{Enter}');

  expect(
    screen.queryByText(/at least two numbers are required/i),
  ).not.toBeInTheDocument();
});

test('should show validation error when operator is divide and numbers has 0 from the second one onwards', async () => {
  const user = userEvent.setup();

  render(<CalculatorForm />);

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  await user.click(
    within(screen.getByLabelText(/operator/i)).getByRole('button', {
      name: /divide/i,
    }),
  );

  await user.type(screen.getByLabelText(/numbers/i), '10');
  await user.keyboard('{Enter}');
  await user.type(screen.getByLabelText(/numbers/i), '0');
  await user.keyboard('{Enter}');
  await user.click(submitButton);

  expect(
    screen.queryByText(/value can not be divided by zero/i),
  ).toBeInTheDocument();
});
