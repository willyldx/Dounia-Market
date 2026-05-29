'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Users,
  UserCog,
  Wallet,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sprout,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/stores/auth'

const NAV = [
  { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: '/admin/commandes', label: 'Commandes', icon: Package },
  { href: '/admin/stocks', label: 'Stocks', icon: Warehouse },
  { href: '/admin/livreurs', label: 'Livreurs', icon: Truck },
  { href: '/admin/clients', label: 'Clients', icon: Users },
]
const SUPER_NAV = [
  { href: '/admin/equipe', label: 'Équipe', icon: UserCog },
  { href: '/admin/finances', label: 'Finances', icon: Wallet },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { user, status } = useAuth()
  const role = useAuth((s) => s.role)()
  const logout = useAuth((s) => s.logout)

  useEffect(() => {
    if (status === 'authenticated' && !['admin', 'super_admin'].includes(role)) {
      router.replace('/403')
    }
  }, [status, role, router])

  useEffect(() => setOpen(false), [pathname])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-muted-foreground">
        Chargement...
      </div>
    )
  }
  if (!['admin', 'super_admin'].includes(role)) return null

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const items = role === 'super_admin' ? [...NAV, ...SUPER_NAV] : NAV

  const Sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sprout className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">Dounia Market</p>
          <p className="text-xs text-sidebar-foreground/60">Gestion</p>
        </div>
        <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Voir la boutique
        </a>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || 'A'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {role === 'super_admin' ? 'Direction' : 'Administrateur'}
            </p>
          </div>
          <button
            onClick={() => logout()}
            aria-label="Déconnexion"
            className="text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">{Sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[260px]">{Sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold">Gestion</span>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
