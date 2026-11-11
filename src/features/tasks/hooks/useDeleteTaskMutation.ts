import { useAuth } from '@/features/auth/providers/AuthProvider';
import { handleApiError } from '@/lib/errors';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { deleteTask } from '../services/task.service';
import { getTaskQueryOptions } from './useTaskQuery';

function useDeleteTaskMutation() {
  const { updateAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['task', 'delete'],
    mutationFn: deleteTask,
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
      if (axios.isAxiosError(error)) {
        if (error instanceof UnauthenticatedError || error.status === 401)
          updateAuth({ status: 'unauthenticated' });

        if (error.status === 404) console.error('Task not found');
      }
    },
    async onSuccess(_, taskId) {
      await queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: false,
      });
      queryClient.removeQueries({
        queryKey: getTaskQueryOptions(taskId).queryKey,
      });

      navigate('/tasks');
    },
  });
}

export default useDeleteTaskMutation;
