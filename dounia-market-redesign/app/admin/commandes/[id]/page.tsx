'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader, StatusBadge, LoadingRows, EmptyState, formatMoney, formatDate } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '-') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

const FULFILLMENT = [
  { value: 'unfulfilled', label: 'À préparer' },
  { value: 'processing', label: 'En préparation' },
  { value: 'fulfilled', label: 'Expédiée' },
  { value: 'in_transit', label: 'En route' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const token = useAuth((s) => s.token)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    adminApi
      .orderDetail(token, id)
      .then((res) => setOrder(res?.order || res))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token, id])

  async function updateStatus(value: string) {
    if (!token) return
    setSaving(true)
    try {
      const res = await adminApi.orderUpdate(token, id, { fulfillment_status: value, status: value })
      setOrder(res?.order || { ...order, fulfillment_status: value, status: value })
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Échec de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const items: any[] = pick(order, ['items', 'line_items', 'products'], []) || []

  return (
    <div>
      <Link href="/admin/commandes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Commandes
      </Link>

      {loading ? (
        <LoadingRows rows={6} />
      ) : error || !order ? (
        <EmptyState title="Commande introuvable" hint="Cette commande n'existe pas ou n'a pas pu être chargée." />
      ) : (
        <>
          <PageHeader
            title={`Commande ${pick(order, ['reference', 'order_reference', 'id'])}`}
            subtitle={formatDate(pick(order, ['created_at', 'date'], null))}
            action={<StatusBadge status={pick(order, ['status', 'fulfillment_status'], undefined)} />}
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <h2 className="mb-4 font-display font-semibold">Articles</h2>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun article listé.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between py-3 text-sm">
                        <span>
                          <span className="font-medium">{pick(it, ['title', 'name', 'product_title'])}</span>
                          <span className="text-muted-foreground"> x{pick(it, ['quantity', 'qty'], 1)}</span>
                        </span>
                        <span className="font-medium">{formatMoney(pick(it, ['price', 'unit_price', 'total'], null))}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-lg font-bold">{formatMoney(pick(order, ['total', 'amount', 'total_amount'], null))}</span>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <h2 className="mb-3 font-display font-semibold">Statut de traitement</h2>
                <Select defaultValue={String(pick(order, ['fulfillment_status', 'status'], 'unfulfilled'))} onValueChange={updateStatus} disabled={saving}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FULFILLMENT.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              <section className="rounded-xl border border-border bg-card p-5 text-sm shadow-soft">
                <h2 className="mb-3 font-display font-semibold">Client</h2>
                <p className="font-medium">{pick(order, ['customer_name', 'customer'])}</p>
                <p className="text-muted-foreground">{pick(order, ['email', 'customer_email'])}</p>
                <p className="text-muted-foreground">{pick(order, ['customer_phone', 'phone'], '')}</p>
              </section>

              <section className="rounded-xl border border-border bg-card p-5 text-sm shadow-soft">
                <h2 className="mb-3 font-display font-semibold">Livraison</h2>
                <p className="font-medium">{pick(order, ['recipient_name', 'recipient'])}</p>
                <p className="text-muted-foreground">{pick(order, ['recipient_phone'], '')}</p>
                <p className="text-muted-foreground">
                  {pick(order, ['shipping_address_1', 'address'], '')} {pick(order, ['shipping_city'], "N'Djamena")}
                </p>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
