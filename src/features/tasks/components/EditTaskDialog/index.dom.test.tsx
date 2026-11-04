import { demoTasks } from '@/data/demo';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import { render, screen, waitFor } from '@/lib/testing-library';
import { mockJsonResponse } from '@/mocks/helpers';
import { server } from '@/mocks/setup/node';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import EditTaskDialog from '.';
import type { TaskResponseModel } from '../../types';

beforeEach(() => {
  vi.useRealTimers();
});

beforeAll(() => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify('mocked'));

  return () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
});

const task = demoTasks[0];

test('should show current task information', async () => {
  const user = userEvent.setup();
  render(<EditTaskDialog task={task} trigger={<button>open dialog</button>} />);

  await user.click(screen.getByRole('button', { name: /open dialog/i }));

  await waitFor(() =>
    expect(
      screen.getByRole('dialog', { name: /edit task/i }),
    ).toBeInTheDocument(),
  );

  const titleInput = screen.getByLabelText(/title\*/i);
  const descInput = screen.getByLabelText(/description/i);
  const completedCheckbox = screen.getByRole('checkbox', {
    name: /completed/i,
  });

  expect(titleInput).toHaveValue(task.title);
  expect(descInput).toHaveValue(task.description);
  expect(completedCheckbox.getAttribute('data-checked')).toBe(
    task.completed ? '' : null,
  );
});

describe('validation', () => {
  test('should show required validation error', async () => {
    const user = userEvent.setup();
    const task = demoTasks[0];
    render(
      <EditTaskDialog task={task} trigger={<button>open dialog</button>} />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);
    const descInput = screen.getByLabelText(/description/i);
    const completedCheckbox = screen.getByRole('checkbox', {
      name: /completed/i,
    });

    await user.clear(titleInput);
    await user.clear(descInput);
    if (task.completed) await user.click(completedCheckbox);

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  test('should show network error', async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`/api/tasks/${task.id}`, () => {
        return HttpResponse.error();
      }),
    );

    render(
      <EditTaskDialog task={task} trigger={<button>open dialog</button>} />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task title');

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    await waitFor(() =>
      expect(
        screen.getByText(/unable to connect to server\. please try again\./i),
      ).toBeInTheDocument(),
    );
  });

  test('should show error when failed to edit task on server', async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`/api/tasks/${task.id}`, async () => {
        return HttpResponse.json({}, { status: 400 });
      }),
    );

    render(
      <EditTaskDialog task={task} trigger={<button>open dialog</button>} />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task title');

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/failed to edit task/i)).toBeInTheDocument(),
    );
  });

  test('should show server validation error', async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`/api/tasks/${task.id}`, async () => {
        return HttpResponse.json({}, { status: 422 });
      }),
    );

    render(
      <EditTaskDialog task={task} trigger={<button>open dialog</button>} />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task title');

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/validation error/i)).toBeInTheDocument(),
    );
  });

  test('should show server error when server is unavailable', async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`/api/tasks/${task.id}`, async () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(
      <EditTaskDialog task={task} trigger={<button>open dialog</button>} />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);

    await user.type(titleInput, 'new task title');

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    await waitFor(() =>
      expect(screen.getByText(/server is unavailable/i)).toBeInTheDocument(),
    );
  });
});

describe('submission', () => {
  test('should call success event handler after edit task successfully', async () => {
    const user = userEvent.setup();
    const updatedTask: TaskResponseModel = {
      id: task.id,
      title: 'new task title',
      description: '',
      completed: false,
      created_at: task.created_at.toISOString(),
      updated_at: new Date().toISOString(),
    };
    server.use(
      http.patch(`/api/tasks/${task.id}`, async () => {
        return mockJsonResponse(updatedTask);
      }),
    );

    const onSuccess = vi.fn();
    render(
      <EditTaskDialog
        task={task}
        onSuccess={onSuccess}
        trigger={<button>open dialog</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);
    const descInput = screen.getByLabelText(/description/i);
    const completedCheckbox = screen.getByRole('checkbox', {
      name: /completed/i,
    });

    await user.type(titleInput, 'new task title');
    await user.type(descInput, 'new task desc');
    await user.click(completedCheckbox);

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    expect(onSuccess).toHaveBeenCalled();
  });

  test('should call error event handler after create task failed', async () => {
    const user = userEvent.setup();
    server.use(
      http.patch(`/api/tasks/${task.id}`, async () => {
        return HttpResponse.json({}, { status: 400 });
      }),
    );

    const onError = vi.fn();
    render(
      <EditTaskDialog
        task={task}
        onError={onError}
        trigger={<button>open dialog</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open dialog/i }));

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /edit task/i }),
      ).toBeInTheDocument(),
    );

    const titleInput = screen.getByLabelText(/title\*/i);
    const descInput = screen.getByLabelText(/description/i);
    const completedCheckbox = screen.getByRole('checkbox', {
      name: /completed/i,
    });

    await user.type(titleInput, 'new task title');
    await user.type(descInput, 'new task desc');
    await user.click(completedCheckbox);

    const editTaskButton = screen.getByRole('button', {
      name: /edit task/i,
    });

    await user.click(editTaskButton);

    expect(onError).toHaveBeenCalled();
  });
});
