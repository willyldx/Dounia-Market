import Link from 'next/link'
import { Mail, PackageCheck, ShieldCheck, Truck, Sprout } from 'lucide-react'

const COLS = [
  {
    title: 'Boutique',
    links: [
      { href: '/catalogue', label: 'Catalogue' },
      { href: '/suivi', label: 'Suivre une commande' },
      { href: '/favoris', label: 'Favoris' },
      { href: '/compte', label: 'Mon compte' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { href: '/comment-ca-marche', label: 'Comment ça marche' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
      { href: '/a-propos', label: 'À propos' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '/conditions', label: 'Conditions générales' },
      { href: '/confidentialite', label: 'Confidentialité' },
      { href: '/cookies', label: 'Cookies' },
      { href: '/mentions-legales', label: 'Mentions légales' },
    ],
  },
]

const REASSURANCE = [
  { icon: ShieldCheck, title: 'Commande en confiance', desc: 'Vos informations restent protégées' },
  { icon: Truck, title: 'Remis à vos proches', desc: "Livraison à N'Djamena, zones desservies" },
  { icon: PackageCheck, title: 'Toujours informé', desc: 'Suivez votre commande à chaque étape' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="border-b border-border bg-secondary/40">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-3">
          {REASSURANCE.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-9 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-bold">Dounia Market</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Où que vous soyez, offrez le nécessaire à ceux que vous aimez. Nous préparons votre commande et la remettons à votre famille à N'Djamena.
          </p>
          <a
            href="mailto:support@douniamarket.com"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            support@douniamarket.com
          </a>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.title}</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className="text-foreground/80 transition-colors hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dounia Market Tchad. Tous droits réservés.</p>
          <p>Livraison locale à N'Djamena selon zones couvertes.</p>
        </div>
      </div>
    </footer>
  )
}
