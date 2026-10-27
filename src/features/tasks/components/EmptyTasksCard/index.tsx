import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { CheckIcon } from 'lucide-react';
import CreateTaskButton from '../CreateTaskButton';

type EmptyTasksCardProps = { type: 'all' | 'active' | 'completed' };

const EmptyTasksCard = ({ type }: EmptyTasksCardProps) => {
  return (
    <DetailCard className="border border-dashed">
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          <CheckIcon />
        </DetailCardMedia>
        <DetailCardTitle>
          {type === 'all' && 'No Tasks Yet'}
          {type === 'active' && 'No Active Tasks Yet'}
          {type === 'completed' && 'No Completed Tasks Yet'}
        </DetailCardTitle>
        <DetailCardDescription>
          {type === 'all' && 'Add new tasks to your list'}
          {type === 'active' && 'All task are completed.'}
          {type === 'completed' && 'Complete your tasks first'}
        </DetailCardDescription>
      </DetailCardHeader>
      <DetailCardContent>
        {type === 'all' && <CreateTaskButton />}
      </DetailCardContent>
    </DetailCard>
  );
};

export default EmptyTasksCard;
