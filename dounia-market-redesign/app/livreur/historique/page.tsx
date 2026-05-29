'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/auth'
import { livreurApi } from '@/lib/admin'
import { formatMoney, formatDate } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function LivreurHistory() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    livreurApi
      .orders(token, { limit: 100, status: 'delivered' })
      .then((res) => setRows(res?.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold tracking-tight">Historique</h1>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/60" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-lg font-semibold">Aucune livraison passée</p>
          <p className="mt-1 text-sm text-muted-foreground">Vos livraisons terminées apparaîtront ici.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((o, i) => (
            <li key={pick(o, ['id'], i)} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-medium">{pick(o, ['recipient_name', 'recipient'], 'Destinataire')}</p>
                <p className="text-xs text-muted-foreground">{formatDate(pick(o, ['delivered_at', 'updated_at', 'created_at'], null))}</p>
              </div>
              <span className="font-semibold">{formatMoney(pick(o, ['total', 'amount'], null))}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
