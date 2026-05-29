import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'À propos - Dounia Market Tchad',
  description:
    "Dounia Market relie la diaspora tchadienne à ses proches en livrant des produits essentiels à N'Djamena.",
}

const VALUES = [
  { icon: Heart, title: 'Proximité', desc: 'Nous rapprochons les familles séparées par la distance.' },
  { icon: ShieldCheck, title: 'Confiance', desc: 'Des commandes claires et un suivi à chaque étape.' },
  { icon: Truck, title: 'Fiabilité', desc: "Une livraison soignée à N'Djamena, dans les zones desservies." },
]

export default function AProposPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Notre histoire</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">À propos de Dounia Market</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Dounia Market est né d'une idée simple : permettre à la diaspora tchadienne d'offrir le nécessaire
          à ses proches restés au pays, sans contrainte de distance.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-soft">
          <Image
            src="/images/home/hero-marketplace.jpg"
            alt="Marché local à N'Djamena"
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            Beaucoup de Tchadiens vivent et travaillent à l'étranger tout en gardant un lien fort avec leur
            famille. Envoyer de l'argent ne suffit pas toujours : il faut souvent connaître les bons commerces,
            organiser les achats et la livraison. Dounia Market simplifie tout cela.
          </p>
          <p>
            Vous choisissez les produits depuis notre catalogue, vous réglez en ligne dans votre devise, et nous
            nous chargeons de préparer la commande et de la remettre à vos proches à N'Djamena. Vous suivez chaque
            étape jusqu'à la livraison.
          </p>
          <p>
            Notre ambition est de devenir le pont de confiance entre la diaspora et le Tchad, en élargissant
            progressivement notre catalogue et nos zones de livraison.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h2 className="mt-4 font-display text-base font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 rounded-2xl bg-secondary/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Envie de faire plaisir à vos proches ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Parcourez notre catalogue dès maintenant.</p>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/catalogue">Voir le catalogue</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
