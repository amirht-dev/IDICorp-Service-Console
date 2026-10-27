import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import {
  CheckCircleIcon,
  CircleCheckIcon,
  CircleDotIcon,
  EllipsisIcon,
  SquareArrowOutUpRightIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import DeleteTaskDialog from '../DeleteTaskDialog';
import EditTaskDialog from '../EditTaskDialog';
import { Badge } from '@/components/ui/Badge';

type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
function TaskCard({
  id,
  title,
  description,
  completed,
  createdAt,
}: TaskCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const titleId = `task-title-${id}`;
  const descId = `task-desc-${id}`;
  return (
    <>
      <div
        className="flex gap-2 border rounded-md p-2 h-32"
        role="listitem"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="h-full aspect-square bg-primary/10 rounded-md shrink-0 grow-0 text-primary [&_svg]:size-10 flex items-center justify-center">
          {completed ? (
            <CheckCircleIcon aria-label="task completed icon" />
          ) : (
            <CircleDotIcon aria-label="task pending icon" />
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h5 className="text-lg font-medium line-clamp-1" id={titleId}>
            {title}
          </h5>
          <p
            className="text-base line-clamp-2 mt-2 text-muted-foreground"
            id={descId}
          >
            {description}
          </p>
          <div className="mt-auto flex items-center gap-3">
            <Badge variant={completed ? 'success' : 'info'}>
              {completed ? 'Completed' : 'Active'}
            </Badge>
            <p className="text-sm text-muted-foreground italic">
              created {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 self-center"
              >
                <EllipsisIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="min-w-45">
            <DropdownMenuItem render={<Link to={`/tasks/${id}`} />}>
              <SquareArrowOutUpRightIcon />
              Visit task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <SquarePenIcon />
              Edit
            </DropdownMenuItem>
            {completed ? (
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
      </div>

      <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="flex gap-2 border rounded-md p-2 h-32">
      <Skeleton className="h-full aspect-square rounded-md shrink-0 grow-0" />

      <div className="flex-1 flex flex-col">
        <Skeleton className="text-lg w-1/4 h-lh" />
        <Skeleton className="text-base mt-2 w-3/4 h-lh" />
        <Skeleton className="text-sm w-1/4 mt-auto h-lh" />
      </div>
    </div>
  );
}

export { TaskCard, TaskCardSkeleton };
