'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Package } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import type { CustomerOrder } from '@/lib/types'
import { formatOrderDate, getMyOrders } from '@/lib/orders'
import { useCart } from '@/stores/cart'
import { OrderStatusBadge } from '@/components/shop/order-status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function CommandesPage() {
  const token = useAuth((s) => s.token)
  const status = useAuth((s) => s.status)
  const format = useCart((s) => s.format)

  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [fetchState, setFetchState] = useState<'loading' | 'ready' | 'error'>('loading')

  const authResolved = status !== 'idle' && status !== 'loading'
  // A resolved-but-unauthenticated session is an error we can derive during
  // render, so the effect never has to set state synchronously.
  const state: 'loading' | 'ready' | 'error' = !authResolved ? 'loading' : !token ? 'error' : fetchState

  useEffect(() => {
    if (!authResolved || !token) return
    let active = true
    getMyOrders(token)
      .then((res) => {
        if (!active) return
        setOrders(res)
        setFetchState('ready')
      })
      .catch(() => {
        if (active) setFetchState('error')
      })
    return () => {
      active = false
    }
  }, [token, authResolved])

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/compte"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Mon compte
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Mes commandes</h1>
        <p className="mt-2 text-sm text-muted-foreground">Retrouvez l'historique et le statut de vos commandes.</p>

        {state === 'loading' ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : state === 'error' ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="font-semibold">Impossible de charger vos commandes</p>
            <p className="mt-1 text-sm text-muted-foreground">Réessayez dans un instant.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Package className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Aucune commande</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Vous n'avez pas encore passé de commande. Découvrez nos produits.
            </p>
            <Button asChild className="mt-6">
              <Link href="/catalogue">Voir le catalogue</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((o, idx) => (
              <li key={o.reference || idx}>
                <Link
                  href={`/compte/commandes/${encodeURIComponent(o.reference)}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="min-w-0">
                    <p className="font-display font-semibold">Commande {o.reference}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatOrderDate(o.createdAt)}</p>
                    <OrderStatusBadge status={o.status} size="sm" className="mt-2" />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {o.total != null && <span className="font-display font-bold">{format(o.total)}</span>}
                    <ChevronRight
                      className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
