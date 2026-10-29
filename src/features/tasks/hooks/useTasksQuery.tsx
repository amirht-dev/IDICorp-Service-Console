import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { getTasks } from '../services/tasks.service';
import type { TaskModel, TaskQueryFilter } from '../types';

type UseTaskQueryOptions = Omit<
  UseQueryOptions<
    TaskModel[],
    Error,
    TaskModel[],
    readonly ['tasks', TaskQueryFilter]
  >,
  'queryKey' | 'queryFn'
>;

export const getTasksQueryOptions = (
  filters: TaskQueryFilter = {},
  options?: UseTaskQueryOptions,
) =>
  queryOptions({
    ...options,
    queryKey: ['tasks', filters] as const,
    queryFn: ({ queryKey }) => getTasks(queryKey[1]),
    retry(failureCount, error) {
      if (axios.isAxiosError(error) && error.status === 401) return false;
      if (failureCount > 10) return false;

      return true;
    },
    staleTime: 2 * 60_000,
  });

function useTasksQuery(
  filters?: TaskQueryFilter,
  options?: UseTaskQueryOptions,
) {
  return useQuery(getTasksQueryOptions(filters, options));
}

export default useTasksQuery;
