import { getAuthApi } from '@/lib/axios';
import type { TaskResponseModel } from '../types';

export async function getTask(id: string) {
  const res = await getAuthApi().get<TaskResponseModel>(`/tasks/${id}`);
  const task = res.data;
  return {
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  };
}
