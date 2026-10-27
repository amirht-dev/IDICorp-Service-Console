import Count from '@/components/helpers/Count';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ListSortAscendingIcon, ListSortDescendingIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ValueOf } from 'type-fest';
import EmptyTasksCard from '../EmptyTasksCard';
import { TaskCard, TaskCardSkeleton } from '../TaskCard';

const statusTabs = {
  all: { label: 'All Tasks', value: 'all' },
  active: { label: 'Active', value: 'active' },
  completed: { label: 'Completed', value: 'completed' },
} as const;

type StatusTabs = ValueOf<typeof statusTabs>['value'];

type TaskModel = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TasksListProps = { tasks: TaskModel[]; loading?: boolean };

function TasksList({ tasks, loading }: TasksListProps) {
  const [statusTab, setStatusTab] = useState<StatusTabs>('all');
  const [dateSort, setDateSort] = useState<'created' | 'updated' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'dsc' | null>(null);

  const isTasksEmpty = !tasks.length;

  const isDisabled = loading || isTasksEmpty;

  const filteredTasks = useMemo(() => {
    if (statusTab === 'all') return tasks;
    else if (statusTab === 'completed')
      return tasks.filter((task) => task.completed);
    else return tasks.filter((task) => !task.completed);
  }, [statusTab, tasks]);

  const sortedTasks = useMemo(() => {
    let sortedTasks = filteredTasks;

    if (dateSort != null) {
      sortedTasks = sortedTasks.sort((a, b) => {
        const targetA = dateSort === 'created' ? a.createdAt : a.updatedAt;
        const targetB = dateSort === 'created' ? b.createdAt : b.updatedAt;

        return (
          Math.sign(targetA.getTime() - targetB.getTime()) *
          (sortOrder === 'asc' ? 1 : -1)
        );
      });
    }

    return sortedTasks;
  }, [filteredTasks, dateSort, sortOrder]);
  return (
    <Tabs
      defaultValue={statusTab}
      onValueChange={setStatusTab}
      className="mt-6"
    >
      <div className="flex items-center justify-between">
        <TabsList aria-disabled={isDisabled}>
          {Object.values(statusTabs).map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              disabled={isDisabled}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex gap-2">
          <DropdownMenu disabled={isDisabled}>
            <DropdownMenuTrigger
              render={<Button variant="outline">Sort</Button>}
            />
            <DropdownMenuContent className="min-w-[160px]" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>By Date</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={dateSort}
                  onValueChange={setDateSort}
                >
                  <DropdownMenuRadioItem value="created">
                    Date Created
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="updated">
                    Date Updated
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sortOrder}
                  onValueChange={setSortOrder}
                  disabled={dateSort === null}
                >
                  <DropdownMenuRadioItem value="asc">
                    <ListSortAscendingIcon />
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dsc">
                    <ListSortDescendingIcon />
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {loading ? (
          <Count count={4} render={(idx) => <TaskCardSkeleton key={idx} />} />
        ) : isTasksEmpty ? (
          <EmptyTasksCard type="all" />
        ) : !filteredTasks.length ? (
          <EmptyTasksCard
            type={statusTab === 'active' ? 'active' : 'completed'}
          />
        ) : (
          sortedTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </Tabs>
  );
}

export default TasksList;
