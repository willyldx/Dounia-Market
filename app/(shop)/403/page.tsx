import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Accès refusé - Dounia Market',
  description: "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
}

export default function ForbiddenPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" strokeWidth={1.75} />
      </span>
      <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Erreur 403
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Accès refusé</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Vous n'avez pas les autorisations nécessaires pour consulter cette page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/compte">Mon compte</Link>
        </Button>
      </div>
    </div>
  )
}
