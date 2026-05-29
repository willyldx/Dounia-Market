import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedProducts } from '@/components/home/featured-products'

export const metadata: Metadata = {
  title: 'Dounia Market Tchad - Offrez le nécessaire à vos proches à N\'Djamena',
  description:
    "Commandez des produits essentiels depuis l'étranger et faites-les livrer à votre famille à N'Djamena.",
}

const CATEGORIES = [
  { title: 'Épicerie & essentiels', href: '/catalogue?categorie=epicerie', image: '/images/home/category-essentiels.jpg' },
  { title: 'Scolarité', href: '/catalogue?categorie=scolarite', image: '/images/home/category-scolarite.jpg' },
  { title: 'Bébé & soins', href: '/catalogue?categorie=bebe-soins', image: '/images/home/category-bebe-soins.jpg' },
]

export default function HomePage() {
  return (
    <div className="container-page flex flex-col gap-12 py-6 md:gap-16 md:py-8">
      {/* Compact hero banner */}
      <section className="relative overflow-hidden rounded-3xl">
        <Image
          src="/images/home/hero-marketplace.jpg"
          alt="Marché à N'Djamena"
          width={1600}
          height={700}
          priority
          className="h-[240px] w-full object-cover md:h-[340px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/45 to-transparent" />
        <div className="absolute inset-0 flex max-w-xl flex-col justify-center gap-5 p-6 md:p-12">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-background md:text-[2.6rem]">
            Le nécessaire, livré à votre famille à N'Djamena
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/catalogue">
                Voir les produits
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/30 bg-background/10 text-background backdrop-blur hover:bg-background/20 hover:text-background"
            >
              <Link href="/suivi">Suivre une commande</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories - immediate browsing */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Catégories</h2>
          <Link href="/catalogue" className="text-sm font-semibold text-accent hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl border border-border"
            >
              <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={520}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-background sm:p-4 sm:text-base">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Products - the content, front and center */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Nos produits</h2>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Tout le catalogue
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
        <FeaturedProducts />
      </section>
    </div>
  )
}
