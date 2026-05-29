'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Package } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { customerApi } from '@/lib/admin'
import { useCart } from '@/stores/cart'
import { Button } from '@/components/ui/button'
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

export default function CommandesPage() {
  const token = useAuth((s) => s.token)
  const status = useAuth((s) => s.status)
  const format = useCart((s) => s.format)

  const [orders, setOrders] = useState<any[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return
    if (!token) {
      setState('error')
      return
    }
    let active = true
    customerApi
      .myOrders(token)
      .then((res) => {
        if (!active) return
        setOrders(Array.isArray(res?.data) ? res.data : [])
        setState('ready')
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [token, status])

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
            {orders.map((o, idx) => {
              const reference = o.reference ?? o.id ?? ''
              const total = typeof o.total === 'number' ? o.total : typeof o.amount === 'number' ? o.amount : null
              return (
                <li key={reference || idx}>
                  <Link
                    href={`/compte/commandes/${encodeURIComponent(String(reference))}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="min-w-0">
                      <p className="font-display font-semibold">Commande {reference}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(o.created_at ?? o.date)}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {statusLabel(o.status ?? o.state)}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {total != null && <span className="font-display font-bold">{format(total)}</span>}
                      <ChevronRight
                        className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
