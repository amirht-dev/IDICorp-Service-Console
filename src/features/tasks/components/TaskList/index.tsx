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
import { useState } from 'react';
import { statusTabs, type StatusTabs } from '../../constants';
import useTasksQuery from '../../hooks/useTasksQuery';
import EmptyTasksCard from '../EmptyTasksCard';
import FailedLoadTasksCard from '../FailedLoadTasksCard';
import SearchInput from '../SearchInput';
import { TaskCard, TaskCardSkeleton } from '../TaskCard';

function TasksList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTabs>('all');
  const [dateSort, setDateSort] = useState<'created' | 'updated' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'dsc' | null>(null);
  const query = useTasksQuery(
    {
      completed:
        statusTab === 'active'
          ? false
          : statusTab === 'completed'
            ? true
            : undefined,
      q: searchTerm || undefined,
    },
    {
      select(data) {
        const newData = data.map((task, idx) => ({
          ...task,
          created_at: new Date(2010 + idx, 1, 1),
          updated_at: new Date(2010 + idx, 1, 1),
        }));

        if (dateSort == null) return newData;

        return newData.toSorted((a, b) => {
          const targetA = dateSort === 'created' ? a.created_at : a.updated_at;
          const targetB = dateSort === 'created' ? b.created_at : b.updated_at;

          return (
            Math.sign(targetA.getTime() - targetB.getTime()) *
            (sortOrder === 'asc' ? 1 : -1)
          );
        });
      },
    },
  );

  const hasSearchTerm = !!searchTerm;
  const hasStatus = statusTab !== 'all';

  const isFiltering = hasSearchTerm || hasStatus;

  const isDisabled = query.isLoading || query.isError;

  return (
    <div className="flex flex-col gap-6">
      <SearchInput
        className="max-w-md"
        onDebounceChange={setSearchTerm}
        disabled={isDisabled}
      />
      <Tabs value={statusTab} onValueChange={setStatusTab}>
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
          {query.isLoading ? (
            <Count count={4} render={(idx) => <TaskCardSkeleton key={idx} />} />
          ) : query.isError ? (
            <FailedLoadTasksCard message={query.error.message} />
          ) : query.isSuccess ? (
            query.data.length ? (
              query.data.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <EmptyTasksCard
                type={isFiltering ? 'filter' : 'all'}
                kind={
                  isFiltering
                    ? hasSearchTerm
                      ? 'search'
                      : 'status'
                    : undefined
                }
                value={
                  isFiltering
                    ? hasSearchTerm
                      ? searchTerm
                      : statusTab
                    : undefined
                }
              />
            )
          ) : null}
        </div>
      </Tabs>
    </div>
  );
}

export default TasksList;
