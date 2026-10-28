import { cn } from 'cn';
import { type ComponentProps } from 'react';

const PageHeading = ({ className, ...props }: ComponentProps<'h4'>) => {
  return (
    <h4
      className={cn('text-2xl lg:text-3xl font-semibold', className)}
      {...props}
    />
  );
};

export default PageHeading;
