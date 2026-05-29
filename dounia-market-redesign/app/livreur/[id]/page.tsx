'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { livreurApi } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { StatusBadge, formatMoney } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

const STEPS = [
  { value: 'picked_up', label: 'Marquer récupéré' },
  { value: 'in_transit', label: 'En route' },
  { value: 'delivered', label: 'Marquer livré' },
]

export default function LivreurDeliveryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const token = useAuth((s) => s.token)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState('')

  useEffect(() => {
    if (!token) return
    livreurApi
      .orders(token, { limit: 100 })
      .then((res) => {
        const found = (res?.data || []).find((o: any) => String(pick(o, ['id', 'reference'])) === id)
        if (found) setOrder(found)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token, id])

  async function advance(status: string) {
    if (!token) return
    setSaving(status)
    try {
      await livreurApi.orderUpdate(token, id, { status })
      setOrder((o: any) => ({ ...o, status }))
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Échec de la mise à jour')
    } finally {
      setSaving('')
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-secondary/60" />
  if (error || !order)
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Livraison introuvable.
        <div className="mt-4">
          <Link href="/livreur" className="font-medium text-primary">
            Retour aux livraisons
          </Link>
        </div>
      </div>
    )

  const items: any[] = pick(order, ['items', 'line_items'], []) || []
  const phone = pick(order, ['recipient_phone', 'phone'], '')

  return (
    <div>
      <Link href="/livreur" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Livraisons
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">{pick(order, ['reference', 'id'])}</h1>
        <StatusBadge status={pick(order, ['status'], undefined)} />
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="font-display font-semibold">{pick(order, ['recipient_name', 'recipient'], 'Destinataire')}</p>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {pick(order, ['shipping_address_1', 'address'], '')} {pick(order, ['shipping_city'], "N'Djamena")}
            </span>
          </p>
          {phone && (
            <a href={`tel:${phone}`} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Phone className="h-4 w-4" /> Appeler {phone}
            </a>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
            <Package className="h-4 w-4" /> Colis
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Contenu non détaillé.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {items.map((it, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>
                    {pick(it, ['title', 'name'])} <span className="text-muted-foreground">x{pick(it, ['quantity', 'qty'], 1)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">{formatMoney(pick(order, ['total', 'amount'], null))}</span>
          </div>
        </section>

        <div className="space-y-2">
          {STEPS.map((s) => (
            <Button key={s.value} className="w-full" size="lg" variant={s.value === 'delivered' ? 'default' : 'outline'} disabled={!!saving} onClick={() => advance(s.value)}>
              {s.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
