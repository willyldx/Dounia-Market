import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales - Dounia Market',
  description: 'Mentions légales et informations sur l\'éditeur du site Dounia Market Tchad.',
}

const SECTIONS = [
  {
    title: 'Éditeur du site',
    body: "Le site Dounia Market est édité par Dounia Market Tchad. Pour toute demande, vous pouvez nous contacter à l'adresse support@douniamarket.com.",
  },
  {
    title: 'Responsable de la publication',
    body: "Le responsable de la publication est la direction de Dounia Market Tchad.",
  },
  {
    title: 'Hébergement',
    body: "Le site est hébergé par un prestataire technique tiers garantissant la disponibilité et la sécurité du service.",
  },
  {
    title: 'Propriété intellectuelle',
    body: "L'ensemble des contenus présents sur le site (textes, images, logos) est protégé. Toute reproduction sans autorisation préalable est interdite.",
  },
  {
    title: 'Responsabilité',
    body: "Dounia Market s'efforce d'assurer l'exactitude des informations diffusées sur le site, sans pouvoir en garantir l'exhaustivité à tout moment.",
  },
  {
    title: 'Contact',
    body: 'Pour toute question relative aux présentes mentions légales, écrivez-nous à support@douniamarket.com.',
  },
]

export default function MentionsLegalesPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Mentions légales</h1>
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
