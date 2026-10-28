import { cn } from 'cn';
import type { ComponentProps } from 'react';

type TagProps = ComponentProps<'span'>;

function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex gap-1 items-center rounded-sm h-6 px-2 text-sm bg bg-secondary **:[svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export default Tag;
