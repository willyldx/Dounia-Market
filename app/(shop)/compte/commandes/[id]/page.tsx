'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Package, Truck } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import type { CustomerOrder } from '@/lib/types'
import { formatOrderDate, getMyOrder } from '@/lib/orders'
import { useCart } from '@/stores/cart'
import { OrderStatusBadge } from '@/components/shop/order-status-badge'
import { OrderTimeline } from '@/components/shop/order-timeline'
import { OrderReturns } from '@/components/shop/order-returns'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const token = useAuth((s) => s.token)
  const authStatus = useAuth((s) => s.status)
  const format = useCart((s) => s.format)

  const [order, setOrder] = useState<CustomerOrder | null>(null)
  const [fetchState, setFetchState] = useState<'loading' | 'ready' | 'error'>('loading')

  const authResolved = authStatus !== 'idle' && authStatus !== 'loading'
  // A resolved-but-unauthenticated session is an error we can derive during
  // render, so the effect never has to set state synchronously.
  const state: 'loading' | 'ready' | 'error' = !authResolved ? 'loading' : !token ? 'error' : fetchState

  useEffect(() => {
    if (!authResolved || !token) return
    let active = true
    getMyOrder(token, id)
      .then((res) => {
        if (!active) return
        setOrder(res)
        setFetchState('ready')
      })
      .catch(() => {
        if (active) setFetchState('error')
      })
    return () => {
      active = false
    }
  }, [token, id, authResolved])

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/compte/commandes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Mes commandes
        </Link>

        {state === 'loading' ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : state === 'error' || !order ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="font-semibold">Commande introuvable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Impossible d'afficher cette commande. Vérifiez la référence.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/compte/commandes">Retour aux commandes</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Commande {order.reference || id}
                </h1>
                {formatOrderDate(order.createdAt) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Passée le {formatOrderDate(order.createdAt)}
                  </p>
                )}
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                <Truck className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Suivi de livraison
              </h2>
              <div className="mt-5">
                <OrderTimeline order={order} />
              </div>
            </div>

            {(order.recipient || order.address || order.city) && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  Livraison
                </h2>
                <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                  {order.recipient && <p className="font-medium text-foreground">{order.recipient}</p>}
                  {order.phone && <p>{order.phone}</p>}
                  {(order.address || order.city) && (
                    <p>{[order.address, order.city].filter(Boolean).join(', ')}</p>
                  )}
                  {order.deliveryInstructions && <p className="italic">{order.deliveryInstructions}</p>}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                <Package className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Articles
              </h2>
              {order.items.length > 0 ? (
                <ul className="mt-4 divide-y divide-border">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {it.title}
                          {it.variantTitle && (
                            <span className="text-muted-foreground"> — {it.variantTitle}</span>
                          )}
                        </p>
                        <p className="text-muted-foreground">Quantité : {it.quantity}</p>
                      </div>
                      {it.price != null && (
                        <span className="shrink-0 font-medium">{format(it.price * it.quantity)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Détail des articles indisponible.</p>
              )}

              {(order.subtotal != null || order.shipping != null || order.total != null) && (
                <>
                  <Separator className="my-4" />
                  <dl className="space-y-2 text-sm">
                    {order.subtotal != null && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sous-total</dt>
                        <dd>{format(order.subtotal)}</dd>
                      </div>
                    )}
                    {order.shipping != null && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Livraison</dt>
                        <dd>{format(order.shipping)}</dd>
                      </div>
                    )}
                    {order.total != null && (
                      <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                        <dt>Total</dt>
                        <dd>{format(order.total)}</dd>
                      </div>
                    )}
                  </dl>
                </>
              )}
            </div>

            <OrderReturns returns={order.returns} />
          </div>
        )}
      </div>
    </div>
  )
}
