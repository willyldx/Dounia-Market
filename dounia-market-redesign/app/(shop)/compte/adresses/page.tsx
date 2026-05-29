'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import type { Address } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Draft = {
  id?: string
  label: string
  recipientName: string
  phone: string
  line1: string
  city: string
  country: string
  isDefault: boolean
}

const EMPTY: Draft = {
  label: '',
  recipientName: '',
  phone: '',
  line1: '',
  city: "N'Djamena",
  country: 'Tchad',
  isDefault: false,
}

function genId() {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export default function AdressesPage() {
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const saveAddresses = useAuth((s) => s.saveAddresses)

  const addresses: Address[] = user?.addresses ?? []
  const [editing, setEditing] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  const loading = status === 'idle' || status === 'loading' || !user

  function startAdd() {
    setEditing({ ...EMPTY, isDefault: addresses.length === 0 })
  }

  function startEdit(a: Address) {
    setEditing({
      id: a.id,
      label: a.label ?? '',
      recipientName: a.recipientName ?? '',
      phone: a.phone ?? '',
      line1: a.line1 ?? '',
      city: a.city ?? '',
      country: a.country ?? '',
      isDefault: a.isDefault ?? false,
    })
  }

  async function commit(next: Address[]) {
    setSaving(true)
    const res = await saveAddresses(next)
    setSaving(false)
    return res.success
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    if (!editing.recipientName.trim() || !editing.line1.trim() || !editing.city.trim()) {
      toast.error('Renseignez au moins le destinataire, l\'adresse et la ville.')
      return
    }
    const entry: Address = {
      id: editing.id ?? genId(),
      label: editing.label.trim() || undefined,
      recipientName: editing.recipientName.trim(),
      phone: editing.phone.trim() || undefined,
      line1: editing.line1.trim(),
      city: editing.city.trim(),
      country: editing.country.trim() || undefined,
      isDefault: editing.isDefault,
    }

    let next = editing.id
      ? addresses.map((a) => (a.id === editing.id ? entry : a))
      : [...addresses, entry]

    // Only one default.
    if (entry.isDefault) {
      next = next.map((a) => (a.id === entry.id ? a : { ...a, isDefault: false }))
    }

    const ok = await commit(next)
    if (ok) {
      toast.success(editing.id ? 'Adresse mise à jour' : 'Adresse ajoutée')
      setEditing(null)
    } else {
      toast.error("L'enregistrement a échoué")
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return
    const next = addresses.filter((a) => a.id !== id)
    const ok = await commit(next)
    if (ok) toast.success('Adresse supprimée')
    else toast.error('La suppression a échoué')
  }

  async function makeDefault(id?: string) {
    if (!id) return
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    const ok = await commit(next)
    if (ok) toast.success('Adresse par défaut mise à jour')
  }

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/compte"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Mon compte
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Mes adresses</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gérez les adresses de livraison de vos proches.
            </p>
          </div>
          {!editing && !loading && (
            <Button onClick={startAdd}>
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Ajouter
            </Button>
          )}
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : editing ? (
          <form
            onSubmit={handleSave}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h2 className="font-display text-lg font-semibold">
              {editing.id ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="label">Libellé</Label>
              <Input
                id="label"
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                placeholder="Maison, Famille..."
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="recipientName">Destinataire</Label>
                <Input
                  id="recipientName"
                  value={editing.recipientName}
                  onChange={(e) => setEditing({ ...editing, recipientName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="line1">Adresse</Label>
              <Input
                id="line1"
                value={editing.line1}
                onChange={(e) => setEditing({ ...editing, line1: e.target.value })}
                placeholder="Quartier, rue, repères..."
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={editing.city}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={editing.country}
                  onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={editing.isDefault}
                onCheckedChange={(v) => setEditing({ ...editing, isDefault: v === true })}
              />
              Définir comme adresse par défaut
            </label>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Enregistrement
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </form>
        ) : addresses.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <MapPin className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Aucune adresse enregistrée</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Ajoutez l'adresse de la personne qui recevra vos commandes à N'Djamena.
            </p>
            <Button className="mt-6" onClick={startAdd}>
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              Ajouter une adresse
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={cn(
                  'rounded-2xl border bg-card p-5',
                  a.isDefault ? 'border-primary/40' : 'border-border',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{a.label || a.recipientName || 'Adresse'}</p>
                      {a.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          <Star className="h-3 w-3 fill-primary" strokeWidth={1.75} />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.recipientName && <span className="text-foreground">{a.recipientName}</span>}
                      {a.recipientName && a.phone && ' - '}
                      {a.phone}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {[a.line1, a.city, a.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" aria-label="Modifier" onClick={() => startEdit(a)}>
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Supprimer"
                      onClick={() => handleDelete(a.id)}
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                  </div>
                </div>
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => makeDefault(a.id)}
                    disabled={saving}
                    className="mt-3 text-sm font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    Définir par défaut
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
