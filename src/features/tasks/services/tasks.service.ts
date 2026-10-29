import { getAuthApi } from '@/lib/axios';
import type { Schema } from 'type-fest';
import type { TaskQueryFilter, TaskResponseModel } from '../types';

export async function getTasks(filters: TaskQueryFilter = {}) {
  const params: Schema<TaskQueryFilter, string> = {};

  if (filters.q !== undefined) params.q = String(filters.q);
  if (filters.completed !== undefined)
    params.completed = String(filters.completed);

  const tasks = await getAuthApi().get<TaskResponseModel[]>('/tasks', {
    params,
  });

  return tasks.data.map((task) => ({
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  }));
}
