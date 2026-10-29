import Count from '@/components/helpers/Count';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { Skeleton } from '@/components/ui/Skeleton';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import useTaskQuery from '../../hooks/useTaskQuery';
import TaskActionsDropdown from '../TaskActionsDropdown';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  if (!taskId) throw new Error('No taskId');

  const query = useTaskQuery(taskId);

  const navigate = useNavigate();

  if (
    query.isError &&
    axios.isAxiosError(query.error) &&
    query.error.status === 404
  )
    return (
      <Card className="min-h-100 flex items-center justify-center">
        <div className="flex items-center gap-4 divide-x">
          <span className="text-3xl lg:text-4xl pe-4">404</span>
          <CardTitle>Task you want to see is not exists</CardTitle>
        </div>
        <Button variant="outline" onClick={() => navigate('/tasks')}>
          <ArrowLeftIcon />
          Go To Tasks
        </Button>
      </Card>
    );

  if (query.isError)
    return (
      <DetailCard
        variant="error"
        className="rounded-lg border-dashed border-destructive border"
      >
        <DetailCardHeader>
          <DetailCardMedia variant="icon">
            <TriangleAlertIcon />
          </DetailCardMedia>
          <DetailCardTitle>Failed To Load Task</DetailCardTitle>
          <DetailCardDescription>
            something wrong happened when loading task. {query.error.message}
          </DetailCardDescription>
        </DetailCardHeader>
        <DetailCardContent>
          <Button variant="outline" onClick={() => navigate('/tasks')}>
            <ArrowLeftIcon />
            Go To Tasks
          </Button>
          <Button variant="destructive" onClick={() => query.refetch()}>
            <RefreshCwIcon />
            Reload Task
          </Button>
        </DetailCardContent>
      </DetailCard>
    );

  return (
    <div>
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
            <h3 className="text-lg lg:text-3xl font-medium">
              {query.isLoading ? (
                <Skeleton className="h-lh w-50" />
              ) : (
                query.data?.title
              )}
            </h3>

            <div className="flex items-start justify-between">
              {query.isLoading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                query.isSuccess && (
                  <TaskStatusBadge completed={query.data.completed} />
                )
              )}
            </div>
          </div>
        </div>

        {query.isSuccess && (
          <TaskActionsDropdown
            task={query.data}
            showVisitTask={false}
            disabled={!query.isSuccess}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 lg:gap-2 mt-4 lg:mt-6">
        <div className="text-muted-foreground text-sm lg:text-base">
          {query.isLoading ? (
            <Skeleton className="h-lh w-60" />
          ) : (
            query.isSuccess && (
              <>
                Created{' '}
                {formatDistanceToNow(query.data.created_at, {
                  addSuffix: true,
                })}
              </>
            )
          )}
        </div>
        <div className="text-muted-foreground text-sm lg:text-base">
          {query.isLoading ? (
            <Skeleton className="h-lh w-60" />
          ) : (
            query.isSuccess && (
              <>
                Updated{' '}
                {formatDistanceToNow(query.data.updated_at, {
                  addSuffix: true,
                })}
              </>
            )
          )}
        </div>
      </div>

      <div className="mt-14">
        <h4 className="font-semibold">Description:</h4>
        {query.isLoading ? (
          <Count
            count={3}
            render={(idx) => (
              <Skeleton key={idx} className="h-lh w-full mb-2" />
            )}
          />
        ) : (
          query.isSuccess && (
            <p className="text-muted-foreground">{query.data.description}</p>
          )
        )}
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
