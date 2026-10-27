import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from 'cn';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { CheckCircleIcon, CircleDotIcon } from 'lucide-react';
import type { TaskModel } from '../../types';
import TaskActionsDropdown from '../TaskActionsDropdown';

type TaskCardProps = {
  task: TaskModel;
};
function TaskCard({ task }: TaskCardProps) {
  const titleId = `task-title-${task.id}`;
  const descId = `task-desc-${task.id}`;
  return (
    <>
      <div
        className="flex gap-2 border rounded-md p-2 h-32"
        role="listitem"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div
          className={cn(
            'h-full aspect-square rounded-md shrink-0 grow-0 [&_svg]:size-10 flex items-center justify-center',
            task.completed
              ? 'text-success bg-success/10'
              : 'text-info bg-info/10',
          )}
        >
          {task.completed ? (
            <CheckCircleIcon aria-label="task completed icon" />
          ) : (
            <CircleDotIcon aria-label="task pending icon" />
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h5 className="text-lg font-medium line-clamp-1" id={titleId}>
            {task.title}
          </h5>
          <p
            className="text-base line-clamp-2 mt-2 text-muted-foreground"
            id={descId}
          >
            {task.description}
          </p>
          <div className="mt-auto flex items-center gap-3">
            <Badge variant={task.completed ? 'success' : 'info'}>
              {task.completed ? 'Completed' : 'Active'}
            </Badge>
            <p className="text-sm text-muted-foreground italic">
              created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        <TaskActionsDropdown task={task} className="self-center" />
      </div>
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
