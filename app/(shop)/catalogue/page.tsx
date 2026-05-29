'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, PackageOpen, SearchX } from 'lucide-react'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    getProducts({ limit: 100 })
      .then((res) => {
        if (active) setProducts(res.products)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'))
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchQuery = !q || p.title.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [products, query, activeCategory])

  return (
    <div className="container-page py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Notre catalogue</h1>
        <p className="mt-3 text-muted-foreground">
          Choisissez les essentiels du quotidien et faites-les livrer a vos proches a N'Djamena.
        </p>
      </header>

      <div className="mt-8 space-y-5">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit"
            aria-label="Rechercher un produit"
            className="h-11 pl-10"
          />
        </div>

        {(loading || categories.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-secondary/60" />
              ))
            ) : (
              <>
                <CategoryChip
                  label="Tout"
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                />
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => location.reload()} />
        ) : products.length === 0 ? (
          <EmptyShop />
        ) : filtered.length === 0 ? (
          <NoResults onReset={() => { setQuery(''); setActiveCategory('all') }} />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  )
}

function EmptyShop() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
        <PackageOpen className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Boutique en preparation</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Nos produits arrivent tres bientot. Revenez dans quelques instants pour decouvrir notre selection.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Retour a l'accueil</Link>
      </Button>
    </div>
  )
}

function NoResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
        <SearchX className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Aucun produit trouve</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Essayez un autre mot-cle ou modifiez le filtre de categorie.
      </p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        Reinitialiser les filtres
      </Button>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
      <h2 className="font-display text-xl font-bold tracking-tight">Chargement impossible</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Une erreur est survenue lors du chargement des produits. Verifiez votre connexion et reessayez.
      </p>
      <Button className="mt-6" onClick={onRetry}>
        Reessayer
      </Button>
    </div>
  )
}
