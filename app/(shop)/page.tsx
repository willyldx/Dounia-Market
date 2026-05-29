import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  ListChecks,
  MapPin,
  PackageCheck,
  ShoppingCart,
  Sprout,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = {
  title: 'Dounia Market Tchad - Offrez le nécessaire à vos proches à N\'Djamena',
  description:
    "Depuis l'étranger, commandez des produits essentiels et faites-les livrer à votre famille à N'Djamena. Épicerie, scolarité, bébé et soins.",
}

const TRUST_PILLS = [
  { icon: Truck, label: "Livré à N'Djamena" },
  { icon: Sprout, label: "Produits d'ici" },
  { icon: PackageCheck, label: 'Suivi de commande' },
]

const STEPS = [
  {
    icon: ListChecks,
    title: 'Choisissez',
    desc: 'Parcourez le catalogue et sélectionnez les produits du quotidien pour votre famille.',
  },
  {
    icon: ShoppingCart,
    title: 'Commandez',
    desc: 'Réglez en toute simplicité depuis votre pays, dans la devise de votre choix.',
  },
  {
    icon: Truck,
    title: 'On livre',
    desc: "Nous préparons votre commande et la remettons à vos proches à N'Djamena.",
  },
]

const CATEGORIES = [
  {
    title: 'Épicerie & essentiels',
    desc: 'Le nécessaire pour la maison',
    href: '/catalogue?categorie=epicerie',
    image: '/images/home/category-essentiels.jpg',
  },
  {
    title: 'Scolarité',
    desc: 'Fournitures et cartables',
    href: '/catalogue?categorie=scolarite',
    image: '/images/home/category-scolarite.jpg',
  },
  {
    title: 'Bébé & soins',
    desc: 'Pour les plus petits',
    href: '/catalogue?categorie=bebe-soins',
    image: '/images/home/category-bebe-soins.jpg',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero - asymmetric split */}
      <section className="container-page pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Le nécessaire, livré à ceux que vous aimez
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Où que vous soyez, commandez l'essentiel et nous le remettons à votre famille à N'Djamena.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/catalogue">
                  Parcourir le catalogue
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/comment-ca-marche">Comment ça marche</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {TRUST_PILLS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground/80"
                >
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
              <Image
                src="/images/home/hero-marketplace.jpg"
                alt="Marché local à N'Djamena"
                width={960}
                height={1040}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-soft sm:flex sm:items-center sm:gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Remis sur place</p>
                <p className="text-xs text-muted-foreground">Zones desservies à N'Djamena</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche - 3 steps with rhythm */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-page py-14 md:py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Simple et fiable</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Comment ça marche
            </h2>
          </div>

          <Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li
                key={title}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl font-bold text-border">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Notre sélection
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Des produits du quotidien, prêts à être livrés.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Tout voir
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>

        <div className="mt-8">
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories - image tiles */}
      <section className="container-page pb-14 md:pb-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Explorez par rayon</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl border border-border shadow-soft"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={640}
                  height={480}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-background">{cat.title}</h3>
                  <p className="text-sm text-background/80">{cat.desc}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/95 text-foreground transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
