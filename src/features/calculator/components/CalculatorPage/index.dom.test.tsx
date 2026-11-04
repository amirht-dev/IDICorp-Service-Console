import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { env } from '@/lib/env';
import { render, screen, waitFor } from '@/lib/testing-library';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { ws } from 'msw';
import { z } from 'zod/v4';
import CalculatorPage from '.';
import {
  calculatorClientAuthenticateSchema,
  calculatorClientRequestSchema,
  calculatorServerConfirmSchema,
  calculatorServerErrorSchema,
  calculatorServerResponseSchema,
} from '../../schemas';

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

test('should show unauthenticated message when unauthorized', async () => {
  const calc = ws.link(env.VITE_CALCULATOR_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', (e) => {
        if (typeof e.data !== 'string') return;

        return client.send(
          JSON.stringify({ error: 'Unauthorized' } satisfies z.infer<
            typeof calculatorServerErrorSchema
          >),
        );
      });
    }),
  );

  render(<CalculatorPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() =>
    expect(screen.queryByText(/unauthorized/i)).toBeInTheDocument(),
  );
});

test('should show ready when when successfully authorized', async () => {
  const calc = ws.link(env.VITE_CALCULATOR_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', () => {
        client.send(
          JSON.stringify({ type: 'ready' } satisfies z.infer<
            typeof calculatorServerConfirmSchema
          >),
        );
      });
    }),
  );

  render(<CalculatorPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() => expect(screen.queryByText(/ready/i)).toBeInTheDocument());
});

test('should show calculation error when calculation is invalid', async () => {
  const user = userEvent.setup();
  const calc = ws.link(env.VITE_CALCULATOR_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', (e) => {
        if (typeof e.data !== 'string') return;

        let data;
        try {
          data = JSON.parse(e.data);
        } catch (error) {
          console.log('invalid json', error);
        }

        const parsedAuth = calculatorClientAuthenticateSchema.safeParse(data);

        if (parsedAuth.success) {
          return client.send(
            JSON.stringify({ type: 'ready' } satisfies z.infer<
              typeof calculatorServerConfirmSchema
            >),
          );
        }

        const parsedRequest = calculatorClientRequestSchema.safeParse(data);

        if (parsedRequest.success) {
          return client.send(
            JSON.stringify({
              error: 'Invalid calculator request',
            } satisfies z.infer<typeof calculatorServerErrorSchema>),
          );
        }
      });
    }),
  );

  render(<CalculatorPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() => expect(screen.queryByText(/ready/i)).toBeInTheDocument());

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  await user.type(screen.getByLabelText(/numbers/i), '10');
  await user.keyboard('{Enter}');
  await user.type(screen.getByLabelText(/numbers/i), '20');
  await user.keyboard('{Enter}');

  await user.click(submitButton);

  await waitFor(() =>
    expect(screen.getByText(/Invalid calculator request/i)).toBeInTheDocument(),
  );
});

test('should show calculation result', async () => {
  const user = userEvent.setup();
  const calc = ws.link(env.VITE_CALCULATOR_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', (e) => {
        if (typeof e.data !== 'string') return;

        let data;
        try {
          data = JSON.parse(e.data);
        } catch (error) {
          console.log('invalid json', error);
        }

        const parsedAuth = calculatorClientAuthenticateSchema.safeParse(data);

        if (parsedAuth.success) {
          return client.send(
            JSON.stringify({ type: 'ready' } satisfies z.infer<
              typeof calculatorServerConfirmSchema
            >),
          );
        }

        const parsedRequest = calculatorClientRequestSchema.safeParse(data);

        if (parsedRequest.success) {
          return client.send(
            JSON.stringify({
              result: 30,
            } satisfies z.infer<typeof calculatorServerResponseSchema>),
          );
        }
      });
    }),
  );

  render(<CalculatorPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() => expect(screen.queryByText(/ready/i)).toBeInTheDocument());

  const submitButton = screen.getByRole('button', { name: /calculate/i });

  await user.type(screen.getByLabelText(/numbers/i), '10');
  await user.keyboard('{Enter}');
  await user.type(screen.getByLabelText(/numbers/i), '20');
  await user.keyboard('{Enter}');

  await user.click(submitButton);

  await waitFor(() =>
    expect(screen.getByText(/calculation result:/i)).toHaveTextContent('30'),
  );
});
