import React from 'react'
import { cn } from '@/lib/utils'

export function formatCurrency(amount: unknown, currency: string = 'XAF'): string {
  const v = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(v)) return '-'

  const curr = currency.toUpperCase()
  if (curr === 'XAF') {
    return `${new Intl.NumberFormat('fr-FR').format(Math.round(v))} FCFA`
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 2,
  }).format(v)
}

export function formatDate(value: unknown): string {
  if (!value) return '-'
  const d = new Date(value as string)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

const BADGE_STYLES: Record<string, string> = {
  // Product moderation
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  pending_review: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
  rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/25',
  draft: 'bg-slate-500/10 text-slate-600 border-slate-500/25',
  // Order statuses
  paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  processing: 'bg-blue-500/10 text-blue-600 border-blue-500/25',
  shipped: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/25',
  delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/25',
  // KYC statuses
  verified: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  unverified: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
}

const BADGE_LABELS: Record<string, string> = {
  approved: 'Approuvé',
  active: 'Actif en ligne',
  pending_review: 'En examen',
  pending: 'En attente',
  rejected: 'Rejeté',
  draft: 'Brouillon',
  paid: 'Payée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  verified: 'KYC Vérifié',
  unverified: 'KYC En attente',
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = (status || '').toLowerCase()
  const style = BADGE_STYLES[normalized] || 'bg-secondary text-secondary-foreground border-border'
  const label = BADGE_LABELS[normalized] || status

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        style,
      )}
    >
      {label}
    </span>
  )
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-secondary/60" />
      ))}
    </div>
  )
}
