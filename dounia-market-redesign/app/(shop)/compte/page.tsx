'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, LogOut, MapPin, Package, User2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const LINKS = [
  { href: '/compte/commandes', icon: Package, title: 'Mes commandes', desc: 'Suivez vos commandes en cours et passées' },
  { href: '/compte/profil', icon: User2, title: 'Mon profil', desc: 'Modifiez vos informations personnelles' },
  { href: '/compte/adresses', icon: MapPin, title: 'Mes adresses', desc: 'Gérez vos adresses de livraison' },
]

export default function ComptePage() {
  const router = useRouter()
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const logout = useAuth((s) => s.logout)

  async function handleLogout() {
    await logout()
    toast.success('Vous êtes déconnecté')
    router.push('/')
  }

  if (status === 'idle' || status === 'loading' || (!user && status !== 'guest')) {
    return (
      <div className="container-page py-10 md:py-14">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-80" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const greetingName = user?.firstName || user?.name || ''

  return (
    <div className="container-page py-10 md:py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Bonjour{greetingName ? `, ${greetingName}` : ''}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gérez vos commandes, votre profil et vos adresses de livraison.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Se déconnecter
        </Button>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
