import PageHeading from '@/components/shared/PageHeading';
import { Button } from '@/components/ui/Button';
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

      <div className="mt-6">
        <TasksList />
      </div>
    </div>
  );
};

export default TasksPage;
