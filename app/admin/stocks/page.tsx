'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader, LoadingRows, EmptyState, formatMoney } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

export default function AdminStocks() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [draft, setDraft] = useState<Record<string, { price?: string; stock?: string }>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function load() {
    if (!token) return
    setLoading(true)
    setError(false)
    adminApi
      .stocks(token)
      .then((res) => setRows(res?.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [token])

  async function save(id: string, current: any) {
    if (!token) return
    const d = draft[id] || {}
    const body: Record<string, unknown> = {}
    if (d.price !== undefined) body.price = Number(d.price)
    if (d.stock !== undefined) body.stock = Number(d.stock)
    if (Object.keys(body).length === 0) return
    setSavingId(id)
    try {
      await adminApi.stockUpdate(token, Number(id), body)
      toast.success('Produit mis à jour')
      setRows((r) => r.map((p) => (String(pick(p, ['id'])) === id ? { ...p, ...body } : p)))
      setDraft((s) => ({ ...s, [id]: {} }))
    } catch {
      toast.error('Échec de la mise à jour')
    } finally {
      setSavingId(null)
    }
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !token) return
    toast.loading('Import en cours...', { id: 'imp' })
    try {
      const res = await adminApi.stockImport(token, file)
      toast.success(res?.message || 'Import terminé', { id: 'imp' })
      load()
    } catch {
      toast.error("Échec de l'import", { id: 'imp' })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <PageHeader
        title="Stocks"
        subtitle="Gérez vos produits, prix et disponibilités."
        action={
          <>
            <input ref={fileRef} type="file" accept=".csv" hidden onChange={onImport} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Importer un CSV
            </Button>
          </>
        }
      />

      {loading ? (
        <LoadingRows rows={8} />
      ) : error ? (
        <EmptyState title="Données indisponibles" hint="Réessayez dans quelques instants." />
      ) : rows.length === 0 ? (
        <EmptyState title="Aucun produit" hint="Importez un fichier CSV pour ajouter des produits." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Prix (EUR)</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p, i) => {
                const id = String(pick(p, ['id'], i))
                const d = draft[id] || {}
                const dirty = d.price !== undefined || d.stock !== undefined
                return (
                  <tr key={id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{pick(p, ['title', 'name'])}</p>
                      <p className="text-xs text-muted-foreground">{pick(p, ['category', 'category_name'], '')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        className="h-9 w-28"
                        defaultValue={pick(p, ['price'], '')}
                        onChange={(e) => setDraft((s) => ({ ...s, [id]: { ...s[id], price: e.target.value } }))}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        className="h-9 w-24"
                        defaultValue={pick(p, ['stock', 'inventory', 'quantity'], '')}
                        onChange={(e) => setDraft((s) => ({ ...s, [id]: { ...s[id], stock: e.target.value } }))}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={dirty ? 'default' : 'ghost'} disabled={!dirty || savingId === id} onClick={() => save(id, p)}>
                        <Check className="h-4 w-4" /> Enregistrer
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
