import { handleApiError } from '@/lib/errors';
import {
  queryOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
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
    queryKey: ['task', String(id)],
    queryFn: ({ signal }) => getTask({ id }, { signal }),
    retry(failureCount, error) {
      if (import.meta.env.MODE === 'test') return false;
      const err = handleApiError(error);
      if (
        err.type === 'cancelled' ||
        err.type === 'timeout' ||
        (err.type === 'http' && err.status < 500)
      )
        return false;
      if (failureCount > 3) return false;

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
