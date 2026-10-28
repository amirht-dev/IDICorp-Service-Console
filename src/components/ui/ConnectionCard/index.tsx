import { cn } from 'cn';
import { Separator } from '../Separator';

type ConnectionCardProps = {
  className?: string;
  status: 'pending' | 'success' | 'failed';
  url: string;
};

const s = {
  pending: {
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    text: 'Connecting',
  },
  failed: { dotClass: 'bg-error', textClass: 'text-error', text: 'Failed' },
  success: {
    dotClass: 'bg-success',
    textClass: 'text-success',
    text: 'Connected',
  },
} satisfies Record<
  ConnectionCardProps['status'],
  { dotClass: string; textClass: string; text: string }
>;

function ConnectionCard({ url, status, className }: ConnectionCardProps) {
  const { dotClass, textClass, text } = s[status];
  return (
    <div className={cn('p-4 border rounded-md', className)}>
      <h5 className="text-lg font-medium">Connection</h5>

      <div className="flex gap-3 mt-4 items-center">
        <div className={'flex items-center gap-2 text-sm'}>
          <div className={cn('size-2 rounded-full', dotClass)} />
          <span className={cn(textClass)}>{text}</span>
        </div>
        <Separator orientation="vertical" />
        <span className="text-muted-foreground text-xs">{url}</span>
      </div>
    </div>
  );
}

export default ConnectionCard;
