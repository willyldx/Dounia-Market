'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { PageHeader, StatCard, LoadingRows, EmptyState, formatMoney } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = undefined) {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function AdminFinances() {
  const token = useAuth((s) => s.token)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    adminApi
      .finances(token)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <LoadingRows rows={6} />
  if (error || !data) return <EmptyState title="Données indisponibles" hint="Les finances ne sont pas accessibles pour le moment." />

  const revenue = pick(data, ['revenue', 'total_revenue'])
  const orders = pick(data, ['orders', 'orders_count', 'total_orders'])
  const avg = pick(data, ['average_order', 'avg_order_value', 'aov'])
  const pendingPayout = pick(data, ['pending_payout', 'to_pay', 'balance'])

  const rawSeries: any[] =
    pick(data, ['monthly', 'series', 'chart', 'revenue_by_month', 'by_month'], []) || []
  const series = Array.isArray(rawSeries)
    ? rawSeries.map((r) => ({
        label: String(pick(r, ['label', 'month', 'name', 'period'], '')),
        value: Number(pick(r, ['value', 'revenue', 'amount', 'total'], 0)),
      }))
    : []

  return (
    <div>
      <PageHeader title="Finances" subtitle="Revenus et performance de Dounia Market." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Chiffre d'affaires" value={revenue !== undefined ? formatMoney(revenue) : '-'} />
        <StatCard label="Commandes" value={orders ?? '-'} />
        <StatCard label="Panier moyen" value={avg !== undefined ? formatMoney(avg) : '-'} />
        <StatCard label="À reverser" value={pendingPayout !== undefined ? formatMoney(pendingPayout) : '-'} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4 font-display font-semibold">Revenus</h2>
        {series.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Pas encore de données à afficher.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 120)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                <Tooltip
                  formatter={(v: any) => formatMoney(v)}
                  contentStyle={{ borderRadius: 12, border: '1px solid oklch(0.90 0.01 120)' }}
                />
                <Bar dataKey="value" fill="oklch(0.29 0.052 162)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
