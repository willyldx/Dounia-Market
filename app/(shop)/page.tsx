import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  Lock,
  Plane,
  ShieldCheck,
  Ship,
  Store,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FeaturedProducts } from '@/components/home/featured-products'

export const metadata: Metadata = {
  title: 'Dounia Market - Marketplace Internationale & Tchad',
  description:
    'Achetez, vendez et expédiez entre le Tchad et la diaspora. Fret aérien express sous 5 à 9 jours, fret maritime et livraison locale à N\'Djamena.',
}

const CATEGORIES = [
  { title: 'Épicerie & essentiels', href: '/catalogue?categorie=epicerie', image: '/images/home/category-essentiels.jpg' },
  { title: 'Scolarité & fournitures', href: '/catalogue?categorie=scolarite', image: '/images/home/category-scolarite.jpg' },
  { title: 'Bébé, soins & hygiène', href: '/catalogue?categorie=bebe-soins', image: '/images/home/category-bebe-soins.jpg' },
]

export default function HomePage() {
  return (
    <div className="container-page flex flex-col gap-12 py-6 md:gap-16 md:py-8">
      {/* Hero banner international & local */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 shadow-md">
        <Image
          src="/images/home/hero-marketplace.jpg"
          alt="Marché à N'Djamena et commerce international"
          width={1600}
          height={700}
          priority
          className="h-[280px] w-full object-cover sm:h-[340px] md:h-[400px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />

        <div className="absolute inset-0 flex max-w-2xl flex-col justify-center gap-4 p-6 sm:p-10 md:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-accent text-accent-foreground">
              Marketplace Internationale & Locale
            </Badge>
            <span className="hidden text-xs text-background/80 sm:inline-block">
              Tchad · France · Europe · Canada
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-background sm:text-3xl md:text-[2.6rem]">
            Le pont commercial direct entre le Tchad et le monde
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-background/90 sm:text-base">
            Commandez des produits locaux certifiés ou recevez vos colis depuis la diaspora par fret aérien express sous 5 à 9 jours avec dédouanement officiel.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
              <Link href="/catalogue">
                Explorer les produits
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/30 bg-background/10 text-background backdrop-blur hover:bg-background/20 hover:text-background"
            >
              <Link href="/suivi">Suivre une expédition</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-background/90 hover:bg-background/15 hover:text-background"
            >
              <Link href="/devenir-vendeur" className="inline-flex items-center gap-1.5">
                <Store className="h-4 w-4" />
                Vendre sur Dounia
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions logistiques transfrontalières (Chantier 3) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Logistique & Expéditions</span>
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
              Nos modes de livraison certifiés
            </h2>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Dédouanement transparent à N'Djamena et suivi d'acheminement en continu
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Card 1: Fret Aérien Express */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Plane className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-xs text-blue-600">
                Diaspora France 🇫🇷
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">Fret Aérien Express</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Expédition directe par avion depuis Paris vers N'Djamena. Idéal pour commandes urgentes, produits de beauté et matériel high-tech.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> 5 à 9 jours ouvrés
              </span>
              <span className="font-semibold text-foreground">Dédouanement inclus</span>
            </div>
          </div>

          {/* Card 2: Fret Maritime & Cargo */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Ship className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-xs text-amber-600">
                Europe & Canada 🇪🇺 🇨🇦
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">Fret Maritime & Cargo</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Solution économique pour colis volumineux, cartons familiaux et matériels lourds expédiés vers le Tchad.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> 15 à 30 jours
              </span>
              <span className="font-semibold text-foreground">Tarif optimisé volume</span>
            </div>
          </div>

          {/* Card 3: Livraison Urbaine Express */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Truck className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-600">
                Stock Local 🇹🇩
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-foreground">Livraison Urbaine N'Djamena</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Livraison à domicile par coursier dans tous les arrondissements de N'Djamena. Paiement en espèces possible à la réception.
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> 24 à 48 heures
              </span>
              <span className="font-semibold text-emerald-600">1 500 FCFA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - immediate browsing */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Catégories vedettes</h2>
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

      {/* Featured Products */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Nos produits disponibles</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">Produits contrôlés et prêts à l'expédition</p>
          </div>
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

      {/* Section Confiance & Garanties (Chantiers 1 & 2) */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-secondary/40 via-card to-card p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Multi-devises</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Payez en FCFA (XAF), EUR, USD ou CAD par carte, Mobile Money ou virement officiel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Marchands vérifiés</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Profilage KYC des vendeurs au Tchad et en diaspora pour garantir l'authenticité.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Paiement à la livraison</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Disponible pour les commandes à N'Djamena jusqu'à un plafond sécurisé de 150 000 FCFA.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Suivi & Dédouanement</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Prise en charge complète des formalités de transit de l'aéroport jusqu'au destinataire.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:p-6">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Vous êtes commerçant au Tchad ou membre de la diaspora ?
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Ouvrez votre boutique en ligne et vendez auprès de milliers de clients locaux et internationaux.
            </p>
          </div>
          <Button asChild className="shrink-0 bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
            <Link href="/devenir-vendeur">Rejoindre la marketplace</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
