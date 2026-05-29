import { apiFetch } from './api'
import type { Product } from './types'

function normalize(p: any): Product {
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
