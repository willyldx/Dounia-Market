'use client'

import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  MapPin,
  Package,
  PackageSearch,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type OrderStatus = Record<string, any> | null

const STEPS = [
  { key: 'pending', label: 'Commande reçue', icon: Package },
  { key: 'preparing', label: 'En préparation', icon: PackageSearch },
  { key: 'shipping', label: 'En cours de livraison', icon: Truck },
  { key: 'delivered', label: 'Livrée', icon: CheckCircle2 },
]

// Map various backend status strings to a step index.
function statusToIndex(status?: string): number {
  const s = (status || '').toLowerCase()
  if (/(deliver|livr|complet|termin)/.test(s)) return 3
  if (/(ship|transit|cours|route|en_livraison|out_for)/.test(s)) return 2
  if (/(prepar|process|en_cours|confirm|paid|pay)/.test(s)) return 1
  return 0
}

function statusLabel(status?: string): string {
  const s = (status || '').toLowerCase()
  if (/(deliver|livr)/.test(s)) return 'Livrée'
  if (/(ship|transit|cours|route|out_for)/.test(s)) return 'En cours de livraison'
  if (/(prepar|process)/.test(s)) return 'En préparation'
  if (/(cancel|annul)/.test(s)) return 'Annulée'
  if (/(pending|recu|reçu|paid|pay|confirm)/.test(s)) return 'Commande reçue'
  return status || 'Statut inconnu'
}

export default function SuiviPage() {
  const [reference, setReference] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [order, setOrder] = useState<OrderStatus>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ref = reference.trim()
    if (!ref) return
    setState('loading')
    setOrder(null)
    try {
      const res = await fetch(`/api/order-status/${encodeURIComponent(ref)}`)
      if (res.status === 404) {
        setState('notfound')
        return
      }
      if (!res.ok) {
        setState('error')
        return
      }
      const data = await res.json().catch(() => null)
      setOrder(data && (data.order ?? data))
      setState('found')
    } catch {
      setState('error')
    }
  }

  const rawStatus: string | undefined = order?.status ?? order?.state ?? order?.fulfillment_status
  const currentIndex = statusToIndex(rawStatus)
  const items: any[] = Array.isArray(order?.items)
    ? order.items
    : Array.isArray(order?.line_items)
      ? order.line_items
      : []
  const recipient = order?.recipient ?? order?.recipient_name ?? order?.customer_name
  const city = order?.city ?? order?.address?.city ?? order?.recipient_city

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Suivre une commande</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saisissez votre référence de commande pour connaître son statut en temps réel.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Label htmlFor="reference" className="text-sm font-medium">
            Référence de commande
          </Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex : DM-2026-00123"
              autoComplete="off"
              className="h-11"
            />
            <Button type="submit" disabled={state === 'loading' || !reference.trim()} className="h-11 sm:px-6">
              {state === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  Recherche
                </>
              ) : (
                'Suivre'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          {state === 'notfound' && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={1.75} />
              <div>
                <p className="font-semibold">Commande introuvable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vérifiez la référence saisie. Elle figure dans votre e-mail de confirmation.
                </p>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={1.75} />
              <div>
                <p className="font-semibold">Une erreur est survenue</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Impossible de récupérer le statut pour le moment. Réessayez dans un instant.
                </p>
              </div>
            </div>
          )}

          {state === 'found' && order && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Référence
                    </p>
                    <p className="font-display text-lg font-semibold">
                      {order.reference ?? order.id ?? reference.trim()}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {statusLabel(rawStatus)}
                  </span>
                </div>

                {(recipient || city) && (
                  <div className="mt-5 flex items-start gap-3 border-t border-border pt-5 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                    <p className="text-muted-foreground">
                      {recipient && <span className="font-medium text-foreground">{recipient}</span>}
                      {recipient && city && ' - '}
                      {city}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <ol className="mt-6 space-y-0">
                  {STEPS.map((step, i) => {
                    const done = i < currentIndex
                    const active = i === currentIndex
                    const Icon = step.icon
                    return (
                      <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                        {i < STEPS.length - 1 && (
                          <span
                            className={cn(
                              'absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5',
                              done ? 'bg-primary' : 'bg-border',
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                            done && 'border-primary bg-primary text-primary-foreground',
                            active && 'border-accent bg-accent text-accent-foreground',
                            !done && !active && 'border-border bg-card text-muted-foreground',
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                          ) : active ? (
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          ) : (
                            <Circle className="h-3 w-3" strokeWidth={1.75} />
                          )}
                        </span>
                        <div className="pt-1">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              active ? 'text-foreground' : done ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {step.label}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>

              {items.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="font-display text-base font-semibold">Articles</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span className="font-medium">{it.title ?? it.name ?? it.product_title ?? 'Article'}</span>
                        {(it.quantity ?? it.qty) != null && (
                          <span className="shrink-0 text-muted-foreground">x{it.quantity ?? it.qty}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
