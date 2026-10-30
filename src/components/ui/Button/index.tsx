import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ReactNode } from 'react';
import type { Merge } from 'type-fest';
import { Spinner } from '../Spinner';
import { buttonVariants } from './index.constants';

type ButtonProps = Merge<
  ButtonPrimitive.Props & VariantProps<typeof buttonVariants>,
  {
    loading?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
  }
>;

function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {startIcon}
      {children}
      {loading ? <Spinner /> : endIcon}
    </ButtonPrimitive>
  );
}

export { Button };
