'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart, selectSubtotal } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const items = useCart((s) => s.items)
  const increment = useCart((s) => s.increment)
  const decrement = useCart((s) => s.decrement)
  const removeItem = useCart((s) => s.removeItem)
  const format = useCart((s) => s.format)
  const subtotal = useCart(selectSubtotal)

  if (items.length === 0) {
    return (
      <div className="container-page py-10 md:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Votre panier</h1>
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
            <ShoppingCart className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Votre panier est vide</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Parcourez notre catalogue et ajoutez les produits a livrer a vos proches.
          </p>
          <Button asChild className="mt-6">
            <Link href="/catalogue">Decouvrir le catalogue</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Votre panier</h1>
      <p className="mt-2 text-muted-foreground">
        {items.length} article{items.length > 1 ? 's' : ''} dans votre panier.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.title} fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-6 w-6" strokeWidth={1.25} />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {item.category && (
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {item.category}
                      </p>
                    )}
                    <h3 className="line-clamp-2 font-medium leading-snug">{item.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Retirer ${item.title}`}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      aria-label="Diminuer la quantite"
                      onClick={() => decrement(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantite"
                      onClick={() => increment(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                  <span className="font-display font-bold">{format(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold tracking-tight">Recapitulatif</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-muted-foreground">Calculee a la commande</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total estime</span>
              <span className="font-display text-xl font-bold">{format(subtotal)}</span>
            </div>
            <Button asChild size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/checkout">
                Passer la commande
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link href="/catalogue">Continuer mes achats</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
