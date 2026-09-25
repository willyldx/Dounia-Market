'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plane,
  Ship,
  Truck,
  Plus,
  Loader2,
  CheckCircle2,
  Calendar,
  Box,
  Layers,
  ArrowRight,
  Barcode,
  Search,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { logisticsApi, type CargoManifest } from '@/lib/logistics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function CargoManifestsPage() {
  const token = useAuth((s) => s.token)
  const [manifests, setManifests] = useState<CargoManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedManifest, setSelectedManifest] = useState<CargoManifest | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Création d'un nouveau manifeste
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    transport_type: 'air_cargo',
    carrier_name: 'Air France Cargo',
    voyage_flight_number: 'AF892',
    origin_hub: 'Hub Roissy CDG, Paris (FR)',
    destination_hub: 'Aéroport Hassan Djamous, N’Djamena (TD)',
    departure_scheduled_at: '',
    arrival_scheduled_at: '',
    notes: '',
  })
  const [creating, setCreating] = useState(false)

  // Ajout de colis dans le manifeste sélectionné
  const [barcodeToAdd, setBarcodeToAdd] = useState('')
  const [weightToAdd, setWeightToAdd] = useState('')
  const [addingParcel, setAddingParcel] = useState(false)
  const [actionSuccessMsg, setActionSuccessMsg] = useState('')
  const [actionErrorMsg, setActionErrorMsg] = useState('')

  const fetchManifests = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await logisticsApi.manifests(token)
      setManifests(res.data || [])
    } catch {
      // Erreur
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchManifests()
  }, [fetchManifests])

  const openManifestDetail = async (id: number) => {
    if (!token) return
    setDetailLoading(true)
    setActionSuccessMsg('')
    setActionErrorMsg('')
    try {
      const res = await logisticsApi.manifestDetail(token, id)
      setSelectedManifest(res.manifest)
    } catch (e: any) {
      setActionErrorMsg(e?.message || 'Erreur lors du chargement du manifeste')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCreateManifest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setCreating(true)
    try {
      const res = await logisticsApi.createManifest(token, createForm)
      setShowCreateModal(false)
      await fetchManifests()
      if (res.manifest) {
        setSelectedManifest(res.manifest)
      }
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Erreur lors de la création')
    } finally {
      setCreating(false)
    }
  }

  const handleAddParcel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedManifest || !barcodeToAdd.trim()) return

    setAddingParcel(true)
    setActionSuccessMsg('')
    setActionErrorMsg('')
    try {
      const res = await logisticsApi.addParcelToManifest(token, selectedManifest.id, {
        barcode: barcodeToAdd.trim(),
        weight: weightToAdd ? parseFloat(weightToAdd) : undefined,
      })
      setSelectedManifest(res.manifest)
      setActionSuccessMsg(`Colis ${barcodeToAdd} ajouté au manifeste avec succès.`)
      setBarcodeToAdd('')
      setWeightToAdd('')
      fetchManifests()
    } catch (err: any) {
      setActionErrorMsg(err?.data?.message || err?.message || 'Impossible d’ajouter ce colis')
    } finally {
      setAddingParcel(false)
    }
  }

  const handleDispatchManifest = async () => {
    if (!token || !selectedManifest) return
    if (!confirm('Voulez-vous expédier ce manifeste ? Tous les colis passeront au statut En Vol Cargo et les clients recevront une alerte.')) return

    try {
      const res = await logisticsApi.dispatchManifest(token, selectedManifest.id)
      setSelectedManifest(res.manifest)
      setActionSuccessMsg('Manifeste expédié avec succès ! Jalons enregistrés et clients alertés.')
      fetchManifests()
    } catch (err: any) {
      setActionErrorMsg(err?.data?.message || err?.message || 'Erreur lors de l’expédition')
    }
  }

  const handleCustomsClear = async () => {
    if (!token || !selectedManifest) return
    if (!confirm('Valider le dédouanement groupé pour tout ce manifeste à N’Djamena ?')) return

    try {
      const res = await logisticsApi.customsClearManifest(token, selectedManifest.id)
      setSelectedManifest(res.manifest)
      setActionSuccessMsg('Dédouanement validé pour tous les colis du fret !')
      fetchManifests()
    } catch (err: any) {
      setActionErrorMsg(err?.data?.message || err?.message || 'Erreur lors du dédouanement')
    }
  }

  return (
    <div className="container-page py-6 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Manifestes de Fret & Vols Cargo</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidation des colis transcontinentaux (Paris CDG / Montréal vers N’Djamena Hassan Djamous).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild size="sm">
            <Link href="/admin/logistique/scan">
              <Barcode className="h-4 w-4 mr-1.5" />
              Terminal Scan
            </Link>
          </Button>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Nouveau Manifeste
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Liste des manifestes */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Vols & Expéditions en cours
            </h2>
            <Badge variant="secondary">{manifests.length}</Badge>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Chargement des manifestes...
            </div>
          ) : manifests.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed text-sm text-muted-foreground">
              Aucun manifeste de fret enregistré. Créez-en un pour regrouper vos colis.
            </div>
          ) : (
            <div className="space-y-2">
              {manifests.map((m) => {
                const isSelected = selectedManifest?.id === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => openManifestDetail(m.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {m.transport_type === 'air_cargo' ? (
                          <Plane className="h-4 w-4 text-primary shrink-0" />
                        ) : m.transport_type === 'sea_container' ? (
                          <Ship className="h-4 w-4 text-amber-600 shrink-0" />
                        ) : (
                          <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <p className="font-mono text-sm font-bold text-foreground">
                            {m.manifest_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {m.carrier_name} {m.voyage_flight_number ? `(${m.voyage_flight_number})` : ''}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold ${
                          m.status === 'dispatched'
                            ? 'border-primary text-primary bg-primary/10'
                            : m.status === 'customs_cleared'
                            ? 'border-emerald-600 text-emerald-600 bg-emerald-500/10'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {m.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                      <span>{m.total_parcels} colis</span>
                      <span>{m.total_weight_kg ? `${m.total_weight_kg} kg` : '-'}</span>
                      <span className="truncate max-w-[120px]">{m.origin_hub}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Détail du manifeste sélectionné */}
        <div className="lg:col-span-7">
          {detailLoading ? (
            <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground text-sm">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Chargement des détails du manifeste...
            </div>
          ) : selectedManifest ? (
            <div className="rounded-xl border bg-card p-5 space-y-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold">{selectedManifest.manifest_number}</span>
                    <Badge variant="secondary" className="uppercase text-xs">
                      {selectedManifest.transport_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Transporteur : <strong>{selectedManifest.carrier_name}</strong> - Réf/Vol : <strong>{selectedManifest.voyage_flight_number || 'N/A'}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Itinéraire : {selectedManifest.origin_hub} <ArrowRight className="inline h-3 w-3 mx-1" /> {selectedManifest.destination_hub}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedManifest.status !== 'dispatched' && selectedManifest.status !== 'customs_cleared' && (
                    <Button onClick={handleDispatchManifest} size="sm" className="bg-primary text-primary-foreground">
                      <Plane className="h-3.5 w-3.5 mr-1" />
                      Expédier le vol
                    </Button>
                  )}
                  {selectedManifest.status !== 'customs_cleared' && (
                    <Button onClick={handleCustomsClear} size="sm" variant="outline" className="text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Dédouaner
                    </Button>
                  )}
                </div>
              </div>

              {actionSuccessMsg && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  {actionSuccessMsg}
                </div>
              )}
              {actionErrorMsg && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive font-medium">
                  {actionErrorMsg}
                </div>
              )}

              {/* Formulaire d'ajout de colis */}
              <form onSubmit={handleAddParcel} className="p-3.5 rounded-lg border bg-muted/20 space-y-3">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Box className="h-3.5 w-3.5 text-primary" />
                  Ajouter un colis au conteneur / vol
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={barcodeToAdd}
                    onChange={(e) => setBarcodeToAdd(e.target.value)}
                    placeholder="N° de colis (DM-PKG-...) ou commande"
                    className="h-9 text-xs font-mono"
                    disabled={addingParcel}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={weightToAdd}
                    onChange={(e) => setWeightToAdd(e.target.value)}
                    placeholder="Poids (kg)"
                    className="h-9 text-xs sm:w-28"
                    disabled={addingParcel}
                  />
                  <Button type="submit" size="sm" disabled={addingParcel || !barcodeToAdd.trim()} className="h-9">
                    {addingParcel ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter'}
                  </Button>
                </div>
              </form>

              {/* Liste des colis consolidés */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Colis inclus ({selectedManifest.items?.length || 0})</span>
                  <span>Poids total : {selectedManifest.total_weight_kg || 0} kg</span>
                </div>

                {!selectedManifest.items || selectedManifest.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                    Aucun colis n’a encore été consolidé dans ce manifeste.
                  </p>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1">
                    {selectedManifest.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs"
                      >
                        <div>
                          <p className="font-mono font-bold text-foreground">
                            {item.package_tracking_number}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Destinataire : {item.fulfillment?.suborder?.order?.recipient_name || 'N/A'} - {item.fulfillment?.suborder?.order?.shipping_city || ''}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          {item.weight_kg && <span className="font-medium text-muted-foreground">{item.weight_kg} kg</span>}
                          <Badge variant="outline" className="text-[10px]">
                            {item.status}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2">
                            <Link href={`/admin/logistique/etiquette/${encodeURIComponent(item.package_tracking_number)}`} target="_blank">
                              Étiquette
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              Sélectionnez un manifeste dans la liste de gauche pour afficher ses détails ou en créer un nouveau.
            </div>
          )}
        </div>
      </div>

      {/* Modal Création de Manifeste */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border shadow-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Nouveau Manifeste de Fret</h2>
            <form onSubmit={handleCreateManifest} className="space-y-3.5">
              <div>
                <Label className="text-xs">Type de transport</Label>
                <select
                  value={createForm.transport_type}
                  onChange={(e) => setCreateForm({ ...createForm, transport_type: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs mt-1"
                >
                  <option value="air_cargo">Fret Aérien (Air Cargo)</option>
                  <option value="sea_container">Fret Maritime (Conteneur Maritime)</option>
                  <option value="road_freight">Fret Routier Régional</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Transporteur / Compagnie</Label>
                  <Input
                    value={createForm.carrier_name}
                    onChange={(e) => setCreateForm({ ...createForm, carrier_name: e.target.value })}
                    className="h-9 text-xs mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">N° de vol ou voyage</Label>
                  <Input
                    value={createForm.voyage_flight_number}
                    onChange={(e) => setCreateForm({ ...createForm, voyage_flight_number: e.target.value })}
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Hub d’origine</Label>
                  <Input
                    value={createForm.origin_hub}
                    onChange={(e) => setCreateForm({ ...createForm, origin_hub: e.target.value })}
                    className="h-9 text-xs mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Hub de destination</Label>
                  <Input
                    value={createForm.destination_hub}
                    onChange={(e) => setCreateForm({ ...createForm, destination_hub: e.target.value })}
                    className="h-9 text-xs mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Notes & instructions douanières</Label>
                <Input
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Ex : Expédition prioritaire matériels informatiques"
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Créer le manifeste
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
