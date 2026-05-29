'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Package } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { customerApi } from '@/lib/admin'
import { useCart } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

function statusLabel(status?: string): string {
  const s = (status || '').toLowerCase()
  if (/(deliver|livr|complet|termin)/.test(s)) return 'Livrée'
  if (/(ship|transit|cours|route|out_for)/.test(s)) return 'En cours de livraison'
  if (/(prepar|process|en_cours)/.test(s)) return 'En préparation'
  if (/(cancel|annul)/.test(s)) return 'Annulée'
  if (/(pending|recu|reçu|paid|pay|confirm)/.test(s)) return 'Commande reçue'
  return status || 'En traitement'
}

function formatDate(value?: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const token = useAuth((s) => s.token)
  const authStatus = useAuth((s) => s.status)
  const format = useCart((s) => s.format)

  const [order, setOrder] = useState<any>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (authStatus === 'idle' || authStatus === 'loading') return
    if (!token) {
      setState('error')
      return
    }
    let active = true
    customerApi
      .orderDetail(token, id)
      .then((res) => {
        if (!active) return
        setOrder(res?.order ?? res ?? null)
        setState('ready')
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [token, id, authStatus])

  const items: any[] = Array.isArray(order?.items)
    ? order.items
    : Array.isArray(order?.line_items)
      ? order.line_items
      : []
  const recipient = order?.recipient ?? order?.recipient_name ?? order?.customer_name
  const phone = order?.phone ?? order?.recipient_phone
  const address = order?.address?.line1 ?? order?.address ?? order?.shipping_address
  const city = order?.city ?? order?.address?.city
  const total = typeof order?.total === 'number' ? order.total : typeof order?.amount === 'number' ? order.amount : null
  const subtotal = typeof order?.subtotal === 'number' ? order.subtotal : null
  const shipping = typeof order?.shipping === 'number' ? order.shipping : typeof order?.delivery_fee === 'number' ? order.delivery_fee : null

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
                  Commande {order.reference ?? order.id ?? id}
                </h1>
                {formatDate(order.created_at ?? order.date) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Passée le {formatDate(order.created_at ?? order.date)}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {statusLabel(order.status ?? order.state)}
              </span>
            </div>

            {(recipient || address || city) && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  Livraison
                </h2>
                <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                  {recipient && <p className="font-medium text-foreground">{recipient}</p>}
                  {phone && <p>{phone}</p>}
                  {(address || city) && (
                    <p>{[typeof address === 'string' ? address : null, city].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                <Package className="h-4 w-4 text-primary" strokeWidth={1.75} />
                Articles
              </h2>
              {items.length > 0 ? (
                <ul className="mt-4 divide-y divide-border">
                  {items.map((it, idx) => {
                    const qty = it.quantity ?? it.qty ?? 1
                    const price = typeof it.price === 'number' ? it.price : null
                    return (
                      <li key={idx} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <div className="min-w-0">
                          <p className="font-medium">{it.title ?? it.name ?? it.product_title ?? 'Article'}</p>
                          <p className="text-muted-foreground">Quantité : {qty}</p>
                        </div>
                        {price != null && (
                          <span className="shrink-0 font-medium">{format(price * qty)}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Détail des articles indisponible.</p>
              )}

              {(subtotal != null || shipping != null || total != null) && (
                <>
                  <Separator className="my-4" />
                  <dl className="space-y-2 text-sm">
                    {subtotal != null && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sous-total</dt>
                        <dd>{format(subtotal)}</dd>
                      </div>
                    )}
                    {shipping != null && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Livraison</dt>
                        <dd>{format(shipping)}</dd>
                      </div>
                    )}
                    {total != null && (
                      <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                        <dt>Total</dt>
                        <dd>{format(total)}</dd>
                      </div>
                    )}
                  </dl>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
