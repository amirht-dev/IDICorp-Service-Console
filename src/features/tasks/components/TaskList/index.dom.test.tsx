import { demoTasks } from '@/data/demo';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { mockJsonResponse } from '@/mocks/helpers';
import { server } from '@/mocks/setup/node';
import { userEvent } from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import TasksList from '.';
import type { getTasks } from '../../services/tasks.service';

beforeEach(() => {
  vi.useRealTimers();
});

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

describe('loading', () => {
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
});

describe('error handling', () => {
  test('should shows error message when failed to load tasks', async () => {
    server.use(
      http.get(`/api/tasks`, async () => {
        return HttpResponse.json({}, { status: 400 });
      }),
    );

    render(<TasksList />);

    await waitFor(() =>
      expect(screen.queryByText(/failed to load tasks/i)).toBeInTheDocument(),
    );
  });

  test('should shows server error message when server is unavailable', async () => {
    server.use(
      http.get(`/api/tasks`, async () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(<TasksList />);

    await waitFor(() =>
      expect(screen.queryByText(/server is unavailable/i)).toBeInTheDocument(),
    );
  });
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

describe('filtering', () => {
  test('should only shows tasks that includes searched query', async () => {
    server.use(
      http.get(`/api/tasks`, () => {
        return mockJsonResponse<typeof getTasks>(demoTasks);
      }),
    );

    const user = userEvent.setup();

    render(<TasksList />);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);

    await waitFor(() => expect(searchInput).toBeEnabled());

    const searchTerm = demoTasks[0]?.title ?? '';

    const filteredTasks = demoTasks.filter((task) =>
      [task.title, task.description].some((text) => text.includes(searchTerm)),
    );

    server.resetHandlers();
    server.use(
      http.get(`/api/tasks`, () => {
        return mockJsonResponse<typeof getTasks>(filteredTasks);
      }),
    );

    await user.type(searchInput, searchTerm);

    await waitFor(() =>
      expect(screen.queryAllByRole('listitem')).toHaveLength(0),
    );

    const taskItems = await screen.findAllByRole('listitem');

    expect(taskItems).toHaveLength(filteredTasks.length);
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
    await user.click(
      screen.getByRole('menuitemradio', { name: /descending/i }),
    );

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
    await user.click(
      screen.getByRole('menuitemradio', { name: /descending/i }),
    );

    const tasks = screen.queryAllByRole('listitem');

    expect(tasks[0]).toHaveAccessibleName(
      sortedTasks[sortedTasks.length - 1].title,
    );
    expect(tasks[tasks.length - 1]).toHaveAccessibleName(sortedTasks[0].title);
  });
});
