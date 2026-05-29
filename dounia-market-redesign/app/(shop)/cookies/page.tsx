import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de cookies - Dounia Market',
  description: 'Informations sur les cookies utilisés par Dounia Market et comment les gérer.',
}

const SECTIONS = [
  {
    title: '1. Qu\'est-ce qu\'un cookie ?',
    body: "Un cookie est un petit fichier déposé sur votre appareil lorsque vous visitez un site. Il permet de mémoriser certaines informations afin de faciliter votre navigation.",
  },
  {
    title: '2. Cookies que nous utilisons',
    body: "Nous utilisons des cookies essentiels au fonctionnement du site (panier, session, préférence de devise) et, le cas échéant, des cookies de mesure d'audience pour améliorer nos services.",
  },
  {
    title: '3. Cookies essentiels',
    body: 'Ces cookies sont indispensables au bon fonctionnement du site. Sans eux, certaines fonctions comme le panier ou la connexion ne pourraient pas fonctionner. Ils ne nécessitent pas votre consentement.',
  },
  {
    title: '4. Gérer les cookies',
    body: "Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou supprimer les cookies. Le refus de certains cookies peut toutefois limiter votre expérience sur le site.",
  },
  {
    title: '5. Contact',
    body: 'Pour toute question concernant notre utilisation des cookies, écrivez-nous à support@douniamarket.com.',
  },
]

export default function CookiesPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Politique de cookies</h1>
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
