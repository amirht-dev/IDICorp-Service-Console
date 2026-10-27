import NavigationDrawer from '@/components/shared/NavigationDrawer';
import { Button } from '@/components/ui/Button';
import { demoTasks } from '@/data/demo';
import SearchInput from '@/features/tasks/components/SearchInput';
import { PlusIcon } from 'lucide-react';
import CreateTaskDialog from '../CreateTaskDialog';
import EmptyTasksCard from '../EmptyTasksCard';
import FailedLoadTasksCard from '../FailedLoadTasksCard';
import TasksList from '../TaskList';

const TasksPage = () => {
  const isError = false;
  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-semibold">Tasks</h4>

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
          <NavigationDrawer />
        </div>
      </div>

      <div className="mt-6">
        {isError ? (
          <FailedLoadTasksCard />
        ) : !demoTasks.length ? (
          <EmptyTasksCard type="all" />
        ) : (
          <>
            <SearchInput
              className="max-w-md"
              onDebounceChange={(value) => console.log('search: ', value)}
            />

            <TasksList tasks={demoTasks} />
          </>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
