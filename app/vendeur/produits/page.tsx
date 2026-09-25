'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  PlusCircle,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import {
  PageHeader,
  StatusBadge,
  LoadingRows,
  EmptyState,
  formatCurrency,
} from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function MerchantProductsPage() {
  const token = useAuth((s) => s.token)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [updatingStockId, setUpdatingStockId] = useState<number | null>(null)

  const fetchProducts = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await merchantApi.products(token, {
        q: search || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      })
      const list = res?.data || []
      setProducts(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Erreur lors du chargement des produits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [token, selectedStatus])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleStockUpdate = async (productId: number, newStock: number) => {
    if (!token || Number.isNaN(newStock) || newStock < 0) return
    setUpdatingStockId(productId)
    try {
      await merchantApi.productStock(token, productId, newStock)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_quantity: newStock } : p)),
      )
      toast.success('Stock mis à jour avec succès.')
    } catch {
      toast.error('Impossible de modifier le stock.')
    } finally {
      setUpdatingStockId(null)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      await merchantApi.productDelete(token, productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success('Produit retiré du catalogue.')
    } catch {
      toast.error('Impossible de supprimer le produit.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de mes Produits"
        subtitle="Consultez vos articles, gérez les niveaux de stock et publiez de nouvelles références."
        action={
          <Button asChild className="gap-2">
            <Link href="/vendeur/produits/nouveau">
              <PlusCircle className="h-4 w-4" />
              Nouveau Produit
            </Link>
          </Button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre ou référence SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'active', label: 'Actifs' },
            { id: 'pending_review', label: 'En examen' },
            { id: 'draft', label: 'Brouillons' },
            { id: 'rejected', label: 'Rejetés' },
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

      {/* Product List Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingRows count={5} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="Aucun produit trouvé"
              message={
                search
                  ? 'Aucun résultat ne correspond à votre recherche.'
                  : 'Commencez à vendre en ajoutant vos premiers articles à votre boutique.'
              }
              action={
                <Button asChild size="sm">
                  <Link href="/vendeur/produits/nouveau">Ajouter un produit</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-3">Article</th>
                  <th className="px-5 py-3">Catégorie</th>
                  <th className="px-5 py-3">Prix</th>
                  <th className="px-5 py-3">Stock Disponible</th>
                  <th className="px-5 py-3">Statut Modération</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const categoryName = p.category?.name || p.categoryRelation?.name || 'Général'
                  const currency = p.currency || 'XAF'
                  const price = p.price || (p.price_minor ? p.price_minor / 100 : 0)

                  return (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary/60 flex items-center justify-center border border-border">
                            {p.thumbnail || p.media?.[0]?.url ? (
                              <img
                                src={p.thumbnail || p.media[0].url}
                                alt={p.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              SKU: {p.sku || `#${p.id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{categoryName}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {formatCurrency(price, currency)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={p.stock_quantity ?? 0}
                            disabled={updatingStockId === p.id}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value, 10)
                              if (!Number.isNaN(val) && val !== p.stock_quantity) {
                                handleStockUpdate(p.id, val)
                              }
                            }}
                            className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-center font-medium focus:border-primary focus:outline-none"
                          />
                          <span className="text-xs text-muted-foreground">unités</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={p.status || 'draft'} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {p.slug && (
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <Link href={`/produit/${p.slug}`} target="_blank" title="Voir sur la boutique">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(p.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
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
