'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { PageHeader, LoadingRows, EmptyState } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '-') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function AdminLivreurs() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [saving, setSaving] = useState(false)

  function load() {
    if (!token) return
    setLoading(true)
    adminApi
      .livreurs(token)
      .then((res) => setRows(res?.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [token])

  async function create() {
    if (!token) return
    setSaving(true)
    try {
      await adminApi.livreurCreate(token, form)
      toast.success('Livreur ajouté')
      setOpen(false)
      setForm({ name: '', email: '', phone: '', password: '' })
      load()
    } catch {
      toast.error("Échec de l'ajout")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!token) return
    try {
      await adminApi.livreurDelete(token, id)
      setRows((r) => r.filter((x) => pick(x, ['id']) !== id))
      toast.success('Livreur supprimé')
    } catch {
      toast.error('Échec de la suppression')
    }
  }

  return (
    <div>
      <PageHeader
        title="Livreurs"
        subtitle="Votre équipe de livraison à N'Djamena."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Ajouter un livreur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Nouveau livreur</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {(['name', 'email', 'phone', 'password'] as const).map((k) => (
                  <div key={k} className="space-y-1.5">
                    <Label className="capitalize">
                      {k === 'name' ? 'Nom' : k === 'password' ? 'Mot de passe' : k === 'phone' ? 'Téléphone' : 'Email'}
                    </Label>
                    <Input
                      type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
                      value={form[k]}
                      onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={create} disabled={saving || !form.name || !form.email}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <LoadingRows rows={5} />
      ) : error ? (
        <EmptyState title="Données indisponibles" />
      ) : rows.length === 0 ? (
        <EmptyState title="Aucun livreur" hint="Ajoutez votre premier livreur pour commencer." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((l, i) => (
            <div key={pick(l, ['id'], i)} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-semibold">{pick(l, ['name', 'full_name'])}</p>
                  <p className="text-sm text-muted-foreground">{pick(l, ['email'])}</p>
                  <p className="text-sm text-muted-foreground">{pick(l, ['phone'], '')}</p>
                </div>
                <button
                  onClick={() => remove(pick(l, ['id']))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
