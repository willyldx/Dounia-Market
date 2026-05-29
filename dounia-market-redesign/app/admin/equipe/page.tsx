'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { adminApi } from '@/lib/admin'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader, LoadingRows, EmptyState } from '@/components/admin/admin-kit'

function pick(o: any, keys: string[], fb: any = '-') {
  for (const k of keys) if (o && o[k] != null) return o[k]
  return fb
}

const ROLES = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'super_admin', label: 'Direction' },
  { value: 'livreur', label: 'Livreur' },
  { value: 'client', label: 'Client' },
]

export default function AdminTeam() {
  const token = useAuth((s) => s.token)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    adminApi
      .team(token)
      .then((res) => setRows(res?.data || res?.team || (Array.isArray(res) ? res : [])))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  async function promote(id: string, role: string) {
    if (!token) return
    try {
      await adminApi.promoteTeam(token, id, role)
      setRows((r) => r.map((m) => (String(pick(m, ['id'])) === id ? { ...m, role } : m)))
      toast.success('Rôle mis à jour')
    } catch {
      toast.error('Échec de la mise à jour')
    }
  }

  return (
    <div>
      <PageHeader title="Équipe" subtitle="Gérez les rôles et accès de votre équipe." />
      {loading ? (
        <LoadingRows rows={5} />
      ) : error ? (
        <EmptyState title="Données indisponibles" />
      ) : rows.length === 0 ? (
        <EmptyState title="Aucun membre" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m, i) => (
                <tr key={pick(m, ['id'], i)} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{pick(m, ['name', 'full_name'])}</td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(m, ['email'])}</td>
                  <td className="px-4 py-3">
                    <Select defaultValue={String(pick(m, ['role'], 'client'))} onValueChange={(v) => promote(String(pick(m, ['id'])), v)}>
                      <SelectTrigger className="h-9 w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
