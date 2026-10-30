import type { TaskModel } from '@/features/tasks/types';

export const demoTasks = Array(10)
  .fill({})
  .map<TaskModel>((_, idx) => ({
    id: idx.toString(),
    title: `Task title ${idx + 1}`,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam rerum,aspernatur, aliquam numquam itaque dignissimos ratione adipisci pariatur quaerat harum animi at eligendi, fuga sint natus officia. Unde, porro suscipit!',
    completed: Math.random() < 0.5,
    created_at: new Date(2000 + idx, 1, 1),
    updated_at: new Date(2001 + idx, 1, 1),
  }));

export const DEMO_MESSAGES_HISTORY = [
  { sender: true, content: 'hello world' },
  { sender: false, content: 'hello world' },
];
