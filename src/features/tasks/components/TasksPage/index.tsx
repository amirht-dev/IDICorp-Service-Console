import PageHeading from '@/components/shared/PageHeading';
import AlertBox from '@/components/ui/AlertBox';
import { Button } from '@/components/ui/Button';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { PlusIcon } from 'lucide-react';
import CreateTaskDialog from '../CreateTaskDialog';
import TasksList from '../TaskList';

const TasksPage = () => {
  useDocumentTitle('Tasks');
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

      <AlertBox className="mt-4">
        <p>
          Based on the Redis implementation on the server, each task expires{' '}
          <b>one hour</b> after it is created or last updated.
        </p>
      </AlertBox>

      <div className="mt-6">
        <TasksList />
      </div>
    </div>
  );
};

export default TasksPage;
