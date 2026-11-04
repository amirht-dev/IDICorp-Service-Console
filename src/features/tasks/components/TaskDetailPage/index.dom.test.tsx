import { demoTasks } from '@/data/demo';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { server } from '@/mocks/setup/node';
import { delay, http, HttpResponse } from 'msw';
import { useParams } from 'react-router';
import TaskDetailPage from '.';
import type useTaskParam from '../../hooks/useTaskParam';
import type { TaskModel } from '../../types';

const task = demoTasks[0];

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({ taskId: task.id } satisfies ReturnType<
    typeof useTaskParam
  >);
});

test('should show loading while loading task detail', () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      await delay();
      return HttpResponse.json<TaskModel>(task);
    }),
  );

  render(<TaskDetailPage />);

  expect(screen.queryAllByRole('presentation').length).toBeGreaterThan(0);
});

test('should show network error', async () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      return HttpResponse.error();
    }),
  );

  render(<TaskDetailPage />);

  await waitFor(() =>
    expect(
      screen.queryByText(/unable to connect to server/i),
    ).toBeInTheDocument(),
  );
});

test('should show network error', async () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      return HttpResponse.error();
    }),
  );

  render(<TaskDetailPage />);

  await waitFor(() =>
    expect(
      screen.queryByText(/unable to connect to server/i),
    ).toBeInTheDocument(),
  );
});

test('should show 404 message when task did not found', async () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      return HttpResponse.json({}, { status: 404 });
    }),
  );

  render(<TaskDetailPage />);

  await waitFor(() =>
    expect(
      screen.queryByText(/task you want to see does not exists/i),
    ).toBeInTheDocument(),
  );
});

test('should show server error message when server is unable', async () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      return HttpResponse.json({}, { status: 500 });
    }),
  );

  render(<TaskDetailPage />);

  await waitFor(() =>
    expect(screen.queryByText(/server is unavailable/i)).toBeInTheDocument(),
  );
});

test('should show error when failed to load task', async () => {
  server.use(
    http.get('/api/tasks/:taskId', async () => {
      return HttpResponse.json({}, { status: 400 });
    }),
  );

  render(<TaskDetailPage />);

  await waitFor(() =>
    expect(screen.queryByText(/failed to load task/i)).toBeInTheDocument(),
  );
});
