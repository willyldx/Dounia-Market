'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { toast } from 'sonner'
import type { Product, ProductVariant } from '@/lib/types'
import { useCart } from '@/stores/cart'
import { useFavorites } from '@/stores/favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function BuyBox({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const format = useCart((s) => s.format)
  const toggleFav = useFavorites((s) => s.toggle)
  const isFav = useFavorites((s) => s.items.some((i) => i.productId === product.id))

  const [qty, setQty] = useState(1)

  const variants = useMemo(() => product.variants ?? [], [product.variants])
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (variants.length === 0) return null
    const firstAvailable = variants.find((v) => v.inStock !== false)
    return (firstAvailable ?? variants[0]).id
  })
  const selected: ProductVariant | null = variants.find((v) => v.id === selectedId) ?? null

  const image = selected?.thumbnail || product.thumbnail || product.images?.[0] || ''
  const price = selected?.price ?? product.price
  const inStock = selected ? (selected.inStock ?? product.inStock) : product.inStock
  const hasPrice = typeof price === 'number' && Number.isFinite(price)
  const canBuy = inStock !== false && hasPrice

  function add() {
    if (!canBuy) return
    addItem(
      {
        productId: product.id,
        variantId: selected?.id,
        title: selected ? `${product.title} — ${selected.title}` : product.title,
        price: price as number,
        thumbnail: image,
        category: product.category,
      },
      qty,
    )
    toast.success('Ajoute au panier', {
      description: selected ? `${product.title} — ${selected.title}` : product.title,
    })
  }

  function fav() {
    if (!hasPrice) return
    toggleFav({
      productId: product.id,
      title: product.title,
      price: price as number,
      thumbnail: image,
      category: product.category,
    })
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        {product.category && (
          <Link
            href={`/categories/${encodeURIComponent(product.categoryHandle || product.category)}`}
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            {product.category}
          </Link>
        )}

        <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          {product.title}
        </h1>

        {product.subtitle && <p className="mt-2 text-muted-foreground">{product.subtitle}</p>}

        <div className="mt-5 flex items-center gap-3">
          {hasPrice ? (
            <span className="font-display text-3xl font-bold text-accent-foreground">
              {format(price as number)}
            </span>
          ) : (
            <span className="text-lg font-medium text-muted-foreground">Prix sur demande</span>
          )}
          {inStock === false ? (
            <Badge variant="secondary">Rupture de stock</Badge>
          ) : (
            <Badge variant="secondary">En stock</Badge>
          )}
        </div>

        {variants.length > 0 && (
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">
              Variante
              {selected && <span className="ml-1 text-muted-foreground">: {selected.title}</span>}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Choisir une variante">
              {variants.map((v) => {
                const active = v.id === selectedId
                const soldOut = v.inStock === false
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setSelectedId(v.id)
                      setQty(1)
                    }}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground',
                      soldOut && !active && 'opacity-50',
                    )}
                  >
                    <span className={cn(soldOut && 'line-through')}>{v.title}</span>
                    {soldOut && <span className="sr-only"> (épuisé)</span>}
                  </button>
                )
              })}
            </div>
            {selected?.inStock === false && (
              <p className="mt-2 text-sm text-muted-foreground">
                Cette variante est épuisée. Choisissez-en une autre.
              </p>
            )}
          </fieldset>
        )}

        <Separator className="my-6" />

        {canBuy && (
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium">Quantite</span>
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Diminuer la quantite"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Augmenter la quantite"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={add}
            disabled={!canBuy}
            size="lg"
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            {canBuy ? 'Ajouter au panier' : 'Indisponible'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={fav}
            disabled={!hasPrice}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={isFav}
          >
            <Heart className={cn('h-5 w-5', isFav && 'fill-accent text-accent')} strokeWidth={1.75} />
          </Button>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
          <span>Livraison a domicile a N'Djamena, directement chez votre famille.</span>
        </div>
      </div>
    </div>
  )
}
