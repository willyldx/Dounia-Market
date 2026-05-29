'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, Search, ShoppingBag, Sprout, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CurrencySelector } from './currency-selector'
import { useCart, selectItemCount } from '@/stores/cart'
import { useFavorites, selectFavCount } from '@/stores/favorites'

const NAV = [
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/comment-ca-marche', label: 'Comment ça marche' },
  { href: '/suivi', label: 'Suivi' },
]

function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

function CountBadge({ value }: { value: number }) {
  if (value <= 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
      {value}
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const mounted = useMounted()
  const [menuOpen, setMenuOpen] = useState(false)
  const openCart = useCart((s) => s.open)
  const cartCount = useCart(selectItemCount)
  const favCount = useFavorites(selectFavCount)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Dounia Market, accueil">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Dounia Market</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground" aria-label="Rechercher">
            <Link href="/catalogue">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </Button>

          <CurrencySelector className="hidden h-9 w-[88px] md:flex" />

          <Button asChild variant="ghost" size="icon" className="relative hidden text-muted-foreground sm:flex" aria-label="Favoris">
            <Link href="/favoris">
              <Heart className="h-5 w-5" strokeWidth={1.75} />
              {mounted && <CountBadge value={favCount} />}
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="hidden text-muted-foreground sm:flex" aria-label="Mon compte">
            <Link href="/compte">
              <User className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground"
            aria-label="Panier"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {mounted && <CountBadge value={cartCount} />}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="font-display text-lg">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/favoris" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary">
                  Favoris
                </Link>
                <Link href="/compte" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary">
                  Mon compte
                </Link>
              </nav>
              <div className="mt-6 border-t pt-4">
                <CurrencySelector className="w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
