'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Sparkles, Building2, Package, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { merchantApi } from '@/lib/merchant'
import { PageHeader } from '@/components/merchant/merchant-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const token = useAuth((s) => s.token)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [stockQuantity, setStockQuantity] = useState('10')
  const [warehouseLocation, setWarehouseLocation] = useState('hub_paris')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (!title.trim()) {
      toast.error("Veuillez renseigner le titre de l'article.")
      return
    }

    const numPrice = parseFloat(price)
    if (Number.isNaN(numPrice) || numPrice <= 0) {
      toast.error('Veuillez indiquer un prix valide.')
      return
    }

    const numStock = parseInt(stockQuantity, 10)
    if (Number.isNaN(numStock) || numStock < 0) {
      toast.error('Veuillez indiquer une quantité de stock valide.')
      return
    }

    setSubmitting(true)
    try {
      const generatedSku = sku.trim() || `SKU-${Date.now().toString().slice(-6)}`
      const res = await merchantApi.productCreate(token, {
        title: title.trim(),
        description: description.trim() || null,
        sku: generatedSku,
        price: numPrice,
        currency,
        stock_quantity: numStock,
      })

      const createdProduct = res?.data || res?.product
      if (createdProduct?.id) {
        // Soumettre automatiquement à la modération
        await merchantApi.productSubmit(token, createdProduct.id).catch(() => {})
      }

      toast.success('Produit enregistré avec succès et soumis à modération !')
      router.push('/vendeur/produits')
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création de l'article.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href="/vendeur/produits">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à mes produits
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Ajouter un nouveau produit"
        subtitle="Créez une référence pour la vente locale ou le fret international vers N'Djamena."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Informations générales
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Titre de l'article *</Label>
              <Input
                id="title"
                placeholder="Ex : Lait infantile Guigoz 800g, Ordinateur Lenovo i5..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description détaillée</Label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Présentez les spécifications, l'origine et les conseils d'utilisation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sku">Référence SKU (Optionnel)</Label>
              <Input
                id="sku"
                placeholder="Généré automatiquement si vide"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Tarification & Stock */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Prix et Disponibilité
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Devise de vente</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
              >
                <option value="EUR">Euro (EUR - €)</option>
                <option value="XAF">Franc CFA (FCFA)</option>
                <option value="CAD">Dollar Canadien (CAD - $)</option>
                <option value="USD">Dollar US (USD - $)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Prix unitaire *</Label>
              <Input
                id="price"
                type="number"
                step="any"
                min="0"
                placeholder="Ex : 25"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock">Quantité en stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="Ex : 50"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        {/* Localisation du Stock & Logistique */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Entrepôt de départ & Logistique
          </h2>

          <div className="space-y-3">
            <Label>Emplacement actuel du stock</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: 'hub_paris',
                  title: 'Hub Europe (Paris)',
                  desc: 'Acheminé par Fret Aérien Express (5-9j)',
                },
                {
                  id: 'hub_montreal',
                  title: 'Hub Amérique (Montréal)',
                  desc: 'Fret aérien ou maritime international',
                },
                {
                  id: 'hub_ndjamena',
                  title: 'Stock Local (N’Djamena)',
                  desc: 'Disponible immédiatement pour livraison 24h',
                },
              ].map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setWarehouseLocation(loc.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    warehouseLocation === loc.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border bg-background hover:border-muted-foreground/30'
                  }`}
                >
                  <p className="font-semibold text-sm text-foreground">{loc.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{loc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button asChild variant="outline">
            <Link href="/vendeur/produits">Annuler</Link>
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? 'Enregistrement...' : 'Enregistrer et Soumettre'}
          </Button>
        </div>
      </form>
    </div>
  )
}
