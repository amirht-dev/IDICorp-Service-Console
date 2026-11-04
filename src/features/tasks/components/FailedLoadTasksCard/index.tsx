import { Button } from '@/components/ui/Button';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { handleApiError } from '@/lib/errors';
import { TriangleAlertIcon } from 'lucide-react';

const FailedLoadTasksCard = ({ error }: { error?: Error }) => {
  const err = handleApiError(error);
  return (
    <DetailCard className="border border-dashed" variant="error">
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          <TriangleAlertIcon />
        </DetailCardMedia>
        <DetailCardTitle>Failed to load tasks</DetailCardTitle>
        {err.type === 'http' && err.status >= 500 && (
          <DetailCardDescription>
            Server is unavailable right now. Please try again later
          </DetailCardDescription>
        )}
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
