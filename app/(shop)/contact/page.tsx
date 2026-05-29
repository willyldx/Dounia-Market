import type { Metadata } from 'next'
import { Clock, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = {
  title: 'Contact - Dounia Market',
  description: "Une question ? Contactez l'équipe Dounia Market par e-mail ou via le formulaire.",
}

const INFOS = [
  { icon: Mail, title: 'E-mail', value: 'support@douniamarket.com', href: 'mailto:support@douniamarket.com' },
  { icon: MapPin, title: 'Zone de livraison', value: "N'Djamena, Tchad" },
  { icon: Clock, title: 'Disponibilité', value: 'Du lundi au samedi, 9h - 18h' },
]

export default function ContactPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Nous écrire</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Une question sur une commande, un produit ou la livraison ? Nous sommes là pour vous aider.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {INFOS.map(({ icon: Icon, title, value, href }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 text-sm text-muted-foreground hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted-foreground">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Le formulaire ouvre votre messagerie via mailto (aucun envoi serveur pour le moment). */}
          <form
            action="mailto:support@douniamarket.com"
            method="post"
            encType="text/plain"
            className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="nom" required autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" name="sujet" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Envoyer le message
            </Button>
            <p className="text-xs text-muted-foreground">
              Vous pouvez aussi nous écrire directement à support@douniamarket.com.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
