import { createCTX } from '@/helpers';
import { cn } from 'cn';
import { useId, type ComponentProps } from 'react';

const { context: CardContext, hook: useCardContext } = createCTX<{
  titleId: string;
}>('Card');

const Card = ({ className, ...props }: ComponentProps<'div'>) => {
  const titleId = useId();
  return (
    <CardContext value={{ titleId }}>
      <div
        aria-labelledby={titleId}
        className={cn('border rounded-lg p-4 flex flex-col gap-4', className)}
        {...props}
      />
    </CardContext>
  );
};

const CardTitle = ({ className, ...props }: ComponentProps<'h4'>) => {
  const { titleId } = useCardContext();
  return (
    <h4
      id={titleId}
      className={cn('text-base md:text-lg lg:text-xl font-semibold', className)}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('', className)} {...props} />;
};

export { Card, CardContent, CardTitle };
