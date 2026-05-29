'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { Input } from '@/components/ui/input'
import { PageHeader, StatusBadge, LoadingRows, EmptyState, formatMoney, formatDate } from '@/components/admin/admin-kit'
import { cn } from '@/lib/utils'

const FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En préparation' },
  { value: 'fulfilled', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]

function pick(o: any, keys: string[], fb: any = '-') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function AdminOrders() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = useCallback(() => {
    if (!token) return
    setLoading(true)
    setError(false)
    adminApi
      .orders(token, { limit: 50, search: search || undefined, status: status || undefined })
      .then((res) => setRows(res?.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token, search, status])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  return (
    <div>
      <PageHeader title="Commandes" subtitle="Suivez et traitez les commandes de vos clients." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher (référence, client, email)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                status === f.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingRows rows={8} />
      ) : error ? (
        <EmptyState title="Données indisponibles" hint="Réessayez dans quelques instants." />
      ) : rows.length === 0 ? (
        <EmptyState title="Aucune commande" hint="Aucune commande ne correspond à ces critères." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Destinataire</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((o, i) => {
                const id = pick(o, ['id', 'reference', 'order_id'], i)
                return (
                  <tr key={id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/admin/commandes/${id}`} className="hover:text-primary">
                        {pick(o, ['reference', 'order_reference', 'id'])}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{pick(o, ['customer_name', 'customer', 'email'])}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{pick(o, ['recipient_name', 'recipient'])}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{formatDate(pick(o, ['created_at', 'date'], null))}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={pick(o, ['status', 'fulfillment_status', 'payment_status'], undefined)} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatMoney(pick(o, ['total', 'amount', 'total_amount'], null))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
