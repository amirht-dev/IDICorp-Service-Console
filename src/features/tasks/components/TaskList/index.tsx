import Count from '@/components/helpers/Count';
import { useState } from 'react';
import { type StatusTabs } from '../../constants';
import useTasksQuery from '../../hooks/useTasksQuery';
import EmptyTasksCard from '../EmptyTasksCard';
import FailedLoadTasksCard from '../FailedLoadTasksCard';
import SearchInput from '../SearchInput';
import { TaskCard, TaskCardSkeleton } from '../TaskCard';
import type { DateSort, SortOrder } from './index.types';
import SortDropdown from './SortDropdown';
import StatusFilterTabs from './StatusFilterTabs';

function TasksList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTabs>('all');
  const [dateSort, setDateSort] = useState<DateSort | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
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
        if (dateSort == null) return data;

        return data.toSorted((a, b) => {
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
    <div className="flex flex-col">
      <SearchInput
        className="max-w-md"
        onDebounceChange={setSearchTerm}
        disabled={isDisabled}
      />
      <div className="flex items-center justify-between mt-6">
        <StatusFilterTabs
          disabled={isDisabled}
          value={statusTab}
          onValueChange={setStatusTab}
        />

        <SortDropdown
          disabled={isDisabled}
          dateSort={dateSort}
          onDateSortChange={setDateSort}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {query.isLoading ? (
          <TasksSkeletonList />
        ) : query.isError ? (
          <FailedLoadTasksCard error={query.error} />
        ) : query.isSuccess ? (
          query.data.length ? (
            query.data.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <EmptyTasksCard
              type={isFiltering ? 'filter' : 'all'}
              kind={
                isFiltering ? (hasSearchTerm ? 'search' : 'status') : undefined
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
    </div>
  );
}

function TasksSkeletonList() {
  return <Count count={4} render={(idx) => <TaskCardSkeleton key={idx} />} />;
}

export default TasksList;
