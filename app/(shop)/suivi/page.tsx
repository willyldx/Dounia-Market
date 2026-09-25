'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Ship,
  Truck,
} from 'lucide-react'
import type { CustomerOrder } from '@/lib/types'
import { trackOrder } from '@/lib/orders'
import { OrderStatusBadge } from '@/components/shop/order-status-badge'
import { OrderTimeline } from '@/components/shop/order-timeline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getOrderWhatsAppFollowupUrl } from '@/lib/whatsapp'

function SuiviContent() {
  const searchParams = useSearchParams()
  const initialRef = searchParams.get('reference') || searchParams.get('ref') || ''

  const [reference, setReference] = useState(initialRef)
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle')
  const [order, setOrder] = useState<CustomerOrder | null>(null)

  useEffect(() => {
    if (initialRef && initialRef.trim().length > 0) {
      setReference(initialRef)
      loadTracking(initialRef.trim())
    }
  }, [initialRef])

  async function loadTracking(ref: string) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ref = reference.trim()
    if (!ref) return
    await loadTracking(ref)
  }

  const fulfillment = order?.fulfillments?.[0] || null
  const shippingMethod = order?.shippingMethod || null

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Suivre une expédition</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Suivi en temps réel de votre commande : du fret international jusqu'à la remise en main propre à N'Djamena.
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
              placeholder="Ex : TCB-M1A2B3-XYZ ou DM-2026-001"
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
                  Vérifiez la référence saisie. Elle figure dans votre confirmation de commande.
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
              {/* Carte principale de commande */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Référence de commande
                    </p>
                    <p className="font-display text-lg font-semibold">
                      {order.reference || reference.trim()}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {(order.recipient || order.city) && (
                  <div className="mt-4 flex items-start gap-3 border-t border-border pt-4 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                    <p className="text-muted-foreground">
                      Destinataire :{' '}
                      {order.recipient && <span className="font-medium text-foreground">{order.recipient}</span>}
                      {order.recipient && order.city && ' - '}
                      {order.city}
                      {order.address && ` (${order.address})`}
                    </p>
                  </div>
                )}

                {/* Bloc transporteur & logistique internationale */}
                {(fulfillment || shippingMethod) && (
                  <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        {fulfillment?.shipping_type === 'cross_border_air' || shippingMethod?.shipping_type === 'cross_border_air' ? (
                          <>
                            <Plane className="h-4 w-4 text-primary" />
                            Fret Aérien Express (Diaspora France 🇫🇷)
                          </>
                        ) : fulfillment?.shipping_type === 'cross_border_sea' || shippingMethod?.shipping_type === 'cross_border_sea' ? (
                          <>
                            <Ship className="h-4 w-4 text-amber-600" />
                            Fret Maritime & Cargo (Europe / Canada 🇪🇺 🇨🇦)
                          </>
                        ) : (
                          <>
                            <Truck className="h-4 w-4 text-emerald-600" />
                            Livraison Urbaine N'Djamena 🇹🇩
                          </>
                        )}
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-xs">
                        {fulfillment?.status === 'customs_cleared'
                          ? 'Dédouané'
                          : fulfillment?.status === 'dispatched'
                          ? 'En transit international'
                          : fulfillment?.status === 'delivered'
                          ? 'Livré'
                          : 'Pris en charge'}
                      </Badge>
                    </div>

                    {fulfillment?.tracking_reference && (
                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                        <span className="text-muted-foreground">
                          N° de suivi transporteur : <strong className="font-mono text-foreground">{fulfillment.tracking_reference}</strong>
                        </span>
                        {fulfillment.tracking_url_template && (
                          <a
                            href={fulfillment.tracking_url_template.replace('{tracking_reference}', fulfillment.tracking_reference)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            Suivre sur le site transporteur
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <OrderTimeline order={order} />
                </div>

                {/* Bloc WhatsApp direct pour cette commande */}
                <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Besoin d'un point en direct sur ce colis ?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Contactez directement notre cellule logistique WhatsApp à N'Djamena.
                        </p>
                      </div>
                    </div>

                    <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 shrink-0">
                      <a
                        href={getOrderWhatsAppFollowupUrl(order.reference || reference, order.recipient)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Écrire sur WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Articles de la commande */}
              {order.items.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h2 className="font-display text-base font-semibold">Articles commandés</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {order.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span className="font-medium">
                          {it.title}
                          {it.variantTitle && (
                            <span className="text-muted-foreground"> ({it.variantTitle})</span>
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

export default function SuiviPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" strokeWidth={1.75} />
        </div>
      }
    >
      <SuiviContent />
    </Suspense>
  )
}
