import { SiteHeader } from '@/components/shop/site-header'
import { SiteFooter } from '@/components/shop/site-footer'
import { CartDrawer } from '@/components/shop/cart-drawer'

const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://douniamarket.com').replace(/\/$/, '')

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site}/#organization`,
      name: 'Dounia Market Tchad',
      url: site,
      logo: `${site}/logo-icon.svg`,
      description:
        "Dounia Market Tchad permet à la diaspora tchadienne d'offrir l'essentiel à leur famille à N'Djamena.",
    },
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      name: 'Dounia Market Tchad',
      url: site,
      inLanguage: 'fr',
      publisher: { '@id': `${site}/#organization` },
    },
  ],
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  )
}
