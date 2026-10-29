import { Button } from '@/components/ui/Button';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { CheckIcon, PlusIcon, SearchIcon } from 'lucide-react';
import CreateTaskDialog from '../CreateTaskDialog';
import type { ReactNode } from 'react';

type EmptyTasksCardProps = {
  type: 'all' | 'filter';
  kind?: 'search' | 'status';
  value?: ReactNode;
};

const EmptyTasksCard = ({ type, kind, value }: EmptyTasksCardProps) => {
  return (
    <DetailCard className="border border-dashed">
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          {type === 'all' && <CheckIcon />}
          {type === 'filter' && <SearchIcon />}
        </DetailCardMedia>
        <DetailCardTitle>
          {type === 'all' && 'No Tasks Yet'}
          {type === 'filter' && 'No Tasks Found'}
        </DetailCardTitle>
        <DetailCardDescription>
          {type === 'all' && 'Try Add new tasks to your list'}
          {type === 'filter' && kind === 'search' && (
            <>
              no tasks found with term <i>"{value}"</i>
            </>
          )}
          {type === 'filter' && kind === 'status' && `no ${value} tasks found`}
        </DetailCardDescription>
      </DetailCardHeader>
      <DetailCardContent>
        {type === 'all' && (
          <CreateTaskDialog
            trigger={
              <Button size="lg">
                <PlusIcon />
                Create New Task
              </Button>
            }
          />
        )}
      </DetailCardContent>
    </DetailCard>
  );
};

export default EmptyTasksCard;
