import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { env } from '@/lib/env';
import { render, screen, waitFor } from '@/lib/testing-library';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { ws } from 'msw';
import type { z } from 'zod/v4';
import EchoPage from '.';
import {
  echoClientAuthenticateSchema,
  echoClientRequestSchema,
  echoServerResponseSchema,
  type echoServerConfirmSchema,
  type echoServerErrorSchema,
} from '../../schemas';

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

test('should show unauthenticated message when unauthorized', async () => {
  const calc = ws.link(env.VITE_ECHO_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', (e) => {
        if (typeof e.data !== 'string') return;

        return client.send(
          JSON.stringify({ error: 'Unauthorized' } satisfies z.infer<
            typeof echoServerErrorSchema
          >),
        );
      });
    }),
  );

  render(<EchoPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() =>
    expect(screen.queryByText(/unauthorized/i)).toBeInTheDocument(),
  );
});

test('should show ready when when successfully authorized', async () => {
  const calc = ws.link(env.VITE_ECHO_WS_URL);

  server.use(
    calc.addEventListener('connection', ({ client }) => {
      client.addEventListener('message', () => {
        return client.send(
          JSON.stringify({ type: 'ready' } satisfies z.infer<
            typeof echoServerConfirmSchema
          >),
        );
      });
    }),
  );

  render(<EchoPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() => expect(screen.queryByText(/ready/i)).toBeInTheDocument());
});

test('should show echo message in messages list', async () => {
  const calc = ws.link(env.VITE_ECHO_WS_URL);
  const user = userEvent.setup();

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

        const parsedAuth = echoClientAuthenticateSchema.safeParse(data);
        if (parsedAuth.success) {
          return client.send(
            JSON.stringify({ type: 'ready' } satisfies z.infer<
              typeof echoServerConfirmSchema
            >),
          );
        }

        const parsedRequest = echoClientRequestSchema.safeParse(data);
        if (parsedRequest.success) {
          return client.send(
            JSON.stringify({
              message: parsedRequest.data.message,
            } satisfies z.infer<typeof echoServerResponseSchema>),
          );
        }
      });
    }),
  );

  render(<EchoPage />);

  await waitFor(() =>
    expect(screen.queryByText(/connected/i)).toBeInTheDocument(),
  );

  await waitFor(() => expect(screen.queryByText(/ready/i)).toBeInTheDocument());

  const messageInput = screen.getByPlaceholderText(/type your message/i);
  expect(messageInput).toBeEnabled();

  const message = 'hello world';

  await user.type(messageInput, message);

  const sendButton = screen.getByRole('button', { name: /send/i });
  expect(sendButton).toBeEnabled();

  await user.click(sendButton);

  await waitFor(() => expect(screen.queryAllByText(message)).toHaveLength(2));
});
