import type { OrderStatusInfo } from '@/lib/types'
import { cn } from '@/lib/utils'

export function OrderStatusBadge({
  status,
  size = 'md',
  className,
}: {
  status: OrderStatusInfo
  size?: 'sm' | 'md'
  className?: string
}) {
  const cancelled = status.key === 'cancelled'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        size === 'sm' ? 'gap-1.5 px-2.5 py-0.5 text-xs' : 'gap-2 px-3 py-1.5 text-sm',
        cancelled ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground',
        className,
      )}
    >
      <span
        className={cn(
          'rounded-full',
          size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
          cancelled ? 'bg-destructive' : 'bg-accent',
        )}
        aria-hidden
      />
      {status.label}
    </span>
  )
}
