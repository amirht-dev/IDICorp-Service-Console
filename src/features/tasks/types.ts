import type { ArrayValues } from 'type-fest';
import type { z } from 'zod/v4';
import type { createTaskInputSchema, updateTaskInputSchema } from './schemas';
import type { getTasks } from './services/tasks.service';

export type TaskResponseModel = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskModel = ArrayValues<Awaited<ReturnType<typeof getTasks>>>;

export type TaskQueryFilter = { q?: string; completed?: boolean };

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
