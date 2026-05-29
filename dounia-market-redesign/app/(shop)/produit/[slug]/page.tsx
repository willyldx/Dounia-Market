import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/products'
import { ProductGallery } from '@/components/shop/product-gallery'
import { BuyBox } from '@/components/shop/buy-box'
import { ProductCard } from '@/components/shop/product-card'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) {
    return { title: 'Produit introuvable - Dounia Market' }
  }
  const description =
    product.subtitle ||
    product.description?.slice(0, 160) ||
    `Commandez ${product.title} et faites-le livrer a vos proches a N'Djamena.`
  return {
    title: `${product.title} - Dounia Market`,
    description,
    openGraph: {
      title: product.title,
      description,
      images: product.thumbnail || product.images?.[0] ? [product.thumbnail || product.images![0]] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const images = (product.images && product.images.length > 0 ? product.images : [product.thumbnail]).filter(
    Boolean,
  ) as string[]

  let related = product.category
    ? (await getProducts({ category: product.categoryHandle || product.category, limit: 5 })).products.filter(
        (p) => p.id !== product.id,
      )
    : []
  related = related.slice(0, 4)

  return (
    <div className="container-page py-10 md:py-14">
      <nav className="text-sm text-muted-foreground">
        <Link href="/catalogue" className="hover:text-foreground">
          Catalogue
        </Link>
        {product.category && (
          <>
            <span className="px-2">/</span>
            <Link
              href={`/categories/${encodeURIComponent(product.categoryHandle || product.category)}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={images} title={product.title} />
        <BuyBox product={product} />
      </div>

      {product.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl font-bold tracking-tight">Description</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">Produits similaires</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
