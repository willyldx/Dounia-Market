import type { Metadata } from 'next'
import Link from 'next/link'
import { CreditCard, ListChecks, PackageCheck, ShoppingCart, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Comment ça marche - Dounia Market',
  description:
    "Découvrez comment commander sur Dounia Market et faire livrer des produits essentiels à vos proches à N'Djamena.",
}

const STEPS = [
  {
    icon: ListChecks,
    title: '1. Choisissez vos produits',
    desc: "Parcourez le catalogue et ajoutez au panier les produits dont votre famille a besoin : épicerie, scolarité, soins et plus encore.",
  },
  {
    icon: CreditCard,
    title: '2. Réglez en ligne',
    desc: "Payez en toute sécurité depuis votre pays, dans la devise de votre choix. Renseignez l'adresse du destinataire à N'Djamena.",
  },
  {
    icon: ShoppingCart,
    title: '3. Nous préparons la commande',
    desc: 'Notre équipe rassemble vos produits avec soin et vérifie chaque article avant la livraison.',
  },
  {
    icon: Truck,
    title: '4. Livraison à vos proches',
    desc: "Nous remettons la commande à votre famille dans les zones desservies de N'Djamena.",
  },
  {
    icon: PackageCheck,
    title: '5. Suivez votre commande',
    desc: 'Suivez le statut de votre commande à tout moment grâce à votre référence, jusqu\'à la livraison.',
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Guide</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Comment ça marche</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Commander pour vos proches au Tchad est simple. Voici les étapes, de la sélection à la livraison.
        </p>

        <ol className="mt-10 space-y-4">
          {STEPS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-3 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Prêt à commander ?</h2>
            <p className="mt-1 text-sm text-primary-foreground/85">
              Le catalogue vous attend, la livraison s'occupe du reste.
            </p>
          </div>
          <Button asChild className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/catalogue">Commencer</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
