import { Bubble, BubbleContent } from '@/components/ui/Bubble';
import { Separator } from '@/components/ui/Separator';
import { cn } from 'cn';
import { BotIcon, UserIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

type Message = {
  content: string;
  sender: boolean;
};

type EchoMessagesListProps = {
  messages: Message[];
};

const EchoMessagesList = ({ messages }: EchoMessagesListProps) => {
  return (
    <div className="flex w-full mx-auto flex-col p-4 rounded-lg gap-4 lg:gap-8 border">
      <h4 className="text-xl font-medium">Messages</h4>
      <Separator />
      <div className="flex flex-col gap-2">
        {messages.map((msg, idx) => (
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
            <BubbleContent>{msg.content}</BubbleContent>
            {msg.sender && (
              <IconAvatar>
                <UserIcon />
              </IconAvatar>
            )}
          </Bubble>
        ))}
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

export default EchoMessagesList;
