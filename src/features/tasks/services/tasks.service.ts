import { getAuthApi } from '@/lib/axios';
import { z } from 'zod/v4';
import { tasksFiltersParamsSchema } from '../schemas';
import type { TaskQueryFilter, TaskResponseModel } from '../types';

export async function getTasks(filters: TaskQueryFilter = {}) {
  const parsedFilterParams = tasksFiltersParamsSchema.safeParse(filters);

  if (!parsedFilterParams.success)
    console.error(z.prettifyError(parsedFilterParams.error));

  const tasks = await getAuthApi().get<TaskResponseModel[]>('/tasks', {
    params: parsedFilterParams.data,
  });

  return tasks.data.map((task) => ({
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  }));
}
