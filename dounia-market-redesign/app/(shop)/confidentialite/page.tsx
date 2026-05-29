import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Dounia Market',
  description: 'Comment Dounia Market collecte, utilise et protège vos données personnelles.',
}

const SECTIONS = [
  {
    title: '1. Données que nous collectons',
    body: "Nous collectons les informations que vous nous fournissez lors de la création d'un compte et de vos commandes : nom, adresse e-mail, numéro de téléphone, ainsi que les coordonnées des destinataires de vos livraisons.",
  },
  {
    title: '2. Utilisation des données',
    body: 'Vos données servent à traiter vos commandes, organiser les livraisons, vous tenir informé du suivi et améliorer nos services. Nous ne vendons jamais vos données à des tiers.',
  },
  {
    title: '3. Partage des données',
    body: "Vos informations peuvent être partagées avec nos partenaires de livraison uniquement dans la mesure nécessaire à l'acheminement de votre commande à N'Djamena.",
  },
  {
    title: '4. Sécurité',
    body: 'Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé. Les paiements sont traités de manière sécurisée.',
  },
  {
    title: '5. Conservation',
    body: 'Vos données sont conservées le temps nécessaire à la gestion de votre compte et au respect de nos obligations légales.',
  },
  {
    title: '6. Vos droits',
    body: "Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données. Pour exercer ces droits, écrivez-nous à support@douniamarket.com.",
  },
  {
    title: '7. Cookies',
    body: "Notre site utilise des cookies pour assurer son bon fonctionnement et mémoriser vos préférences. Pour en savoir plus, consultez notre politique relative aux cookies.",
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Politique de confidentialité</h1>
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
