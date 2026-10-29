import { useAuth } from '@/features/auth/providers/AuthProvider';
import { UnauthenticatedError } from '@/lib/exceptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { updateTask } from '../services/task.service';
import type { UpdateTaskInput } from '../types';
import { getTaskQueryOptions } from './useTaskQuery';
import { getTasksQueryOptions } from './useTasksQuery';

function useUpdateTaskMutation() {
  const { updateAuth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['task', 'update'],
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onError(error) {
      if (axios.isAxiosError(error)) console.log(error.response?.data);
      if (
        error instanceof UnauthenticatedError ||
        (axios.isAxiosError(error) && error.status === 401)
      )
        updateAuth({ status: 'unauthenticated' });
    },
    onSuccess(data, variables) {
      queryClient.setQueryData(getTasksQueryOptions().queryKey, (tasks) =>
        tasks?.map((task) => (task.id === data.id ? data : task)),
      );
      queryClient.setQueryData(
        getTaskQueryOptions(variables.id).queryKey,
        data,
      );
    },
  });
}

export default useUpdateTaskMutation;
