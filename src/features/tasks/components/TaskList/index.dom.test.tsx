import { demoTasks } from '@/data/demo';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { server } from '@/mocks/setup/node';
import { userEvent } from '@testing-library/user-event';
import { delay, http, HttpResponse, type JsonBodyType } from 'msw';
import TasksList from '.';
import type { getTasks } from '../../services/tasks.service';

function mockJsonResponse<
  T extends () => Promise<JsonBodyType>,
  E extends JsonBodyType = Awaited<ReturnType<T>>,
>(mockedData: E) {
  return HttpResponse.json<E>(mockedData);
}

beforeEach(() => {
  vi.useRealTimers();
});

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

test('should shows loading skeleton while loading tasks', async () => {
  server.use(
    http.get(`/api/tasks`, async () => {
      await delay();
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  render(<TasksList />);

  const taskSkeletonItems = await screen.findAllByRole('presentation', {
    busy: true,
  });

  expect(taskSkeletonItems.length).toBeGreaterThanOrEqual(1);
});

test('should shows error when failed to load tasks', async () => {
  server.use(
    http.get(`/api/tasks`, async () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  vi.useFakeTimers();

  render(<TasksList />);

  await vi.runAllTimersAsync();

  expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
});

test('should shows all tasks by default and when all tasks tab is selected', async () => {
  server.use(
    http.get(`/api/tasks`, () => {
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  render(<TasksList />);

  const taskItems = await screen.findAllByRole('listitem');

  expect(taskItems).toHaveLength(demoTasks.length);
});

test('should only shows active tasks when active tab is selected', async () => {
  server.use(
    http.get(`/api/tasks`, ({ request }) => {
      const reqURL = new URL(request.url);
      const completed = reqURL.searchParams.get('completed');

      const tasks = demoTasks.filter((task) => {
        if (completed)
          return (
            (completed === 'true' && task.completed) ||
            (completed === 'false' && !task.completed)
          );
        return task;
      });

      return mockJsonResponse<typeof getTasks>(tasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const activeTab = await waitFor(() => {
    const el = screen.getByRole('tab', { name: /active/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(activeTab);

  const taskItems = await screen.findAllByRole('listitem');

  expect(taskItems).toHaveLength(
    demoTasks.filter((task) => !task.completed).length,
  );
});

test('should only shows completed tasks when completed tab is selected', async () => {
  server.use(
    http.get(`/api/tasks`, ({ request }) => {
      const reqURL = new URL(request.url);
      const completed = reqURL.searchParams.get('completed');

      const tasks = demoTasks.filter((task) => {
        if (completed)
          return (
            (completed === 'true' && task.completed) ||
            (completed === 'false' && !task.completed)
          );
        return task;
      });

      return mockJsonResponse<typeof getTasks>(tasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const completedTab = await waitFor(() => {
    const el = screen.getByRole('tab', { name: /completed/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(completedTab);

  const taskItems = await screen.findAllByRole('listitem');

  expect(taskItems).toHaveLength(
    demoTasks.filter((task) => task.completed).length,
  );
});

test('should sort tasks by created at date in ascending', async () => {
  server.use(
    http.get(`/api/tasks`, () => {
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );

  const sortButton = await waitFor(() => {
    const el = screen.getByRole('button', { name: /sort/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(sortButton);

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /created/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /ascending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(sortedTasks[0].title);
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
});

test('should sort tasks by created at date in descending', async () => {
  server.use(
    http.get(`/api/tasks`, () => {
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );

  const sortButton = await waitFor(() => {
    const el = screen.getByRole('button', { name: /sort/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(sortButton);

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /created/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /descending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(sortedTasks[0].title);
});

test('should sort tasks by updated at date in ascending', async () => {
  server.use(
    http.get(`/api/tasks`, () => {
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.updated_at.getTime() - b.updated_at.getTime(),
  );

  const sortButton = await waitFor(() => {
    const el = screen.getByRole('button', { name: /sort/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(sortButton);

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /created/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /ascending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(sortedTasks[0].title);
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
});

test('should sort tasks by updated at date in descending', async () => {
  server.use(
    http.get(`/api/tasks`, () => {
      return mockJsonResponse<typeof getTasks>(demoTasks);
    }),
  );

  const user = userEvent.setup();

  render(<TasksList />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.updated_at.getTime() - b.updated_at.getTime(),
  );

  const sortButton = await waitFor(() => {
    const el = screen.getByRole('button', { name: /sort/i });
    expect(el).toBeEnabled();
    return el;
  });

  await user.click(sortButton);

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /created/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /descending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(sortedTasks[0].title);
});
