import { cn } from '@/lib/utils'

export function formatMoney(n: unknown): string {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return '-'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
}

export function formatDate(value: unknown): string {
  if (!value) return '-'
  const d = new Date(value as string)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-success/12 text-success border-success/25',
  delivered: 'bg-success/12 text-success border-success/25',
  pending: 'bg-accent/15 text-accent border-accent/30',
  processing: 'bg-accent/15 text-accent border-accent/30',
  in_transit: 'bg-accent/15 text-accent border-accent/30',
  cancelled: 'bg-destructive/12 text-destructive border-destructive/25',
  failed: 'bg-destructive/12 text-destructive border-destructive/25',
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Payée',
  pending: 'En attente',
  processing: 'En préparation',
  in_transit: 'En route',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  failed: 'Échec',
  fulfilled: 'Expédiée',
  unfulfilled: 'À préparer',
}

export function StatusBadge({ status }: { status?: string }) {
  const key = String(status || '').toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[key] || 'border-border bg-secondary text-secondary-foreground',
      )}
    >
      {STATUS_LABELS[key] || status || '-'}
    </span>
  )
}

export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-secondary/60" />
      ))}
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}
