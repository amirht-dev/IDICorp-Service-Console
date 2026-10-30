import { useAuth } from '@/features/auth/providers/AuthProvider';
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
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error instanceof UnauthenticatedError || error.status === 401)
          updateAuth({ status: 'unauthenticated' });

        if (error.status === 404) console.error('Task not found');

        console.error('Failed to delete task');
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
