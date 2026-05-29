'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { useCart } from '@/stores/cart'
import { useFavorites } from '@/stores/favorites'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const format = useCart((s) => s.format)
  const toggleFav = useFavorites((s) => s.toggle)
  const isFav = useFavorites((s) => s.items.some((i) => i.productId === product.id))

  const href = `/produit/${product.slug || product.id}`
  const image = product.thumbnail || product.images?.[0] || ''
  const hasPrice = typeof product.price === 'number' && Number.isFinite(product.price)
  const canBuy = product.inStock === true && hasPrice

  function add() {
    if (!canBuy) return
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price as number,
      thumbnail: image,
      category: product.category,
    })
    toast.success('Ajouté au panier', { description: product.title })
  }

  function fav() {
    if (!hasPrice) return
    toggleFav({
      productId: product.id,
      title: product.title,
      price: product.price as number,
      thumbnail: image,
      category: product.category,
    })
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative">
        <Link href={href} className="block aspect-square overflow-hidden bg-secondary/40">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              width={480}
              height={480}
              className={cn(
                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
                product.inStock === false && 'opacity-60 grayscale',
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-8 w-8" strokeWidth={1.25} />
            </div>
          )}
        </Link>

        {product.inStock === false && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
            Rupture
          </span>
        )}

        <button
          type="button"
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={isFav}
          onClick={fav}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <Heart className={cn('h-4 w-4', isFav && 'fill-accent text-accent')} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="mb-1 line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
        )}
        <Link href={href} className="font-medium leading-snug transition-colors hover:text-primary">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm">{product.title}</h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          {hasPrice ? (
            <span className="font-display text-lg font-bold">{format(product.price as number)}</span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Prix sur demande</span>
          )}

          {canBuy ? (
            <button
              type="button"
              aria-label={`Ajouter ${product.title} au panier`}
              onClick={add}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} />
            </button>
          ) : (
            <Link
              href={href}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Voir
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
