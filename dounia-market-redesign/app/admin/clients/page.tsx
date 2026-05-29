'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { PageHeader, LoadingRows, EmptyState, formatDate } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '-') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function AdminClients() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    adminApi
      .clients(token, { limit: 100 })
      .then((res) => setRows(res?.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <PageHeader title="Clients" subtitle="Les personnes qui commandent pour leurs proches." />
      {loading ? (
        <LoadingRows rows={8} />
      ) : error ? (
        <EmptyState title="Données indisponibles" />
      ) : rows.length === 0 ? (
        <EmptyState title="Aucun client" hint="Les comptes clients apparaîtront ici." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Téléphone</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c, i) => (
                <tr key={pick(c, ['id'], i)} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{pick(c, ['name', 'full_name'])}</td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(c, ['email'])}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{pick(c, ['phone'], '')}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{formatDate(pick(c, ['created_at'], null))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
