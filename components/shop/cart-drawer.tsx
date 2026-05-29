'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart, selectSubtotal, selectItemCount } from '@/stores/cart'

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen)
  const close = useCart((s) => s.close)
  const open = useCart((s) => s.open)
  const items = useCart((s) => s.items)
  const increment = useCart((s) => s.increment)
  const decrement = useCart((s) => s.decrement)
  const removeItem = useCart((s) => s.removeItem)
  const format = useCart((s) => s.format)
  const subtotal = useCart(selectSubtotal)
  const count = useCart(selectItemCount)

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? open() : close())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-display text-lg">
            Votre panier {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p className="font-display text-lg font-semibold">Votre panier est vide</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Parcourez le catalogue et composez la commande qui fera plaisir à vos proches.
            </p>
            <Button asChild className="mt-2" onClick={close}>
              <Link href="/catalogue">Parcourir le catalogue</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-secondary">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-sm font-semibold text-primary">{format(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                          <button
                            aria-label="Réduire la quantité"
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => decrement(item.id)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            aria-label="Augmenter la quantité"
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => increment(item.id)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          aria-label="Retirer du panier"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="gap-3 border-t px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-display text-lg font-bold">{format(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Les frais de livraison sont confirmés à la commande.</p>
              <Button asChild size="lg" className="w-full" onClick={close}>
                <Link href="/checkout">Passer la commande</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={close}>
                <Link href="/panier">Voir le panier</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
