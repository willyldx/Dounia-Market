import type { Metadata } from 'next'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'FAQ - Dounia Market',
  description: 'Questions fréquentes sur les commandes, la livraison et le paiement chez Dounia Market.',
}

const FAQ = [
  {
    q: 'Comment passer une commande pour ma famille ?',
    a: "Choisissez vos produits dans le catalogue, ajoutez-les au panier, puis renseignez l'adresse du destinataire à N'Djamena lors du paiement. Nous nous occupons du reste.",
  },
  {
    q: 'Dans quelle devise puis-je payer ?',
    a: "Vous pouvez régler dans plusieurs devises depuis votre pays. Le prix s'affiche dans la devise sélectionnée et la conversion se fait automatiquement.",
  },
  {
    q: 'Où livrez-vous ?',
    a: "Nous livrons à N'Djamena, dans les zones desservies. Si votre quartier n'est pas couvert, contactez-nous pour trouver une solution.",
  },
  {
    q: 'Combien de temps prend la livraison ?',
    a: "Les délais dépendent de la disponibilité des produits et de la zone. Vous suivez l'avancement de votre commande à chaque étape grâce à votre référence.",
  },
  {
    q: 'Comment suivre ma commande ?',
    a: "Rendez-vous sur la page Suivi et saisissez votre référence de commande. Si vous avez un compte, retrouvez aussi vos commandes dans votre espace personnel.",
  },
  {
    q: 'Puis-je modifier ou annuler une commande ?',
    a: "Contactez-nous au plus vite par e-mail. Tant que la préparation n'a pas commencé, nous ferons notre possible pour modifier ou annuler votre commande.",
  },
  {
    q: 'Mes informations de paiement sont-elles sécurisées ?',
    a: 'Oui. Les paiements sont traités de manière sécurisée et nous ne conservons pas vos données bancaires.',
  },
]

export default function FaqPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Aide</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Questions fréquentes</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Les réponses aux questions les plus courantes. Vous ne trouvez pas la vôtre ?
        </p>

        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-sm text-muted-foreground">
          Une autre question ?{' '}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Contactez-nous
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
