import { Ban, CheckCircle2, Circle, Package, PackageSearch, Truck } from 'lucide-react'
import type { CustomerOrder } from '@/lib/types'
import { buildTimeline, formatOrderDate } from '@/lib/orders'
import { cn } from '@/lib/utils'

const STEP_ICONS = {
  received: Package,
  preparing: PackageSearch,
  shipping: Truck,
  delivered: CheckCircle2,
} as const

/** Vertical delivery timeline; shows a cancelled notice instead when the order is cancelled. */
export function OrderTimeline({ order }: { order: CustomerOrder }) {
  if (order.status.key === 'cancelled') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-destructive/5 p-4">
        <Ban className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={1.75} />
        <div>
          <p className="text-sm font-semibold text-destructive">Commande annulée</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette commande a été annulée. Contactez-nous si vous avez une question.
          </p>
        </div>
      </div>
    )
  }

  const steps = buildTimeline(order)

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const Icon = STEP_ICONS[step.key as keyof typeof STEP_ICONS] ?? Package
        const date = formatOrderDate(step.date)
        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className={cn(
                  'absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5',
                  step.done ? 'bg-primary' : 'bg-border',
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                step.done && 'border-primary bg-primary text-primary-foreground',
                step.active && 'border-accent bg-accent text-accent-foreground',
                !step.done && !step.active && 'border-border bg-card text-muted-foreground',
              )}
            >
              {step.done ? (
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              ) : step.active ? (
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Circle className="h-3 w-3" strokeWidth={1.75} />
              )}
            </span>
            <div className="pt-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  step.done || step.active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
                {step.active && <span className="sr-only"> (étape actuelle)</span>}
              </p>
              {date && <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
