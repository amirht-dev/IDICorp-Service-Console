import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { handleApiError } from '@/lib/errors';
import { cn } from 'cn';
import {
  CircleCheckIcon,
  CircleDotIcon,
  EllipsisIcon,
  SquareArrowOutUpRightIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import useUpdateTaskMutation from '../../hooks/useUpdateTaskMutation';
import type { TaskModel } from '../../types';
import DeleteTaskDialog from '../DeleteTaskDialog';
import EditTaskDialog from '../EditTaskDialog';

const TaskActionsDropdown = ({
  task,
  className,
  showVisitTask = true,
  disabled = false,
}: {
  task: TaskModel;
  className?: string;
  showVisitTask?: boolean;
  disabled?: boolean;
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu disabled={disabled}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={cn('shrink-0', className)}
            >
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-45">
          {showVisitTask && (
            <DropdownMenuItem render={<Link to={`/tasks/${task.id}`} />}>
              <SquareArrowOutUpRightIcon />
              Visit task
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <SquarePenIcon />
            Edit
          </DropdownMenuItem>
          <SwitchStatusDropdownItem
            task={task}
            onSuccess={() => setEditDialogOpen(false)}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={task}
        onSuccess={() => setEditDialogOpen(false)}
      />
      <DeleteTaskDialog
        taskId={task.id}
        onSuccess={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

function SwitchStatusDropdownItem({
  task,
  onSuccess,
}: {
  task: TaskModel;
  onSuccess?: () => void;
}) {
  const mutation = useUpdateTaskMutation();

  const switchStatus = async () => {
    mutation.mutate(
      { id: task.id, input: { completed: !task.completed } },
      {
        onError(error) {
          const err = handleApiError(error);
          let message: string;
          if (err.type === 'network') {
            message = 'Unable to connect to server. Please try again.';
          } else if (err.type === 'timeout') {
            message =
              'Server did not respond within allotted time. Please try again.';
          } else if (err.type === 'cancelled') {
            message = 'Updating task status was cancelled. please try again';
          } else if (err.type === 'http') {
            if (err.status === 422)
              message =
                'Server validation error. See console for more details.';
            else if (err.status >= 500)
              message =
                'Failed to update task status. Server is unavailable right now. Please try again later.';
            else message = 'Failed to update task status.';
          } else message = 'Unknown error occurred when creating task.';

          console.error(message);
        },
        onSuccess() {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <DropdownMenuItem disabled={mutation.isPending} onClick={switchStatus}>
      {task.completed ? (
        <>
          <CircleDotIcon />
          Set as active
        </>
      ) : (
        <>
          <CircleCheckIcon />
          Set as completed
        </>
      )}
    </DropdownMenuItem>
  );
}

export default TaskActionsDropdown;
