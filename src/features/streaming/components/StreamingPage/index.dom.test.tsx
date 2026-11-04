import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import StreamingPage from '.';

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

test('should show required field validation error', async () => {
  const user = userEvent.setup();

  render(<StreamingPage />);

  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.click(sendButton);

  expect(screen.queryByText(/text message is required/i)).toBeInTheDocument();
});

test('should disable form after submitting', async () => {
  const user = userEvent.setup();
  const message = 'text';
  server.use(
    http.post('/api/echo/stream', async () => {
      await delay();
      return HttpResponse.text(message);
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  expect(messageInput).toBeDisabled();
  expect(sendButton).toBeDisabled();
});

test('should show network error', async () => {
  const user = userEvent.setup();
  const message = 'text';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.error();
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  expect(screen.getByText(/unable to connect to server/i)).toBeInTheDocument();
});

test('should show server unavailable error', async () => {
  const user = userEvent.setup();
  const message = 'text';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.text(null, { status: 500 });
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  await waitFor(() =>
    expect(
      screen.getByText(/server is unavailable right now/i),
    ).toBeInTheDocument(),
  );
});

test('should show server respond error', async () => {
  const user = userEvent.setup();
  const message = 'text';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.text(null, { status: 400 });
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  await waitFor(() =>
    expect(screen.getByText(/failed to stream content/i)).toBeInTheDocument(),
  );
});

test('should show server respond error', async () => {
  const user = userEvent.setup();
  const message = 'text';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.text(null, { status: 400 });
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  await waitFor(() =>
    expect(screen.getByText(/failed to stream content/i)).toBeInTheDocument(),
  );
});

test('should show same send message in response', async () => {
  const user = userEvent.setup({ delay: null });
  const message =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus.';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.text(message);
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  const responseContent = screen.getByRole('log');

  await waitFor(() => expect(responseContent).toHaveTextContent(message));
});

test('should able to copy response text after stream ends', async () => {
  const user = userEvent.setup({ delay: null });
  const message =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus.';
  server.use(
    http.post('/api/echo/stream', async () => {
      return HttpResponse.text(message);
    }),
  );

  render(<StreamingPage />);

  const messageInput = screen.getByLabelText(/message/i);
  const sendButton = screen.getByRole('button', { name: /send/i });

  await user.type(messageInput, message);
  await user.click(sendButton);

  const copyButton = screen.getByRole('button', { name: /copy/i });

  await user.click(copyButton);

  await expect(navigator.clipboard.readText()).resolves.toBe(message);
});
