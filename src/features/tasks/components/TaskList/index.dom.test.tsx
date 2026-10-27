import { demoTasks } from '@/data/demo';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TasksList from '.';

test('should shows all tasks by default and when all tasks tab is selected', async () => {
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  for (const task of demoTasks) {
    expect(screen.getByText(task.title)).toBeInTheDocument();
  }

  await user.click(screen.getByRole('tab', { name: /all/i }));

  for (const task of demoTasks) {
    expect(screen.queryByText(task.title)).toBeInTheDocument();
  }
});

test('should only shows active tasks when active tab is selected', async () => {
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  await user.click(screen.getByRole('tab', { name: /active/i }));

  for (const task of demoTasks) {
    if (task.completed)
      expect(screen.queryByText(task.title)).not.toBeInTheDocument();
    else expect(screen.queryByText(task.title)).toBeInTheDocument();
  }
});

test('should only shows completed tasks when completed tab is selected', async () => {
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  await user.click(screen.getByRole('tab', { name: /completed/i }));

  for (const task of demoTasks) {
    if (task.completed)
      expect(screen.queryByText(task.title)).toBeInTheDocument();
    else expect(screen.queryByText(task.title)).not.toBeInTheDocument();
  }
});

test('should sort tasks by created at date in ascending', async () => {
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  await user.click(screen.getByRole('button', { name: /sort/i }));

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
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  await user.click(screen.getByRole('button', { name: /sort/i }));

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
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
  );

  await user.click(screen.getByRole('button', { name: /sort/i }));

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /updated/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /ascending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(sortedTasks[0].title);
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
});

test('should sort tasks by updated at date in descending', async () => {
  const user = userEvent.setup();
  render(<TasksList tasks={demoTasks} />);

  const sortedTasks = demoTasks.toSorted(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  await user.click(screen.getByRole('button', { name: /sort/i }));

  const sortMenu = await screen.findByRole('menu');

  expect(sortMenu).toBeInTheDocument();

  await user.click(screen.getByRole('menuitemradio', { name: /updated/i }));
  await user.click(screen.getByRole('menuitemradio', { name: /descending/i }));

  const tasks = screen.queryAllByRole('listitem');

  expect(tasks[0]).toHaveAccessibleName(
    sortedTasks[sortedTasks.length - 1].title,
  );
  expect(tasks[tasks.length - 1]).toHaveAccessibleName(sortedTasks[0].title);
});
