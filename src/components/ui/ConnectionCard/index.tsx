import { cn } from 'cn';
import { ReadyState } from 'react-use-websocket';
import { Card, CardContent, CardTitle } from '../Card';
import { Separator } from '../Separator';

type ConnectionCardProps = {
  className?: string;
  readyState: ReadyState;
  url: string;
};

const readyStateMap = {
  [ReadyState.UNINSTANTIATED]: {
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    text: 'Un instantiated',
  },
  [ReadyState.CONNECTING]: {
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    text: 'Connecting',
  },
  [ReadyState.OPEN]: {
    dotClass: 'bg-success',
    textClass: 'text-success',
    text: 'Connected',
  },
  [ReadyState.CLOSING]: {
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    text: 'Disconnecting',
  },
  [ReadyState.CLOSED]: {
    dotClass: 'bg-error',
    textClass: 'text-error',
    text: 'Disconnected',
  },
} satisfies Record<
  ReadyState,
  { dotClass: string; textClass: string; text: string }
>;

function ConnectionCard({ url, readyState, className }: ConnectionCardProps) {
  const { dotClass, textClass, text } = readyStateMap[readyState];
  return (
    <Card className={className}>
      <CardTitle>Connection</CardTitle>

      <CardContent className="flex gap-3 items-center">
        <div className={'flex items-center gap-2 text-sm'}>
          <div className={cn('size-2 rounded-full', dotClass)} />
          <span className={cn(textClass)}>{text}</span>
        </div>
        <Separator orientation="vertical" />
        <span className="text-muted-foreground text-xs">{url}</span>
      </CardContent>
    </Card>
  );
}

export default ConnectionCard;
