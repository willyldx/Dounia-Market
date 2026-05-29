import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://douniamarket.com').replace(/\/$/, '')

const STATIC = [
  '',
  '/catalogue',
  '/comment-ca-marche',
  '/a-propos',
  '/contact',
  '/faq',
  '/conditions',
  '/confidentialite',
  '/cookies',
  '/mentions-legales',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = STATIC.map((path) => ({
    url: `${site}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  try {
    const { products } = await getProducts({ limit: 200 })
    const productEntries: MetadataRoute.Sitemap = products
      .filter((p) => p.slug)
      .map((p) => ({ url: `${site}/produit/${p.slug}`, changeFrequency: 'weekly', priority: 0.6 }))
    return [...base, ...productEntries]
  } catch {
    return base
  }
}
