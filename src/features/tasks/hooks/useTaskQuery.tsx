import {
  queryOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { getTask } from '../services/task.service';
import type { TaskModel } from '../types';
import { getTasksQueryOptions } from './useTasksQuery';

type UseTaskQueryOptions = Omit<
  UseQueryOptions<TaskModel, Error, TaskModel>,
  'queryKey' | 'queryFn'
>;

export const getTaskQueryOptions = (
  id: string,
  options?: UseTaskQueryOptions,
) =>
  queryOptions({
    ...options,
    queryKey: ['tasks', String(id)],
    queryFn: () => getTask(id),
    retry(failureCount, error) {
      if (axios.isAxiosError(error) && error.status === 401) return false;
      if (failureCount > 10) return false;

      return true;
    },
    staleTime: 2 * 60_000,
  });

function useTaskQuery(id: string, options?: UseTaskQueryOptions) {
  const queryClient = useQueryClient();

  return useQuery(
    getTaskQueryOptions(id, {
      initialData() {
        const tasks = queryClient.getQueryData(getTasksQueryOptions().queryKey);
        return tasks?.find((task) => task.id === id);
      },
      initialDataUpdatedAt() {
        const tasksQueryState = queryClient.getQueryState(
          getTasksQueryOptions().queryKey,
        );

        if (tasksQueryState) return tasksQueryState.dataUpdatedAt;
      },
      ...options,
    }),
  );
}

export default useTaskQuery;
