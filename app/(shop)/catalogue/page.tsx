'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown, Search, PackageOpen, SearchX } from 'lucide-react'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'nom', label: 'Nom A-Z' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

function isSortValue(v: string | null): v is SortValue {
  return SORT_OPTIONS.some((o) => o.value === v)
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueContent />
    </Suspense>
  )
}

function CatalogueContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Filter/sort state lives in the URL so results are shareable and survive back navigation.
  const query = searchParams.get('q') ?? ''
  const activeCategory = searchParams.get('cat') ?? 'all'
  const sortParam = searchParams.get('tri')
  const sort: SortValue = isSortValue(sortParam) ? sortParam : 'pertinence'
  const inStockOnly = searchParams.get('stock') === '1'

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  useEffect(() => {
    let active = true
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
    const list = products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchQuery = !q || p.title.toLowerCase().includes(q)
      const matchStock = !inStockOnly || p.inStock !== false
      return matchCat && matchQuery && matchStock
    })
    switch (sort) {
      case 'prix-asc':
        return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      case 'prix-desc':
        return [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      case 'nom':
        return [...list].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
      default:
        return list
    }
  }, [products, query, activeCategory, sort, inStockOnly])

  return (
    <div className="container-page py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Notre catalogue</h1>
        <p className="mt-3 text-muted-foreground">
          Choisissez les essentiels du quotidien et faites-les livrer a vos proches a N'Djamena.
        </p>
      </header>

      <div className="mt-8 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setParams({ q: e.target.value })}
              placeholder="Rechercher un produit"
              aria-label="Rechercher un produit"
              className="h-11 pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            <Select value={sort} onValueChange={(v) => setParams({ tri: v === 'pertinence' ? null : v })}>
              <SelectTrigger className="h-11 w-[180px]" aria-label="Trier les produits">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox
                id="stock-only"
                checked={inStockOnly}
                onCheckedChange={(checked) => setParams({ stock: checked === true ? '1' : null })}
              />
              <Label htmlFor="stock-only" className="cursor-pointer text-sm font-medium">
                En stock
              </Label>
            </div>
          </div>
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
                  onClick={() => setParams({ cat: null })}
                />
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => setParams({ cat })}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="mt-8">
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
          <NoResults onReset={() => setParams({ q: null, cat: null, tri: null, stock: null })} />
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

function CatalogueSkeleton() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-secondary/60" />
      <div className="mt-8 h-11 w-full max-w-md animate-pulse rounded-lg bg-secondary/60" />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
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
        Essayez un autre mot-cle ou modifiez les filtres.
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
