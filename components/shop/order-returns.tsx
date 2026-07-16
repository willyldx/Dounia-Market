import { RotateCcw } from 'lucide-react'
import type { OrderReturn } from '@/lib/types'
import { formatOrderDate } from '@/lib/orders'
import { cn } from '@/lib/utils'

function toneFor(status: OrderReturn['status']): string {
  switch (status) {
    case 'refunded':
    case 'approved':
      return 'bg-accent/10 text-accent'
    case 'refused':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

/** Status of return requests attached to an order. Renders nothing when there are none. */
export function OrderReturns({ returns }: { returns: OrderReturn[] }) {
  if (returns.length === 0) return null
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold">
        <RotateCcw className="h-4 w-4 text-primary" strokeWidth={1.75} />
        Retours
      </h2>
      <ul className="mt-4 space-y-3">
        {returns.map((r, idx) => {
          const date = formatOrderDate(r.createdAt)
          return (
            <li
              key={r.id ?? idx}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/40 p-4 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium">{r.reason || 'Demande de retour'}</p>
                {date && <p className="mt-0.5 text-xs text-muted-foreground">Demandé le {date}</p>}
              </div>
              <span
                className={cn(
                  'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                  toneFor(r.status),
                )}
              >
                {r.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
