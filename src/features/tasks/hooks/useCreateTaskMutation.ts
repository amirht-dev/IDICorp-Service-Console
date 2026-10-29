import { useAuth } from '@/features/auth/providers/AuthProvider';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { createTask } from '../services/task.service';
import { getTasksQueryOptions } from './useTasksQuery';

function useCreateTaskMutation() {
  const { updateAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['task', 'create'],
    mutationFn: createTask,
    onError(error) {
      if (axios.isAxiosError(error)) console.log(error.response?.data);
      if (
        error instanceof UnauthenticatedError ||
        (axios.isAxiosError(error) && error.status === 401)
      )
        updateAuth({ status: 'unauthenticated' });
    },
    onSuccess(data) {
      queryClient.setQueryData(getTasksQueryOptions().queryKey, (tasks) => {
        if (!tasks) return;

        const existingTaskIndex = tasks.findIndex(
          (task) => task.id === data.id,
        );
        if (existingTaskIndex !== -1) {
          const newTasks = tasks.slice();
          newTasks.splice(existingTaskIndex, 1, data);
          return newTasks;
        }

        return [...tasks, data];
      });
      navigate(`/tasks/${data.id}`);
    },
  });
}

export default useCreateTaskMutation;
