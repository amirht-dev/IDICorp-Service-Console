import { cn } from 'cn';
import { type ComponentProps } from 'react';
import { Card, CardContent } from '../Card';

const AlertBox = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Card>) => {
  return (
    <Card
      className={cn(
        'text-sm bg-warning/10 text-warning border-warning',
        className,
      )}
      {...props}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AlertBox;
