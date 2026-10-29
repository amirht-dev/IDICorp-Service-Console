import { useAuth } from '@/features/auth/providers/AuthProvider';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { deleteTask } from '../services/task.service';
import { getTaskQueryOptions } from './useTaskQuery';
import { getTasksQueryOptions } from './useTasksQuery';

function useDeleteTaskMutation() {
  const { updateAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['tasks', 'delete'],
    mutationFn: deleteTask,
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error instanceof UnauthenticatedError || error.status === 401)
          updateAuth({ status: 'unauthenticated' });

        if (error.status === 404) console.error('Task not found');

        console.error('Failed to delete task');
      }
    },
    onSuccess(_, taskId) {
      queryClient.setQueryData(getTasksQueryOptions().queryKey, (tasks) =>
        tasks?.filter((task) => task.id !== taskId),
      );
      queryClient.removeQueries({
        queryKey: getTaskQueryOptions(taskId).queryKey,
      });

      navigate('/tasks');
    },
  });
}

export default useDeleteTaskMutation;
