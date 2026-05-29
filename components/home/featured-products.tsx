'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { getProducts } from '@/lib/products'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/shop/product-card'
import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton'
import { Button } from '@/components/ui/button'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    getProducts({ limit: 8 })
      .then((res) => {
        if (!active) return
        setProducts(res.products)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (status === 'error' || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <PackageSearch className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold">Le catalogue arrive bientôt</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Nous préparons une sélection de produits essentiels. Revenez très vite.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/catalogue">Voir le catalogue</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
