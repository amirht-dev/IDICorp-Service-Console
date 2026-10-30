import PageHeading from '@/components/shared/PageHeading';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { PlusIcon } from 'lucide-react';
import CreateTaskDialog from '../CreateTaskDialog';
import TasksList from '../TaskList';

const TasksPage = () => {
  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <PageHeading>Tasks</PageHeading>

        <div className="flex gap-2">
          <CreateTaskDialog
            trigger={[
              <Button size="icon" className="lg:hidden">
                <PlusIcon />
              </Button>,
              <Button size="lg" className="max-lg:hidden">
                <PlusIcon />
                Create New Task
              </Button>,
            ]}
          />
        </div>
      </div>

      <Card className="border-warning text-warning bg-warning/10 text-sm mt-4">
        <CardContent>
          <p>
            Based on the Redis implementation on the server, each task expires{' '}
            <b>one hour</b> after it is created or last updated.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <TasksList />
      </div>
    </div>
  );
};

export default TasksPage;
