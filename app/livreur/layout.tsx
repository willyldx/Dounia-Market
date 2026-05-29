'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Package, History, User, LogOut, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/stores/auth'

const NAV = [
  { href: '/livreur', label: 'Livraisons', icon: Package, exact: true },
  { href: '/livreur/historique', label: 'Historique', icon: History },
  { href: '/livreur/profil', label: 'Profil', icon: User },
]

export default function LivreurLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, status } = useAuth()
  const role = useAuth((s) => s.role)()
  const logout = useAuth((s) => s.logout)
  const [online, setOnline] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && !['livreur', 'admin', 'super_admin'].includes(role)) {
      router.replace('/403')
    }
  }, [status, role, router])

  if (status === 'idle' || status === 'loading') {
    return <div className="flex min-h-[100dvh] items-center justify-center text-muted-foreground">Chargement...</div>
  }
  if (!['livreur', 'admin', 'super_admin'].includes(role)) return null

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center gap-2 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sprout className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="font-display font-bold">Livreur</span>
          <div className="ml-auto flex items-center gap-2">
            <span className={cn('text-xs font-medium', online ? 'text-success' : 'text-muted-foreground')}>
              {online ? 'En ligne' : 'Hors ligne'}
            </span>
            <Switch checked={online} onCheckedChange={setOnline} aria-label="Disponibilité" />
            <button onClick={() => logout()} aria-label="Déconnexion" className="ml-1 text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className={cn('h-6 w-6', active && 'text-primary')} strokeWidth={active ? 2.2 : 1.75} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
