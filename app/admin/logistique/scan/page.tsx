'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Barcode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Printer,
  Plane,
  Truck,
  Building2,
  History,
  Navigation,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { logisticsApi, type LogisticsLookupResponse } from '@/lib/logistics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const SCAN_STAGES = [
  { id: 'hub_origin_received', label: '1. Réception Hub Origine (Paris / MTL)', icon: Building2, defaultLoc: 'Hub Roissy CDG, France' },
  { id: 'dispatched_in_flight', label: '2. En vol cargo / Transit international', icon: Plane, defaultLoc: 'Vol Cargo International' },
  { id: 'airport_arrival', label: '3. Atterrissage Aéroport Hassan Djamous', icon: Plane, defaultLoc: 'Aéroport Int. Hassan Djamous, N’Djamena' },
  { id: 'customs_cleared', label: '4. Dédouanement validé', icon: CheckCircle2, defaultLoc: 'Douane Aéroport Hassan Djamous' },
  { id: 'hub_ndjamena_sorting', label: '5. Arrivée Centre de tri N’Djamena', icon: Building2, defaultLoc: 'Hub Central Dounia Market, Klemat, N’Djamena' },
  { id: 'assigned_courier', label: '6. Remis au coursier / En livraison', icon: Truck, defaultLoc: 'Distribution urbaine N’Djamena' },
  { id: 'delivered', label: '7. Colis livré au client', icon: CheckCircle2, defaultLoc: 'Remise en main propre N’Djamena' },
]

export default function LogisticsScanPage() {
  const token = useAuth((s) => s.token)
  const inputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState(SCAN_STAGES[0].id)
  const [location, setLocation] = useState(SCAN_STAGES[0].defaultLoc)
  const [notes, setNotes] = useState('')
  const [barcode, setBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({})

  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean
    message: string
    fulfillment?: any
    scan?: any
  } | null>(null)

  const [scanHistory, setScanHistory] = useState<Array<{
    barcode: string
    stageLabel: string
    time: string
    success: boolean
  }>>([])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleStageChange = (newStage: string) => {
    setStage(newStage)
    const found = SCAN_STAGES.find((s) => s.id === newStage)
    if (found) {
      setLocation(found.defaultLoc)
    }
    inputRef.current?.focus()
  }

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          // Fallback silencieux si refusé
        },
      )
    }
  }

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = barcode.trim()
    if (!code || !token) return

    setLoading(true)
    setLastScanResult(null)

    try {
      const res = await logisticsApi.scan(token, {
        barcode: code,
        scan_stage: stage,
        location: location.trim(),
        notes: notes.trim() || undefined,
        latitude: coords.lat,
        longitude: coords.lng,
      })

      const currentStageObj = SCAN_STAGES.find((s) => s.id === stage)
      setLastScanResult({
        success: true,
        message: `Scan validé : Étape ${currentStageObj?.label || stage}`,
        fulfillment: res.fulfillment,
        scan: res.scan,
      })

      setScanHistory((prev) => [
        {
          barcode: code,
          stageLabel: currentStageObj?.label || stage,
          time: new Date().toLocaleTimeString('fr-FR'),
          success: true,
        },
        ...prev.slice(0, 19),
      ])

      setBarcode('')
      setNotes('')
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Erreur lors du scan du colis'
      setLastScanResult({
        success: false,
        message: msg,
      })

      setScanHistory((prev) => [
        {
          barcode: code,
          stageLabel: stage,
          time: new Date().toLocaleTimeString('fr-FR'),
          success: false,
        },
        ...prev.slice(0, 19),
      ])
    } finally {
      setLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }

  return (
    <div className="container-page py-6 max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Barcode className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold">Terminal Opérateur Logistique & Scans</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enregistrement des jalons de transport hubs Paris/Montréal vers N’Djamena avec notifications WhatsApp client automatiques.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild size="sm">
            <Link href="/admin/logistique/manifestes">
              Gérer les Manifestes Fret
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche : configuration et saisie */}
        <div className="lg:col-span-2 space-y-5">
          {/* Sélection de l'étape */}
          <div className="rounded-xl border bg-card p-4 shadow-xs space-y-3">
            <Label className="text-sm font-semibold flex items-center justify-between">
              <span>1. Étape logistique à appliquer</span>
              <span className="text-xs font-normal text-muted-foreground">Sélectionnez avant de scanner</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCAN_STAGES.map((s) => {
                const Icon = s.icon
                const isSelected = stage === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStageChange(s.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                        : 'border-border/60 hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Formulaire de scan */}
          <form onSubmit={handleScanSubmit} className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="barcode-input" className="text-base font-bold flex items-center gap-2">
                  <Barcode className="h-5 w-5 text-primary" />
                  Code-barres / Référence Colis
                </Label>
                <span className="text-xs text-muted-foreground">Compatible douchette laser & saisie manuelle</span>
              </div>
              <Input
                id="barcode-input"
                ref={inputRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scannez ou saisissez : ex DM-PKG-..., TCB-M1A2B3..."
                autoComplete="off"
                disabled={loading}
                className="h-14 font-mono text-lg tracking-wider border-2 focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location-input" className="text-xs font-medium">Lieu du checkpoint</Label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <Navigation className="h-3 w-3" />
                    GPS
                  </button>
                </div>
                <Input
                  id="location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lieu du scan"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes-input" className="text-xs font-medium">Remarques ou vol cargo (optionnel)</Label>
                <Input
                  id="notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex : Colis intact, vol AF892"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !barcode.trim()}
              className="w-full h-11 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Enregistrement et notifications...
                </>
              ) : (
                'Valider le scan (Entrée)'
              )}
            </Button>
          </form>

          {/* Résultat du dernier scan */}
          {lastScanResult && (
            <div
              className={`rounded-xl border p-4 transition-all ${
                lastScanResult.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              <div className="flex items-start gap-3">
                {lastScanResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm">{lastScanResult.message}</p>
                  {lastScanResult.fulfillment && (
                    <div className="text-xs space-y-1 text-foreground/80 mt-2 border-t pt-2 border-border/50">
                      <p>
                        Colis : <span className="font-mono font-bold">{lastScanResult.fulfillment.tracking_reference}</span> | Commande : <span className="font-semibold">{lastScanResult.fulfillment.order?.reference || lastScanResult.fulfillment.suborder?.order?.display_id}</span>
                      </p>
                      <p>
                        Destinataire : <strong>{lastScanResult.fulfillment.order?.recipient_name}</strong> ({lastScanResult.fulfillment.order?.recipient_phone}) - {lastScanResult.fulfillment.order?.city}
                      </p>
                      <div className="pt-2 flex gap-2">
                        <Button variant="outline" size="sm" asChild className="h-7 text-xs bg-background">
                          <Link href={`/admin/logistique/etiquette/${encodeURIComponent(lastScanResult.fulfillment.tracking_reference)}`} target="_blank">
                            <Printer className="h-3.5 w-3.5 mr-1" />
                            Imprimer étiquette A6
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne de droite : Historique de la session */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-3 mb-3">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Historique de la session</h2>
              <Badge variant="secondary" className="ml-auto text-xs">{scanHistory.length}</Badge>
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                Aucun scan effectué dans cette session.
              </p>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {scanHistory.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 bg-muted/20"
                  >
                    <div className="min-w-0">
                      <p className="font-mono font-medium truncate">{h.barcode}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{h.stageLabel}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground">{h.time}</span>
                      <div>
                        {h.success ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Validé" />
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-destructive" title="Erreur" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
