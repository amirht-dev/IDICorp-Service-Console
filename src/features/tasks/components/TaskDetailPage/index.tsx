import Header from '@/components/shared/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { demoTasks } from '@/data/demo';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ChevronLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import TaskActionsDropdown from '../TaskActionsDropdown';

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const task = demoTasks[0];
  return (
    <div className="container">
      <Header />
      <div className="flex justify-between items-start gap-1">
        <div className="flex gap-2 items-start">
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(-1)}
              className="lg:hidden"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xl"
              onClick={() => navigate(-1)}
              className="max-lg:hidden"
            >
              <ChevronLeftIcon />
            </Button>
          </>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg lg:text-3xl font-medium">Task title</h3>

            <div className="flex items-start justify-between">
              <TaskStatusBadge completed={task.completed} />
            </div>
          </div>
        </div>

        <TaskActionsDropdown task={task} showVisitTask={false} />
      </div>

      <div className="flex flex-col gap-1 lg:gap-2 mt-4 lg:mt-6">
        <p className="text-muted-foreground text-sm lg:text-base">
          Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
        </p>
        <p className="text-muted-foreground text-sm lg:text-base">
          Updated {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
        </p>
      </div>

      <div className="mt-14">
        <h4 className="font-semibold">Description:</h4>
        <p className="text-muted-foreground">{task.description}</p>
      </div>
    </div>
  );
};

function TaskStatusBadge({ completed }: { completed: boolean }) {
  return (
    <Badge variant={completed ? 'success' : 'info'}>
      {completed ? 'Completed' : 'Active'}
    </Badge>
  );
}

export default TaskDetailPage;
