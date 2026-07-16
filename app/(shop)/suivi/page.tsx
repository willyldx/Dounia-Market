'use client'

import { useState } from 'react'
import { AlertCircle, Loader2, MapPin } from 'lucide-react'
import type { CustomerOrder } from '@/lib/types'
import { trackOrder } from '@/lib/orders'
import { OrderStatusBadge } from '@/components/shop/order-status-badge'
import { OrderTimeline } from '@/components/shop/order-timeline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SuiviPage() {
  const [reference, setReference] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [order, setOrder] = useState<CustomerOrder | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ref = reference.trim()
    if (!ref) return
    setState('loading')
    setOrder(null)
    try {
      const found = await trackOrder(ref)
      if (!found) {
        setState('notfound')
        return
      }
      setOrder(found)
      setState('found')
    } catch {
      setState('error')
    }
  }

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

        <div className="mt-6" aria-live="polite">
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
                      {order.reference || reference.trim()}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {(order.recipient || order.city) && (
                  <div className="mt-5 flex items-start gap-3 border-t border-border pt-5 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                    <p className="text-muted-foreground">
                      {order.recipient && <span className="font-medium text-foreground">{order.recipient}</span>}
                      {order.recipient && order.city && ' - '}
                      {order.city}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <OrderTimeline order={order} />
                </div>
              </div>

              {order.items.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="font-display text-base font-semibold">Articles</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {order.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span className="font-medium">
                          {it.title}
                          {it.variantTitle && (
                            <span className="text-muted-foreground"> — {it.variantTitle}</span>
                          )}
                        </span>
                        <span className="shrink-0 text-muted-foreground">x{it.quantity}</span>
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
