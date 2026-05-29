'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Wallet, Clock, Users } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { PageHeader, StatCard, StatusBadge, LoadingRows, EmptyState, formatMoney, formatDate } from '@/components/admin/admin-kit'

function pick(obj: any, keys: string[], fallback: any = undefined) {
  for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k]
  return fallback
}

export default function AdminOverview() {
  const token = useAuth((s) => s.token)
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    let active = true
    setLoading(true)
    Promise.allSettled([adminApi.stats(token), adminApi.orders(token, { limit: 8 })])
      .then(([s, o]) => {
        if (!active) return
        if (s.status === 'fulfilled') setStats(s.value)
        if (o.status === 'fulfilled') setOrders(o.value?.data || [])
        if (s.status === 'rejected' && o.status === 'rejected') setError(true)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [token])

  const revenue = pick(stats, ['revenue', 'total_revenue', 'revenue_total'])
  const ordersCount = pick(stats, ['orders', 'orders_count', 'total_orders', 'count'])
  const pending = pick(stats, ['pending', 'pending_orders', 'orders_pending'])
  const clients = pick(stats, ['clients', 'clients_count', 'customers'])

  return (
    <div>
      <PageHeader title="Vue d'ensemble" subtitle="Activité de votre boutique en un coup d'oeil." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Chiffre d'affaires" value={revenue !== undefined ? formatMoney(revenue) : '-'} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Commandes" value={ordersCount ?? '-'} icon={<Package className="h-5 w-5" />} />
        <StatCard label="En attente" value={pending ?? '-'} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Clients" value={clients ?? '-'} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-sm font-medium text-primary hover:underline">
            Tout voir
          </Link>
        </div>

        {loading ? (
          <LoadingRows />
        ) : error ? (
          <EmptyState title="Données indisponibles" hint="Impossible de charger les statistiques pour le moment." />
        ) : orders.length === 0 ? (
          <EmptyState title="Aucune commande" hint="Les nouvelles commandes apparaîtront ici." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Référence</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o, i) => {
                  const id = pick(o, ['id', 'reference', 'order_id'], i)
                  const ref = pick(o, ['reference', 'order_reference', 'id'], '-')
                  return (
                    <tr key={id} className="transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/admin/commandes/${id}`} className="hover:text-primary">
                          {ref}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {pick(o, ['customer_name', 'customer', 'email'], '-')}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {formatDate(pick(o, ['created_at', 'date']))}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={pick(o, ['status', 'fulfillment_status', 'payment_status'])} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatMoney(pick(o, ['total', 'amount', 'total_amount']))}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
