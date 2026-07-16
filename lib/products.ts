import { apiFetch } from './api'
import type { Product, ProductVariant } from './types'

function normalizeVariant(v: any): ProductVariant | null {
  if (!v || v.id == null) return null
  const title = v.title || v.name || [v.option, v.value].filter(Boolean).join(' ')
  if (!title) return null
  return {
    id: String(v.id),
    title,
    price: typeof v.price === 'number' && Number.isFinite(v.price) ? v.price : undefined,
    inStock: v.in_stock === true ? true : v.in_stock === false ? false : undefined,
    thumbnail: v.thumbnail || v.image || undefined,
  }
}

function normalize(p: any): Product {
  const variants = Array.isArray(p.variants)
    ? (p.variants.map(normalizeVariant).filter(Boolean) as ProductVariant[])
    : undefined
  return {
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle || '',
    description: p.description || '',
    price: typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : undefined,
    thumbnail: p.thumbnail || '',
    images: p.images || [],
    category: typeof p.category === 'string' ? p.category : p.category?.name || '',
    categoryHandle: p.category_handle || p.categoryHandle || '',
    inStock: p.in_stock === true ? true : p.in_stock === false ? false : undefined,
    variants: variants && variants.length > 0 ? variants : undefined,
    createdAt: typeof p.created_at === 'string' ? p.created_at : undefined,
  }
}

export async function getProducts(params?: {
  limit?: number
  category?: string
  q?: string
}): Promise<{ products: Product[]; count: number }> {
  const res = await apiFetch<{ products: any[]; count: number }>('products', {
    query: { limit: params?.limit, category: params?.category, q: params?.q },
    revalidate: 60,
  })
  return { products: (res.products || []).map(normalize), count: res.count ?? 0 }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await apiFetch<{ product: any }>(`products/${encodeURIComponent(slug)}`, {
      revalidate: 60,
    })
    return res.product ? normalize(res.product) : null
  } catch {
    return null
  }
}
