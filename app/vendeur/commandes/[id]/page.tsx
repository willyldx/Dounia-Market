'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  Building2,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import {
  PageHeader,
  StatusBadge,
  LoadingRows,
  formatCurrency,
  formatDate,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function MerchantOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const token = useAuth((s) => s.token)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const orderId = params?.id as string

  useEffect(() => {
    if (!token || !orderId) return
    setLoading(true)
    merchantApi
      .orderDetail(token, orderId)
      .then((res) => {
        setOrder(res?.data || null)
      })
      .catch(() => {
        toast.error('Impossible de charger les détails de la commande.')
      })
      .finally(() => setLoading(false))
  }, [token, orderId])

  const handleStatusChange = async (nextStatus: string) => {
    if (!token || !orderId) return
    setUpdating(true)
    try {
      await merchantApi.orderTransition(token, orderId, nextStatus)
      setOrder((prev: any) => ({ ...prev, status: nextStatus }))
      toast.success(`Commande passée au statut : ${nextStatus}`)
    } catch {
      toast.error('Erreur lors de la mise à jour du statut.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <LoadingRows count={6} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-bold">Commande introuvable</h2>
        <Button asChild variant="outline">
          <Link href="/vendeur/commandes">Retour aux commandes</Link>
        </Button>
      </div>
    )
  }

  const parentOrder = order.order || {}
  const currency = order.currency || parentOrder.currency || 'XAF'
  const items = order.items || parentOrder.items || []

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href="/vendeur/commandes">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux commandes
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Commande ${order.display_id || `#SUB-${order.id}`}`}
        subtitle={`Enregistrée le ${formatDate(order.created_at)}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status || 'paid'} />
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Colonne Principale: Articles & Traitement */}
        <div className="space-y-6 md:col-span-2">
          {/* Action Hub Logistique */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-soft">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Action d'expédition requise
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Pour assurer le dédouanement et la livraison dans les délais, préparez votre colis et confirmez l'expédition ou le dépôt dans notre hub partenaire.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {order.status === 'paid' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('processing')}
                  disabled={updating}
                  className="text-xs gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Passer en préparation
                </Button>
              )}
              {order.status === 'processing' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange('shipped')}
                  disabled={updating}
                  className="text-xs gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Marquer comme expédié au Hub / Transporteur
                </Button>
              )}
            </div>
          </div>

          {/* Liste des articles */}
          <div className="rounded-xl border border-border bg-card shadow-soft p-5">
            <h3 className="font-display font-bold text-sm text-foreground mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Articles commandés
            </h3>

            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Articles inclus dans le colis.</p>
            ) : (
              <div className="divide-y divide-border">
                {items.map((it: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">
                        {it.product_title || it.title || 'Article'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Quantité : <span className="font-semibold text-foreground">x{it.quantity}</span>
                        {it.sku && ` • SKU: ${it.sku}`}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(it.price * (it.quantity || 1), currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border mt-4 pt-3 flex justify-between items-center font-bold text-sm">
              <span>Total sous-commande</span>
              <span className="text-primary text-base">
                {formatCurrency(order.total_amount || order.subtotal || 0, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Latérale: Destinataire & Hub Relais */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-soft p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Destinataire à N’Djamena
            </h3>

            <div className="text-xs space-y-2 text-muted-foreground">
              <p className="font-medium text-foreground text-sm">
                {parentOrder.recipient_name ||
                  `${parentOrder.customer_first_name || ''} ${parentOrder.customer_last_name || ''}`}
              </p>
              {parentOrder.recipient_phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {parentOrder.recipient_phone}
                </p>
              )}
              <p className="flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  {parentOrder.shipping_address_1 || "Adresse de livraison communiquée à N'Djamena"}
                  <br />
                  {parentOrder.shipping_city || "N'Djamena"}, Tchad
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-soft p-5 space-y-2">
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Hub Relais Logistique
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consultez votre bordereau d'expédition généré pour étiqueter le colis avant remise au transporteur international ou au point relais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
