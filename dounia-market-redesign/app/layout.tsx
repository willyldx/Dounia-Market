import type { Metadata } from 'next'
import { Sora, Manrope } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://douniamarket.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dounia Market Tchad - Produits pour vos proches à N'Djamena",
    template: '%s | Dounia Market Tchad',
  },
  description:
    "Depuis l'étranger, offrez l'essentiel à votre famille à N'Djamena. Choisissez parmi des produits disponibles localement, nous les livrons à vos proches.",
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'fr_TD',
    siteName: 'Dounia Market Tchad',
    images: ['/og-default.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${sora.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
