import { useAuth } from '@/features/auth/providers/AuthProvider';
import { handleApiError } from '@/lib/errors';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { updateTask } from '../services/task.service';
import type { UpdateTaskInput } from '../types';
import { getTaskQueryOptions } from './useTaskQuery';

function useUpdateTaskMutation() {
  const { updateAuth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['task', 'update'],
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    retry(failureCount, error) {
      const err = handleApiError(error);
      if (
        import.meta.env.MODE === 'test' ||
        failureCount > 3 ||
        err.type === 'cancelled' ||
        err.type === 'timeout' ||
        (err.type === 'http' && err.status < 500)
      )
        return false;

      return true;
    },
    onError(error) {
      if (
        error instanceof UnauthenticatedError ||
        (axios.isAxiosError(error) && error.status === 401)
      )
        updateAuth({ status: 'unauthenticated' });
    },
    async onSuccess(data, variables) {
      await queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: false,
      });
      queryClient.setQueryData(
        getTaskQueryOptions(variables.id).queryKey,
        data,
      );
    },
  });
}

export default useUpdateTaskMutation;
