import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
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
          {/* {task.completed ? (
            <DropdownMenuItem>
              <CircleDotIcon />
              Set as active
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <CircleCheckIcon />
              Set as completed
            </DropdownMenuItem>
          )} */}
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
        taskId={task.id}
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
