import { useAuth } from '@/features/auth/providers/AuthProvider';
import { handleApiError } from '@/lib/errors';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { createTask } from '../services/task.service';

function useCreateTaskMutation() {
  const { updateAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['task', 'create'],
    mutationFn: createTask,
    retry(failureCount, error) {
      const err = handleApiError(error);
      if (import.meta.env.MODE === 'test') return false;
      if (err.type === 'http' && err.status < 500) return false;
      if (failureCount > 3) return false;

      return true;
    },
    onError(error) {
      if (
        error instanceof UnauthenticatedError ||
        (axios.isAxiosError(error) && error.status === 401)
      )
        updateAuth({ status: 'unauthenticated' });
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: false,
      });
      // queryClient.setQueryData(getTasksQueryOptions().queryKey, (tasks) => {
      //   if (!tasks) return;

      //   const existingTaskIndex = tasks.findIndex(
      //     (task) => task.id === data.id,
      //   );
      //   if (existingTaskIndex !== -1) {
      //     const newTasks = tasks.slice();
      //     newTasks.splice(existingTaskIndex, 1, data);
      //     return newTasks;
      //   }

      //   return [...tasks, data];
      // });
      navigate(`/tasks/${data.id}`);
    },
  });
}

export default useCreateTaskMutation;
