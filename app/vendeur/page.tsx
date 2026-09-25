'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingBag,
  Wallet,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  LoadingRows,
  EmptyState,
  formatCurrency,
  formatDate,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'

export default function MerchantDashboardPage() {
  const token = useAuth((s) => s.token)
  const [data, setData] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let active = true
    setLoading(true)

    Promise.allSettled([
      merchantApi.dashboard(token),
      merchantApi.orders(token, { per_page: 5 }),
      merchantApi.profile(token),
    ])
      .then(([dashRes, ordersRes, profRes]) => {
        if (!active) return
        if (dashRes.status === 'fulfilled') {
          setData(dashRes.value?.data || null)
        }
        if (ordersRes.status === 'fulfilled') {
          const list = ordersRes.value?.data || []
          setRecentOrders(Array.isArray(list) ? list : [])
        }
        if (profRes.status === 'fulfilled') {
          setProfile(profRes.value?.data || null)
        }
        if (dashRes.status === 'rejected' && ordersRes.status === 'rejected') {
          setError("Impossible de charger les données de l'espace vendeur.")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  const productsTotal = data?.products?.total ?? 0
  const productsLowStock = data?.products?.low_stock ?? 0
  const ordersTotal = data?.orders?.total ?? 0
  const ordersPending = data?.orders?.by_status?.pending ?? data?.orders?.by_status?.paid ?? 0

  // Balances
  const balances = data?.financials?.available_balances_by_currency || {}
  const primaryCurrency = Object.keys(balances)[0] || 'EUR'
  const primaryBalance = balances[primaryCurrency] ?? 0

  const isKycPending = profile?.verification_status === 'pending' || profile?.verification_status === 'unverified'

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord Marchand"
        subtitle="Suivi de vos ventes, stocks par entrepôt et expéditions vers le Tchad."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="gap-2">
              <Link href="/vendeur/produits/nouveau">
                <PlusCircle className="h-4 w-4" />
                Ajouter un produit
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/vendeur/finances">
                <Wallet className="h-4 w-4" />
                Demander un versement
              </Link>
            </Button>
          </div>
        }
      />

      {/* KYC Alert if not yet verified */}
      {isKycPending && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Vérification de votre compte vendeur en cours</p>
              <p className="mt-1 text-xs leading-relaxed opacity-90">
                Vos documents de conformité sont actuellement en cours d'examen par notre équipe de modération. Vous pouvez déjà configurer votre catalogue et vos stocks.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs bg-card shrink-0">
              <Link href="/vendeur/parametres">Vérifier mes documents</Link>
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingRows count={4} />
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Solde disponible"
              value={formatCurrency(primaryBalance, primaryCurrency)}
              hint="Prêt pour virement bancaire ou mobile money"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatCard
              label="Commandes à expédier"
              value={ordersPending}
              hint={`${ordersTotal} commandes enregistrées au total`}
              icon={<ShoppingBag className="h-5 w-5" />}
            />
            <StatCard
              label="Catalogue en ligne"
              value={productsTotal}
              hint="Produits visibles sur la boutique"
              icon={<Package className="h-5 w-5" />}
            />
            <StatCard
              label="Alerte stock faible"
              value={productsLowStock}
              hint={productsLowStock > 0 ? 'Articles à réapprovisionner' : 'Stock optimal'}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
          </div>

          {/* Quick Hub Logistics Guidance */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Circuit Logistique Transfrontalier Dounia
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  Lorsque vos articles sont commandés depuis l'Europe ou le Canada, préparez votre colis et déposez-le dans notre hub relais partenaire (Paris ou Montréal). Nous prenons en charge le fret aérien, le dédouanement à N'Djamena et la remise finale en main propre.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5 text-xs">
                <Link href="/vendeur/commandes">
                  Voir mes commandes en cours
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Commandes récentes</h2>
                <p className="text-xs text-muted-foreground">Vos 5 dernières commandes assignées</p>
              </div>
              <Link
                href="/vendeur/commandes"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Toutes les commandes
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="Aucune commande pour le moment"
                  message="Les commandes passées sur vos produits apparaîtront ici avec les instructions d'expédition."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-5 py-3">Réf. Sous-commande</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Montant</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground">
                          {ord.display_id || ord.order?.display_id || `#SUB-${ord.id}`}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">
                          {formatDate(ord.created_at)}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-foreground">
                          {formatCurrency(ord.total_amount || ord.subtotal, ord.currency || 'XAF')}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={ord.status || 'paid'} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button asChild variant="ghost" size="sm" className="text-xs">
                            <Link href={`/vendeur/commandes/${ord.id}`}>Détails</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
