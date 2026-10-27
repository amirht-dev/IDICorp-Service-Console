import { demoTasks } from '@/data/demo';
import SearchInput from '@/features/tasks/components/SearchInput';
import CreateTaskButton from '../CreateTaskButton';
import EmptyTasksCard from '../EmptyTasksCard';
import FailedLoadTasksCard from '../FailedLoadTasksCard';
import TasksList from '../TaskList';

const TasksPage = () => {
  const isError = false;
  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-semibold">Tasks</h4>

        <CreateTaskButton />
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
