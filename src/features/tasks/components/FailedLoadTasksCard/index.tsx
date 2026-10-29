import { Button } from '@/components/ui/Button';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { TriangleAlertIcon } from 'lucide-react';

const FailedLoadTasksCard = ({ message }: { message?: string }) => {
  return (
    <DetailCard className="border border-dashed" variant="error">
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          <TriangleAlertIcon />
        </DetailCardMedia>
        <DetailCardTitle>Failed to load tasks</DetailCardTitle>
        {message && <DetailCardDescription>{message}</DetailCardDescription>}
      </DetailCardHeader>
      <DetailCardContent>
        <Button variant="destructive" size="lg">
          Reload Tasks
        </Button>
      </DetailCardContent>
    </DetailCard>
  );
};

export default FailedLoadTasksCard;
