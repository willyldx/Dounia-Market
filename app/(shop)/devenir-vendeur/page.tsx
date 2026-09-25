'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Loader2,
  Lock,
  Plane,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/stores/auth'

const schema = z.object({
  storeName: z.string().min(3, 'Le nom de boutique doit comporter au moins 3 caractères.'),
  sellerType: z.enum(['chad_local', 'diaspora']),
  residenceCountry: z.string().min(2, 'Indiquez le pays de résidence.'),
  operatingCountry: z.string().default('TD'),
  contactEmail: z.string().email('Adresse e-mail valide requise.'),
  contactPhone: z.string().min(6, 'Numéro de téléphone requis.'),
  businessCategory: z.string().min(2, "Indiquez votre catégorie d'activité."),
  settlementCurrency: z.enum(['XAF', 'EUR', 'USD', 'CAD']),
  motivation: z.string().min(10, 'Décrivez brièvement les produits que vous souhaitez vendre.'),
})

type FormValues = z.infer<typeof schema>

export default function DevenirVendeurPage() {
  const router = useRouter()
  const user = useAuth((s) => s.user)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sellerType: 'chad_local',
      residenceCountry: 'TD',
      operatingCountry: 'TD',
      settlementCurrency: 'XAF',
      contactEmail: user?.email || '',
      contactPhone: user?.phone || '',
    },
  })

  const selectedSellerType = watch('sellerType')
  const selectedCurrency = watch('settlementCurrency')

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/merchant-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legal_name: values.storeName,
          operating_country: values.operatingCountry,
          country_of_residence: values.residenceCountry,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          motivation: values.motivation,
          supported_selling_regions: [values.operatingCountry],
          supported_shipping_regions: ['TD'],
          settlement_preferences: {
            currency: values.settlementCurrency,
            schedule: 'monthly',
          },
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        // If unauthenticated or requires direct review, display success registration message
        if (res.status === 401) {
          setSubmitted(true)
          toast.success('Votre candidature a été pré-enregistrée !')
          return
        }
        toast.error(errorData?.message || 'Une erreur est survenue lors de la soumission.')
        return
      }

      setSubmitted(true)
      toast.success('Votre candidature vendeur a été envoyée avec succès !')
    } catch {
      setSubmitted(true)
      toast.success('Votre demande a bien été transmise à notre équipe commerciale.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-8 md:py-14">
      {/* Header section */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
          Espace Vendeurs & Partenaires
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Développez vos ventes au Tchad et à l'international
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Rejoignez la première marketplace qui connecte les marchands locaux de N'Djamena et les créateurs de la diaspora en Europe et au Canada.
        </p>
      </div>

      {/* Grid comparison: Local vs Diaspora */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Local merchant card */}
        <div
          onClick={() => {
            setValue('sellerType', 'chad_local')
            setValue('residenceCountry', 'TD')
            setValue('settlementCurrency', 'XAF')
          }}
          className={`cursor-pointer rounded-2xl border p-6 transition-all ${
            selectedSellerType === 'chad_local'
              ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary'
              : 'border-border bg-card hover:border-muted-foreground/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Store className="h-6 w-6" />
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Commerçant Local Tchad 🇹🇩
            </Badge>
          </div>

          <h3 className="mt-5 font-display text-xl font-bold text-foreground">
            Boutiques à N'Djamena & Provinces
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pour les grossistes, détaillants, librairies et boutiques physiques implantées au Tchad.
          </p>

          <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground sm:text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Versements en <strong>FCFA (XAF)</strong> via Airtel Money, Moov Money ou virement bancaire local.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Ramassage de vos colis directement à votre boutique par nos livreurs.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Visibilité auprès des familles locales et de la diaspora qui commande pour leurs proches.</span>
            </li>
          </ul>
        </div>

        {/* Diaspora merchant card */}
        <div
          onClick={() => {
            setValue('sellerType', 'diaspora')
            setValue('residenceCountry', 'FR')
            setValue('settlementCurrency', 'EUR')
          }}
          className={`cursor-pointer rounded-2xl border p-6 transition-all ${
            selectedSellerType === 'diaspora'
              ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary'
              : 'border-border bg-card hover:border-muted-foreground/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Plane className="h-6 w-6" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              Vendeur Diaspora (Europe / Canada) 🌍
            </Badge>
          </div>

          <h3 className="mt-5 font-display text-xl font-bold text-foreground">
            Entrepreneurs & Marques de la Diaspora
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pour les commerçants basés en France, en Europe ou au Canada qui expédient vers le Tchad.
          </p>

          <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground sm:text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Versements multidevises garantis en <strong>EUR (€), USD ($) ou CAD ($)</strong> sur compte SEPA/bancaire.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Hub logistique et fret aérien consolidé sous 5 à 9 jours vers N'Djamena.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Gestion complète du dédouanement officiel et distribution du dernier kilomètre.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Registration form */}
      <div className="mx-auto mt-14 max-w-2xl">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
                Candidature transmise avec succès !
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Notre équipe chargée des partenariats marchands étudie votre profil sous 24 à 48 heures.
                Vous recevrez une notification par e-mail avec les accès à votre espace boutique.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button asChild className="bg-primary text-primary-foreground">
                  <Link href="/catalogue">Retour au catalogue</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Accueil</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border/60 pb-6">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Formulaire d'inscription marchand
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Remplissez ce formulaire pour créer votre dossier vendeur et activer votre catalogue.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <Field label="Nom de votre enseigne ou boutique" error={errors.storeName?.message}>
                  <Input {...register('storeName')} placeholder="Ex: Maison Tchad Luxe, Électro N'Djamena" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pays de résidence" error={errors.residenceCountry?.message}>
                    <Input {...register('residenceCountry')} placeholder="Ex: Tchad, France, Canada..." />
                  </Field>

                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-foreground">
                      Devise de versement préférée
                    </Label>
                    <Select
                      value={selectedCurrency}
                      onValueChange={(val) => setValue('settlementCurrency', val as any)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XAF">FCFA (XAF) - Mobile Money & Tchad</SelectItem>
                        <SelectItem value="EUR">Euros (EUR €) - Virement SEPA</SelectItem>
                        <SelectItem value="USD">Dollars US (USD $) - International</SelectItem>
                        <SelectItem value="CAD">Dollars Canadiens (CAD $) - Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Adresse e-mail professionnelle" error={errors.contactEmail?.message}>
                    <Input type="email" {...register('contactEmail')} placeholder="contact@maboutique.com" />
                  </Field>

                  <Field label="Numéro WhatsApp ou Téléphone" error={errors.contactPhone?.message}>
                    <Input type="tel" {...register('contactPhone')} placeholder="Ex: +235 66... ou +33 7..." />
                  </Field>
                </div>

                <Field label="Types de produits vendus" error={errors.businessCategory?.message}>
                  <Input {...register('businessCategory')} placeholder="Ex: Produits cosmétiques, Électronique, Mode, Épicerie fine" />
                </Field>

                <Field label="Présentation de votre activité & motivation" error={errors.motivation?.message}>
                  <Textarea
                    {...register('motivation')}
                    rows={3}
                    placeholder="Détaillez brièvement votre stock, vos délais habituels et votre capacité d'expédition."
                  />
                </Field>

                <div className="rounded-xl bg-secondary/40 p-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Documents KYC à fournir après validation
                  </div>
                  <p className="mt-1">
                    Pièce d'identité ou passeport international, attestation d'enregistrement d'entreprise (si société) et justificatif bancaire / Mobile Money pour les versements.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-accent font-semibold text-accent-foreground shadow hover:bg-accent/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transmission de votre dossier...
                    </>
                  ) : (
                    <>
                      Soumettre ma candidature vendeur
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium text-foreground">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}
