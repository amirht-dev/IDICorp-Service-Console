import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { toast } from '@/components/ui/Toast';
import { handleApiError } from '@/lib/errors';
import { Trash2Icon } from 'lucide-react';
import type { ComponentProps, ReactElement } from 'react';
import type { Arrayable } from 'type-fest';
import useDeleteTaskMutation from '../../hooks/useDeleteTaskMutation';
import type { TaskModel } from '../../types';

type DeleteTaskDialogProps = {
  taskId: TaskModel['id'];
  trigger?: Arrayable<ReactElement>;
  onSuccess?: () => void;
} & Pick<ComponentProps<typeof AlertDialog>, 'open' | 'onOpenChange'>;

const DeleteTaskDialog = ({
  taskId,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTaskDialogProps) => {
  const mutation = useDeleteTaskMutation();

  const handleDeleteTask = async () => {
    const toastId = toast.add({ type: 'loading', title: 'Deleting task...' });

    mutation.mutate(taskId, {
      onError(error) {
        const err = handleApiError(error);
        let message: string;
        if (err.type === 'network') {
          message = 'Unable to connect to server. Please try again.';
        } else if (err.type === 'timeout') {
          message =
            'Server did not respond within allotted time. Please try again.';
        } else if (err.type === 'cancelled') {
          message = 'Deleting task was cancelled. please try again';
        } else if (err.type === 'http') {
          if (err.status === 422)
            message = 'Server validation error. See console for more details.';
          else if (err.status === 404) message = 'Task not found';
          else if (err.status >= 500)
            message =
              'Failed to delete task. Server is unavailable right now. Please try again later.';
          else message = 'Failed to delete task.';
        } else message = 'Unknown error occurred when deleting task.';

        toast.update(toastId, {
          type: 'error',
          title: 'Failed to delete task',
          description: message,
        });
      },
      onSuccess() {
        onSuccess?.();
        toast.update(toastId, {
          type: 'success',
          title: 'Task deleted successfully',
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {Array.isArray(trigger)
        ? trigger.map((t, idx) => <AlertDialogTrigger key={idx} render={t} />)
        : trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this task. are you sure you want to
            delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDeleteTask}
          >
            Delete Task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskDialog;
