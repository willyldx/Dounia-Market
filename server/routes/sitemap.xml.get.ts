type PublicProduct = {
  slug?: unknown
  category_handle?: unknown
  updated_at?: unknown
}

type SitemapEntry = {
  loc: string
  lastmod?: string
}

const staticPublicRoutes = [
  '/',
  '/catalogue',
  '/a-propos',
  '/comment-ca-marche',
  '/faq',
  '/contact',
  '/conditions',
  '/confidentialite',
  '/mentions-legales',
  '/cookies',
]

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function normalizeLastModified(value: unknown) {
  if (typeof value !== 'string') return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString()
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (String(config.public.searchIndexingEnabled) !== 'true') {
    setResponseStatus(event, 404)
    setHeader(event, 'content-type', 'text/plain; charset=utf-8')
    return 'Sitemap indisponible avant ouverture publique.\n'
  }

  const siteUrl = String(config.public.siteUrl || 'https://douniamarket.com').replace(/\/+$/, '')
  const apiUrl = String(config.public.apiUrl || 'https://api.douniamarket.com/api').replace(/\/+$/, '')
  const entries = new Map<string, SitemapEntry>(
    staticPublicRoutes.map(path => [path, { loc: new URL(path, `${siteUrl}/`).href }])
  )

  try {
    const response = await $fetch<{ products?: PublicProduct[] }>(`${apiUrl}/products`, {
      query: { limit: 1000 },
    })

    for (const product of response.products || []) {
      if (typeof product.slug === 'string' && product.slug.trim()) {
        const path = `/produit/${encodeURIComponent(product.slug.trim())}`
        const lastmod = normalizeLastModified(product.updated_at)
        entries.set(path, {
          loc: new URL(path, `${siteUrl}/`).href,
          ...(lastmod ? { lastmod } : {}),
        })
      }

      if (typeof product.category_handle === 'string' && product.category_handle.trim()) {
        const path = `/categories/${encodeURIComponent(product.category_handle.trim())}`
        entries.set(path, { loc: new URL(path, `${siteUrl}/`).href })
      }
    }
  } catch {
    // Keep static public routes available if the catalogue API is temporarily unavailable.
  }

  const body = [...entries.values()]
    .map(({ loc, lastmod }) => [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
      '  </url>',
    ].join('\n'))
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n')
}, {
  maxAge: 60 * 60,
  name: 'public-sitemap',
})
