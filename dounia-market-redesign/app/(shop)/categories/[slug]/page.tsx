'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { PackageOpen } from 'lucide-react'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton'
import { Button } from '@/components/ui/button'

function titleFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const title = titleFromSlug(slug)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    getProducts({ category: slug, limit: 100 })
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
  }, [slug])

  return (
    <div className="container-page py-10 md:py-14">
      <nav className="text-sm text-muted-foreground">
        <Link href="/catalogue" className="hover:text-foreground">
          Catalogue
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          Tous nos produits de la categorie {title.toLowerCase()}, prets a etre livres a N'Djamena.
        </p>
      </header>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
            <h2 className="font-display text-xl font-bold tracking-tight">Chargement impossible</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Une erreur est survenue. Verifiez votre connexion et reessayez.
            </p>
            <Button className="mt-6" onClick={() => location.reload()}>
              Reessayer
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
              <PackageOpen className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Aucun produit ici</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Cette categorie ne contient pas encore de produits. Decouvrez le reste de notre catalogue.
            </p>
            <Button asChild className="mt-6">
              <Link href="/catalogue">Voir tout le catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
