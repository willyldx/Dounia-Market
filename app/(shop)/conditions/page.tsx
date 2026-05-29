import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions générales de vente - Dounia Market',
  description: "Conditions générales de vente et d'utilisation de Dounia Market Tchad.",
}

const SECTIONS = [
  {
    title: '1. Objet',
    body: "Les présentes conditions générales régissent l'utilisation du site Dounia Market et les ventes conclues entre Dounia Market et ses clients. Toute commande implique l'acceptation pleine et entière de ces conditions.",
  },
  {
    title: '2. Produits et disponibilité',
    body: "Les produits proposés sont décrits avec le plus grand soin. Ils sont disponibles dans la limite des stocks. En cas d'indisponibilité après commande, nous vous en informons et procédons au remboursement de l'article concerné.",
  },
  {
    title: '3. Prix et paiement',
    body: "Les prix sont indiqués dans la devise sélectionnée. Le paiement s'effectue en ligne au moment de la commande. La commande n'est validée qu'après confirmation du paiement.",
  },
  {
    title: '4. Livraison',
    body: "La livraison est assurée à N'Djamena, dans les zones desservies. Les délais sont communiqués à titre indicatif et peuvent varier selon la disponibilité des produits et la zone de livraison.",
  },
  {
    title: '5. Droit de rétractation et remboursement',
    body: "Toute demande de modification, d'annulation ou de remboursement doit nous être adressée par e-mail dans les meilleurs délais. Nous étudions chaque demande au cas par cas, dans le respect de la réglementation applicable.",
  },
  {
    title: '6. Responsabilité',
    body: "Dounia Market s'engage à préparer et livrer les commandes avec soin. Notre responsabilité ne saurait être engagée en cas d'informations de livraison erronées fournies par le client.",
  },
  {
    title: '7. Données personnelles',
    body: "Le traitement de vos données est décrit dans notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
  },
  {
    title: '8. Contact',
    body: 'Pour toute question relative aux présentes conditions, contactez-nous à support@douniamarket.com.',
  },
]

export default function ConditionsPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Conditions générales de vente</h1>
        <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour : mai 2026</p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-foreground/90">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
