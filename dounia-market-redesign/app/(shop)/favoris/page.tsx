'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus, ShoppingBag, X } from 'lucide-react'
import { toast } from 'sonner'
import { useFavorites } from '@/stores/favorites'
import { useCart } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import type { FavoriteItem } from '@/lib/types'

export default function FavorisPage() {
  const items = useFavorites((s) => s.items)
  const remove = useFavorites((s) => s.remove)
  const addItem = useCart((s) => s.addItem)
  const format = useCart((s) => s.format)

  function add(fav: FavoriteItem) {
    addItem({
      productId: fav.productId,
      title: fav.title,
      price: fav.price,
      thumbnail: fav.thumbnail,
      category: fav.category,
    })
    toast.success('Ajouté au panier', { description: fav.title })
  }

  return (
    <div className="container-page py-10 md:py-14">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Mes favoris</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {items.length > 0
            ? `${items.length} produit${items.length > 1 ? 's' : ''} enregistré${items.length > 1 ? 's' : ''}.`
            : 'Retrouvez ici les produits que vous mettez de côté.'}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Heart className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <p className="mt-4 font-display text-lg font-semibold">Aucun favori pour le moment</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Parcourez le catalogue et touchez le cœur pour garder vos produits préférés à portée de main.
          </p>
          <Button asChild className="mt-6">
            <Link href="/catalogue">Découvrir le catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((fav) => {
            const href = `/produit/${fav.productId}`
            return (
              <article
                key={fav.productId}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative">
                  <Link href={href} className="block aspect-square overflow-hidden bg-secondary/40">
                    {fav.thumbnail ? (
                      <Image
                        src={fav.thumbnail}
                        alt={fav.title}
                        width={480}
                        height={480}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-8 w-8" strokeWidth={1.25} />
                      </div>
                    )}
                  </Link>
                  <button
                    type="button"
                    aria-label="Retirer des favoris"
                    onClick={() => remove(fav.productId)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground backdrop-blur transition-colors hover:text-destructive"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  {fav.category && (
                    <p className="mb-1 line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {fav.category}
                    </p>
                  )}
                  <Link href={href} className="font-medium leading-snug transition-colors hover:text-primary">
                    <h2 className="line-clamp-2 min-h-[2.5rem] text-sm">{fav.title}</h2>
                  </Link>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <span className="font-display text-lg font-bold">{format(fav.price)}</span>
                    <button
                      type="button"
                      aria-label={`Ajouter ${fav.title} au panier`}
                      onClick={() => add(fav)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:scale-105 active:scale-95"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
