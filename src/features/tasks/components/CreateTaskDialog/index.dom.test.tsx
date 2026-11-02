import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { mockJsonResponse } from '@/mocks/helpers';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import CreateTaskDialog from '.';
import type { TaskResponseModel } from '../../types';

beforeEach(() => {
  vi.useRealTimers();
});

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

describe('validation', () => {
  test('should show required field errors on submit', async () => {
    const user = userEvent.setup();

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  test('should show network error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/tasks', () => {
        return HttpResponse.error();
      }),
    );

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task');

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    await waitFor(() =>
      expect(
        screen.getByText(/unable to connect to server\. please try again\./i),
      ).toBeInTheDocument(),
    );
  });

  test('should show error when failed to create task on server', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/tasks', async () => {
        return HttpResponse.json({}, { status: 400 });
      }),
    );

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task');

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument(),
    );
  });

  test('should show server validation error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/tasks', async () => {
        return HttpResponse.json({}, { status: 422 });
      }),
    );

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task');

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/validation error/i)).toBeInTheDocument(),
    );
  });

  test('should show server error when server is unavailable', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/tasks', async () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task');

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/server is unavailable/i)).toBeInTheDocument(),
    );
  });
});

describe('submission', () => {
  test('should close modal after task successfully created', async () => {
    const user = userEvent.setup();
    const newTask: TaskResponseModel = {
      id: '1',
      title: 'new task',
      description: '',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    server.use(
      http.post('/api/tasks', async () => {
        return mockJsonResponse(newTask);
      }),
    );

    render(<CreateTaskDialog trigger={<button>open dialog</button>} />);

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);
    const descInput = screen.getByLabelText(/description/i);
    const completedCheckbox = screen.getByRole('checkbox', {
      name: /completed/i,
    });

    await user.type(titleInput, 'new task');
    await user.type(descInput, 'new task desc');
    await user.click(completedCheckbox);

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: /create new task/i }),
      ).not.toBeInTheDocument(),
    );
  });

  test('should call event handler after create task successfully', async () => {
    const user = userEvent.setup();
    const newTask: TaskResponseModel = {
      id: '1',
      title: 'new task',
      description: '',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    server.use(
      http.post('/api/tasks', async () => {
        return mockJsonResponse(newTask);
      }),
    );

    const onCreateTask = vi.fn();
    render(
      <CreateTaskDialog
        onCreateTask={onCreateTask}
        trigger={<button>open dialog</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /create new task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);
    const descInput = screen.getByLabelText(/description/i);
    const completedCheckbox = screen.getByRole('checkbox', {
      name: /completed/i,
    });

    await user.type(titleInput, 'new task');
    await user.type(descInput, 'new task desc');
    await user.click(completedCheckbox);

    const createTaskButton = screen.getByRole('button', {
      name: /create task/i,
    });

    await user.click(createTaskButton);

    expect(onCreateTask).toHaveBeenCalled();
  });
});
