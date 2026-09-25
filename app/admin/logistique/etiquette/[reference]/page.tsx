'use client'

import { use, useEffect, useState } from 'react'
import { Printer, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/stores/auth'
import { logisticsApi, type ShippingLabelResponse } from '@/lib/logistics'
import { Button } from '@/components/ui/button'

export default function ShippingLabelPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  const { reference } = use(params)
  const token = useAuth((s) => s.token)
  const [data, setData] = useState<ShippingLabelResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !reference) return

    setLoading(true)
    logisticsApi
      .getShippingLabel(token, reference)
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        setError(err?.data?.message || err?.message || 'Impossible de générer l’étiquette')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token, reference])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">Génération de l'étiquette thermique...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container-page py-10 max-w-lg">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-destructive">Erreur d'étiquette</h2>
          <p className="text-sm text-muted-foreground">{error || 'Colis introuvable'}</p>
          <Button asChild variant="outline">
            <Link href="/admin/logistique/scan">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au terminal scan
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const { label_data, svg_barcode } = data

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 print:p-0 print:bg-white">
      {/* Barre d'outils d'impression (masquée lors de l'impression) */}
      <div className="max-w-md mx-auto mb-6 flex items-center justify-between print:hidden">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/logistique/scan">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Scanner un autre colis
          </Link>
        </Button>
        <Button onClick={handlePrint} size="sm" className="bg-primary text-primary-foreground">
          <Printer className="h-4 w-4 mr-1.5" />
          Imprimer l'étiquette (A6)
        </Button>
      </div>

      {/* Étiquette thermique A6 standard (105mm x 148mm) */}
      <div className="label-container max-w-[105mm] mx-auto bg-white text-black border-2 border-black p-4 font-sans text-xs shadow-lg print:shadow-none print:border-none print:m-0 print:p-2">
        {/* Entête transporteur & logo */}
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div>
            <p className="text-base font-black tracking-tight uppercase">DOUNIA MARKET</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">Cross-Border Logistics</p>
          </div>
          <div className="text-right">
            <span className="inline-block border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
              {label_data.shipping_type === 'cross_border_air' ? 'AIR CARGO' : label_data.shipping_type === 'cross_border_sea' ? 'SEA CARGO' : 'URBAIN'}
            </span>
          </div>
        </div>

        {/* Routage Hubs */}
        <div className="grid grid-cols-2 border-b-2 border-black text-center py-2">
          <div className="border-r-2 border-black pr-2 text-left">
            <p className="text-[9px] uppercase font-bold text-neutral-600">Origine :</p>
            <p className="font-extrabold text-xs truncate">{label_data.origin_hub}</p>
          </div>
          <div className="pl-2 text-left">
            <p className="text-[9px] uppercase font-bold text-neutral-600">Destination :</p>
            <p className="font-black text-sm uppercase text-black">{label_data.destination_hub}</p>
          </div>
        </div>

        {/* Destinataire */}
        <div className="border-b-2 border-black py-3 space-y-1">
          <p className="text-[9px] uppercase font-bold text-neutral-600">Destinataire (Consignee) :</p>
          <p className="font-black text-sm uppercase">{label_data.recipient_name}</p>
          <p className="font-mono text-xs font-bold">{label_data.recipient_phone}</p>
          <p className="text-xs font-semibold leading-tight pt-1">
            {label_data.shipping_address}, <span className="uppercase">{label_data.shipping_city}</span> (TCHAD)
          </p>
        </div>

        {/* Code-barres 1D vectoriel pur Code 128 */}
        <div className="py-4 text-center border-b-2 border-black">
          <div
            className="flex justify-center [&>svg]:max-w-full [&>svg]:h-16 [&>svg]:w-auto"
            dangerouslySetInnerHTML={{ __html: svg_barcode }}
          />
          <p className="font-mono text-sm font-black tracking-widest mt-1">
            {label_data.reference}
          </p>
        </div>

        {/* Détails techniques & sécurité douanière */}
        <div className="pt-2 text-[10px] space-y-1">
          <div className="flex justify-between font-semibold">
            <span>Poids indicatif : {label_data.weight_kg} kg</span>
            <span>Date : {label_data.created_at}</span>
          </div>
          <p className="text-[8px] text-neutral-600 leading-tight pt-1">
            Fret dédouané sous régime de transit international Dounia Market. Tout colis ouvert ou reconditionné doit faire l'objet d'un rapport immédiat.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: 105mm 148mm;
            margin: 0;
          }
          body {
            margin: 0;
            background: white !important;
          }
          .label-container {
            width: 100% !important;
            max-width: none !important;
            border: 2px solid black !important;
          }
        }
      `}</style>
    </div>
  )
}
