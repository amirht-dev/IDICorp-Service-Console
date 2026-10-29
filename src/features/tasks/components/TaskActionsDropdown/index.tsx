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
          {task.completed ? (
            <DropdownMenuItem>
              <CircleDotIcon />
              Set as active
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <CircleCheckIcon />
              Set as completed
            </DropdownMenuItem>
          )}
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

      <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default TaskActionsDropdown;
