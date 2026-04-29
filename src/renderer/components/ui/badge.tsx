import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[color-mix(in_oklch,var(--accent)_40%,var(--divider))] bg-[var(--success-surface)] text-[var(--accent-strong)]',
        info: 'border-[color-mix(in_oklch,var(--info)_40%,var(--divider))] bg-[var(--info-surface)] text-[var(--info)]',
        warning: 'border-[color-mix(in_oklch,var(--warning)_40%,var(--divider))] bg-[var(--warning-surface)] text-[var(--warning)]',
        danger: 'border-[color-mix(in_oklch,var(--danger)_44%,var(--divider))] bg-[var(--danger-surface)] text-[var(--danger)]',
        outline: 'border-[var(--divider)] bg-transparent text-[var(--ink-secondary)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
