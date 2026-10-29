import { Button } from '@/components/ui/Button';
import {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { cn } from 'cn';
import { TriangleAlertIcon } from 'lucide-react';

type CaptchaErrorCardProps = {
  message?: string;
  onReload?: () => void;
  className?: string;
};

const CaptchaErrorCard = ({
  message,
  onReload,
  className,
}: CaptchaErrorCardProps) => {
  return (
    <DetailCard
      className={cn('border border-dashed', className)}
      variant="error"
    >
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          <TriangleAlertIcon />
        </DetailCardMedia>
        <DetailCardTitle>Failed to load captcha</DetailCardTitle>
        {message && <DetailCardDescription>{message}</DetailCardDescription>}
      </DetailCardHeader>
      <DetailCardContent>
        <Button variant="destructive" onClick={() => onReload?.()}>
          Reload
        </Button>
      </DetailCardContent>
    </DetailCard>
  );
};

export default CaptchaErrorCard;
