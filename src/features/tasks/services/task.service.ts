import { getAuthApi } from '@/lib/axios';
import type { AxiosResponseDefault } from 'axios';
import type {
  CreateTaskInput,
  TaskResponseModel,
  UpdateTaskInput,
} from '../types';

export async function getTask(id: string) {
  const res = await getAuthApi().get<TaskResponseModel>(`/tasks/${id}`);
  const task = res.data;
  return {
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  };
}

export async function createTask(input: CreateTaskInput) {
  const res = await getAuthApi().post<
    TaskResponseModel,
    AxiosResponseDefault,
    CreateTaskInput
  >(`/tasks`, input);
  const task = res.data;
  return {
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  };
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  const res = await getAuthApi().patch<
    TaskResponseModel,
    AxiosResponseDefault,
    UpdateTaskInput
  >(`/tasks/${id}`, input);
  const task = res.data;
  return {
    ...task,
    created_at: new Date(task.created_at),
    updated_at: new Date(task.updated_at),
  };
}
