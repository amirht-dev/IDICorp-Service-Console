import { Bubble, BubbleContent } from '@/components/ui/Bubble';
import {
  DetailCard,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
} from '@/components/ui/DetailCard';
import { Separator } from '@/components/ui/Separator';
import { cn } from 'cn';
import { BotIcon, MessageSquareXIcon, UserIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { MessageType } from '../../types';

type EchoMessagesListProps = {
  messages: MessageType[];
};

const EchoMessagesList = ({ messages }: EchoMessagesListProps) => {
  return (
    <div className="flex w-full mx-auto flex-col p-4 rounded-lg gap-4 lg:gap-8 border">
      <h4 className="text-xl font-medium">Messages</h4>
      <Separator />
      <div className="flex flex-col gap-2">
        {!messages.length ? (
          <EmptyTasksCard />
        ) : (
          messages.map((msg, idx) => (
            <Bubble
              align={msg.sender ? 'end' : 'start'}
              className="flex flex-row gap-2"
              key={idx}
              variant={msg.sender ? 'default' : 'secondary'}
            >
              {!msg.sender && (
                <IconAvatar>
                  <BotIcon />
                </IconAvatar>
              )}
              <BubbleContent>{msg.message}</BubbleContent>
              {msg.sender && (
                <IconAvatar>
                  <UserIcon />
                </IconAvatar>
              )}
            </Bubble>
          ))
        )}
      </div>
    </div>
  );
};

function IconAvatar({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center size-10 bg-secondary rounded-full **:[svg]:size-5 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

const EmptyTasksCard = () => {
  return (
    <DetailCard className="border border-dashed">
      <DetailCardHeader>
        <DetailCardMedia variant="icon">
          <MessageSquareXIcon />
        </DetailCardMedia>
        <DetailCardTitle>No Messages send Yet</DetailCardTitle>
        <DetailCardDescription>Try send a new message</DetailCardDescription>
      </DetailCardHeader>
    </DetailCard>
  );
};

export default EchoMessagesList;
