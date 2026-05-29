import type { MetadataRoute } from 'next'

const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://douniamarket.com').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/livreur', '/compte', '/auth', '/checkout', '/panier', '/favoris', '/suivi', '/api'],
    },
    sitemap: `${site}/sitemap.xml`,
  }
}
