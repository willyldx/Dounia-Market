'use client'

import { LogOut, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/stores/auth'

export default function LivreurProfile() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold tracking-tight">Profil</h1>

      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
          {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || 'L'}
        </span>
        <p className="mt-3 font-display text-lg font-bold">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-muted-foreground">Livreur Dounia Market</p>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-soft">
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" /> {user?.email || '-'}
        </p>
        <p className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" /> {user?.phone || 'Non renseigné'}
        </p>
        <p className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Compte vérifié
        </p>
      </div>

      <Button variant="outline" className="mt-4 w-full" size="lg" onClick={() => logout()}>
        <LogOut className="h-4 w-4" /> Déconnexion
      </Button>
    </div>
  )
}
