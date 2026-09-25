'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Eye, Truck, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import {
  PageHeader,
  StatusBadge,
  LoadingRows,
  EmptyState,
  formatCurrency,
  formatDate,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function MerchantOrdersPage() {
  const token = useAuth((s) => s.token)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const fetchOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await merchantApi.orders(token, {
        q: search || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      })
      const list = res?.data || []
      setOrders(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Erreur lors du chargement des commandes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [token, selectedStatus])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleQuickStatus = async (orderId: number, nextStatus: string) => {
    if (!token) return
    try {
      await merchantApi.orderTransition(token, orderId, nextStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
      )
      toast.success('Statut de la commande actualisé.')
    } catch {
      toast.error('Impossible de modifier le statut de la commande.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commandes & Expéditions"
        subtitle="Suivez les commandes attribuées à vos produits et validez les étapes de préparation."
      />

      {/* Search & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par référence, client ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'paid', label: 'À préparer' },
            { id: 'processing', label: 'En cours' },
            { id: 'shipped', label: 'Expédiées' },
            { id: 'delivered', label: 'Livrées' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingRows count={5} />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="Aucune commande correspondante"
              message={
                search
                  ? 'Aucun résultat trouvé pour votre recherche.'
                  : 'Vous n’avez aucune commande en cours dans ce statut.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-3">Réf. Commande</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Destinataire</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((ord) => {
                  const recipient =
                    ord.order?.recipient_name ||
                    ord.order?.customer_first_name
                      ? `${ord.order?.customer_first_name} ${ord.order?.customer_last_name || ''}`
                      : 'Client Dounia'

                  const city = ord.order?.shipping_city || "N'Djamena"
                  const amount = ord.total_amount || ord.subtotal || 0
                  const currency = ord.currency || ord.order?.currency || 'XAF'

                  return (
                    <tr key={ord.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-foreground">
                          {ord.display_id || ord.order?.display_id || `#SUB-${ord.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ID: #{ord.id}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {formatDate(ord.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground text-xs">{recipient}</p>
                        <p className="text-xs text-muted-foreground">{city}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {formatCurrency(amount, currency)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={ord.status || 'paid'} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ord.status === 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickStatus(ord.id, 'processing')}
                              className="text-xs h-8 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                            >
                              <Clock className="h-3.5 w-3.5" />
                              Préparer
                            </Button>
                          )}
                          <Button asChild size="sm" variant="ghost" className="text-xs h-8 gap-1">
                            <Link href={`/vendeur/commandes/${ord.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              Détails
                            </Link>
                          </Button>
                        </div>
                      </td>
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
