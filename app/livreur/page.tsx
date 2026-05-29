'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ChevronRight, Phone } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { livreurApi } from '@/lib/admin'
import { StatusBadge, formatMoney } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function LivreurDeliveries() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    livreurApi
      .orders(token, { limit: 50 })
      .then((res) => setRows((res?.data || []).filter((o: any) => String(pick(o, ['status'], '')).toLowerCase() !== 'delivered')))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight">Mes livraisons</h1>
        <p className="text-sm text-muted-foreground">{rows.length} en cours à N'Djamena</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Impossible de charger les livraisons.
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-lg font-semibold">Aucune livraison</p>
          <p className="mt-1 text-sm text-muted-foreground">Vous êtes à jour. Les nouvelles courses arriveront ici.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((o, i) => {
            const id = pick(o, ['id', 'reference'], i)
            return (
              <li key={id}>
                <Link
                  href={`/livreur/${id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold">{pick(o, ['recipient_name', 'recipient'], 'Destinataire')}</span>
                      <StatusBadge status={pick(o, ['status', 'fulfillment_status'], undefined)} />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {pick(o, ['shipping_address_1', 'address'], '')} {pick(o, ['shipping_city'], "N'Djamena")}
                      </span>
                    </p>
                    <p className="mt-1 text-sm font-medium">{formatMoney(pick(o, ['total', 'amount'], null))}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
