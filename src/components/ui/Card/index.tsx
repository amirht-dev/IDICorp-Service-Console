import { cn } from 'cn';
import { type ComponentProps } from 'react';

const Card = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('border rounded-lg p-4 flex flex-col gap-4', className)}
      {...props}
    />
  );
};

const CardTitle = ({ className, ...props }: ComponentProps<'h4'>) => {
  return (
    <h4
      className={cn('text-base md:text-lg lg:text-xl font-semibold', className)}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('', className)} {...props} />;
};

export { Card, CardTitle, CardContent };
