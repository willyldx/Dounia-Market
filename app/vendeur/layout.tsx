'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/stores/auth'

const NAV_ITEMS = [
  { href: '/vendeur', label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: '/vendeur/produits', label: 'Mes Produits', icon: Package },
  { href: '/vendeur/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/vendeur/finances', label: 'Finances & Payouts', icon: Wallet },
  { href: '/vendeur/parametres', label: 'Boutique & KYC', icon: ShieldCheck },
]

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { user, status } = useAuth()
  const role = useAuth((s) => s.role)()
  const logout = useAuth((s) => s.logout)

  useEffect(() => {
    if (status === 'guest') {
      router.replace('/auth/login?redirect=/vendeur')
    } else if (status === 'authenticated' && !['merchant', 'admin', 'super_admin'].includes(role)) {
      router.replace('/devenir-vendeur')
    }
  }, [status, role, router])

  useEffect(() => setOpen(false), [pathname])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-muted-foreground">
        Chargement de l'espace marchand...
      </div>
    )
  }

  if (!['merchant', 'admin', 'super_admin'].includes(role)) return null

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const Sidebar = (
    <div className="flex h-full flex-col bg-card border-r border-border text-foreground">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Store className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-tight">Dounia Marchand</p>
          <p className="text-[11px] text-muted-foreground">Espace Vendeur Diaspora & Local</p>
        </div>
        <button
          className="ml-auto text-muted-foreground hover:text-foreground lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Voir la boutique client
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="border-t border-border p-4 bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
            {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || 'V'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {role === 'merchant' ? 'Marchand Partenaire' : 'Admin'}
            </p>
          </div>
          <button
            onClick={() => logout()}
            aria-label="Déconnexion"
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
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
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-xs" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[260px]">{Sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Menu" className="p-1 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display font-bold">Dounia Marchand</span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary uppercase">
            Espace Vendeur
          </span>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
