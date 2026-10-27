import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { createContext } from 'react';
import type { Merge } from 'type-fest';

type DetailCardVariant = 'default' | 'error';

const DetailCardContext = createContext<{
  variant: DetailCardVariant;
}>({
  variant: 'default',
});

function DetailCard({
  variant = 'default',
  className,
  ...props
}: Merge<React.ComponentProps<'div'>, { variant?: DetailCardVariant }>) {
  return (
    <DetailCardContext value={{ variant }}>
      <div
        data-slot="detail-card"
        data-variant={variant}
        className={cn(
          'group/detail-card flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance',
          variant === 'error' && 'border-destructive',
          className,
        )}
        {...props}
      />
    </DetailCardContext>
  );
}

function DetailCardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="detail-card-header"
      className={cn('flex max-w-sm flex-col items-center gap-2', className)}
      {...props}
    />
  );
}

const detailCardMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg group-data-[variant=error]/detail-card:bg-destructive/10 group-data-[variant=error]/detail-card:text-destructive bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function DetailCardMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof detailCardMediaVariants>) {
  return (
    <div
      data-slot="detail-card-icon"
      data-variant={variant}
      className={cn(detailCardMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function DetailCardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="detail-card-title"
      className={cn(
        'cn-font-heading text-sm font-medium tracking-tight group-data-[variant=error]/detail-card:text-destructive',
        className,
      )}
      {...props}
    />
  );
}

function DetailCardDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="detail-card-description"
      className={cn(
        'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary group-data-[variant=error]/detail-card:text-destructive/80',
        className,
      )}
      {...props}
    />
  );
}

function DetailCardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="detail-card-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance',
        className,
      )}
      {...props}
    />
  );
}

export {
  DetailCard,
  DetailCardContent,
  DetailCardDescription,
  DetailCardHeader,
  DetailCardMedia,
  DetailCardTitle,
};
