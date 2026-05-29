import Link from 'next/link'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-16 text-center text-foreground">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-8 w-8" strokeWidth={1.75} />
      </span>
      <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Erreur 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Page introuvable</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/catalogue">Parcourir le catalogue</Link>
        </Button>
      </div>
    </div>
  )
}
