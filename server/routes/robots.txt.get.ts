const disallowedPaths = [
  '/admin',
  '/livreur',
  '/compte',
  '/auth',
  '/checkout',
  '/panier',
  '/favoris',
  '/suivi',
  '/api',
]

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'https://douniamarket.com').replace(/\/+$/, '')
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallowedPaths.map(path => `Disallow: ${path}`),
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ]

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
