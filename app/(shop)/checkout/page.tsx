'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  AlertCircle,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Plane,
  Ship,
  ShoppingBag,
  Smartphone,
  Truck,
} from 'lucide-react'
import { useCart, selectSubtotal } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import { usePaystack } from '@/hooks/use-paystack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { fetchShippingMethods, FALLBACK_SHIPPING_METHODS } from '@/lib/shipping'
import { fetchPaymentMethods, FALLBACK_PAYMENT_METHODS, COD_MAX_XAF } from '@/lib/payment'
import type { PaymentMethodConfig, ShippingMethod } from '@/lib/types'

const PAYMENT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_PAYMENT_ENABLED !== 'false'

const schema = z.object({
  customerFirstName: z.string().min(2, 'Indiquez votre prénom.'),
  customerLastName: z.string().min(2, 'Indiquez votre nom.'),
  email: z.string().email('Adresse e-mail valide requise.'),
  customerPhone: z.string().min(6, 'Numéro de contact requis (ex: +33... ou +235...).'),
  recipientName: z.string().min(2, 'Indiquez le nom du destinataire.'),
  recipientPhone: z.string().min(6, 'Indiquez un numéro valide pour la livraison.'),
  shippingAddress1: z.string().min(4, 'Indiquez une adresse ou un quartier de livraison.'),
  shippingCity: z.string().min(2, 'Indiquez la ville de destination.'),
  shippingCountry: z.string().default('Tchad'),
  deliveryInstructions: z.string().optional(),
  notifyWhatsApp: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const format = useCart((s) => s.format)
  const currency = useCart((s) => s.currency)
  const rates = useCart((s) => s.rates)
  const clearCart = useCart((s) => s.clear)
  const subtotal = useCart(selectSubtotal)
  const user = useAuth((s) => s.user)
  const { resumeTransaction } = usePaystack()

  const [submitting, setSubmitting] = useState(false)
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(FALLBACK_SHIPPING_METHODS)
  const [selectedShippingCode, setSelectedShippingCode] = useState<string>('LOCAL-NDJ')

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(FALLBACK_PAYMENT_METHODS)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingCity: "N'Djamena",
      shippingCountry: 'Tchad',
      notifyWhatsApp: true,
    },
  })

  // Load available shipping and payment methods
  useEffect(() => {
    fetchShippingMethods().then((methods) => {
      if (methods.length > 0) {
        setShippingMethods(methods)
        if (!methods.find((m) => m.code === selectedShippingCode)) {
          setSelectedShippingCode(methods[0].code)
        }
      }
    })

    fetchPaymentMethods({ currency }).then((methods) => {
      if (methods.length > 0) {
        setPaymentMethods(methods)
        if (!methods.find((m) => m.method === selectedPaymentMethod)) {
          setSelectedPaymentMethod(methods[0].method)
        }
      }
    })
  }, [currency])

  useEffect(() => {
    if (user) {
      reset((prev) => ({
        ...prev,
        customerFirstName: user.firstName || prev.customerFirstName,
        customerLastName: user.lastName || prev.customerLastName,
        email: user.email || prev.email,
        customerPhone: user.phone || prev.customerPhone,
        shippingCity: prev.shippingCity || "N'Djamena",
      }))
    }
  }, [user, reset])

  const selectedShipping = useMemo(() => {
    return shippingMethods.find((m) => m.code === selectedShippingCode) || shippingMethods[0] || null
  }, [shippingMethods, selectedShippingCode])

  // Conversion of shipping & customs fees to EUR base for universal display with cart format
  const xafRate = rates.XAF || 655.957
  const shippingFeeEur = useMemo(() => {
    if (!selectedShipping) return 0
    const xafAmount = selectedShipping.delivery_fee_minor / 100
    return xafAmount / xafRate
  }, [selectedShipping, xafRate])

  const customsFeeEur = useMemo(() => {
    if (!selectedShipping || !selectedShipping.customs_fee_minor) return 0
    const xafAmount = selectedShipping.customs_fee_minor / 100
    return xafAmount / xafRate
  }, [selectedShipping, xafRate])

  const orderTotalEur = subtotal + shippingFeeEur + customsFeeEur
  const orderTotalXaf = Math.round(orderTotalEur * xafRate)

  // Cash on Delivery (COD) restriction: max 150 000 FCFA
  const isCodExceeded = orderTotalXaf > COD_MAX_XAF
  const effectivePaymentMethod =
    isCodExceeded && selectedPaymentMethod === 'cash_on_delivery' ? 'card' : selectedPaymentMethod

  async function onSubmit(values: FormValues) {
    if (!PAYMENT_ENABLED) return
    if (items.length === 0) {
      toast.error('Votre panier est vide.')
      return
    }

    if (effectivePaymentMethod === 'cash_on_delivery' && isCodExceeded) {
      toast.error(
        `Le montant dépasse le plafond de ${new Intl.NumberFormat('fr-FR').format(COD_MAX_XAF)} FCFA pour le paiement à la livraison.`,
      )
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          customer_first_name: values.customerFirstName,
          customer_last_name: values.customerLastName,
          customer_phone: values.customerPhone,
          recipient_name: values.recipientName,
          recipient_phone: values.recipientPhone,
          shipping_address_1: values.shippingAddress1,
          shipping_city: values.shippingCity,
          shipping_country: values.shippingCountry,
          delivery_instructions: values.deliveryInstructions || null,
          shipping_method_code: selectedShipping?.code || 'LOCAL-NDJ',
          shipping_method_id: selectedShipping?.id || null,
          payment_method: effectivePaymentMethod,
          currency,
          notify_whatsapp: values.notifyWhatsApp,
          whatsapp_phone: values.recipientPhone || values.customerPhone,
          items: items.map((i) => ({
            product_id: i.productId,
            variant_id: i.variantId ?? null,
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.message || "La commande n'a pas pu être créée.")
        return
      }

      const orderRef = data?.reference || data?.data?.reference

      // 1. Online Card Payment via Paystack
      if (effectivePaymentMethod === 'card') {
        const accessCode = data?.access_code || data?.data?.access_code
        if (accessCode) {
          await resumeTransaction(accessCode)
          return
        }
        if (data?.authorization_url) {
          window.location.assign(data.authorization_url)
          return
        }
      }

      // 2. Direct confirmation for COD, Mobile Money, and Bank Transfer
      clearCart()
      toast.success('Commande enregistrée avec succès !')
      router.push(
        `/checkout/confirmation?orderReference=${encodeURIComponent(orderRef || '')}&mode=direct&method=${encodeURIComponent(effectivePaymentMethod)}&whatsapp=${values.notifyWhatsApp ? '1' : '0'}`,
      )
    } catch {
      toast.error('Une erreur est survenue lors de la validation. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }


  if (items.length === 0) {
    return (
      <div className="container-page py-10 md:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Commande</h1>
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center shadow-soft">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
            <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Aucun article à commander</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Ajoutez des produits à votre panier avant de finaliser votre commande.
          </p>
          <Button asChild className="mt-6">
            <Link href="/catalogue">Explorer le catalogue</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Finaliser votre commande</h1>
        <p className="mt-2 text-muted-foreground">
          Expédition locale ou internationale avec dédouanement et suivi en direct.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Section 1: Informations acheteur et destinataire */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <h2 className="font-display text-lg font-bold tracking-tight">Coordonnées & Destinataire</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vos informations (Acheteur)
                </span>
              </div>
              <Field label="Prénom de l'acheteur" error={errors.customerFirstName?.message}>
                <Input {...register('customerFirstName')} autoComplete="given-name" placeholder="Ex: Moussa" />
              </Field>
              <Field label="Nom de l'acheteur" error={errors.customerLastName?.message}>
                <Input {...register('customerLastName')} autoComplete="family-name" placeholder="Ex: Déby" />
              </Field>
              <Field label="Adresse e-mail" error={errors.email?.message}>
                <Input type="email" {...register('email')} autoComplete="email" placeholder="moussa@exemple.com" />
              </Field>
              <Field label="Téléphone de contact" error={errors.customerPhone?.message}>
                <Input type="tel" {...register('customerPhone')} placeholder="Ex: +33 6... ou +235 6..." />
              </Field>

              <div className="pt-2 sm:col-span-2">
                <Separator className="my-2" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Destinataire de la livraison
                </span>
              </div>

              <Field label="Nom complet du destinataire" error={errors.recipientName?.message}>
                <Input {...register('recipientName')} autoComplete="name" placeholder="Nom de la personne qui reçoit" />
              </Field>
              <Field label="Téléphone du destinataire" error={errors.recipientPhone?.message}>
                <Input type="tel" {...register('recipientPhone')} placeholder="Ex: +235 66 12 34 56" />
              </Field>
              <Field
                label="Quartier & Adresse de livraison"
                error={errors.shippingAddress1?.message}
                className="sm:col-span-2"
              >
                <Input {...register('shippingAddress1')} placeholder="Quartier, avenue, points de repère à N'Djamena" />
              </Field>
              <Field label="Ville de livraison" error={errors.shippingCity?.message}>
                <Input {...register('shippingCity')} placeholder="N'Djamena" />
              </Field>
              <Field label="Pays de livraison" error={errors.shippingCountry?.message}>
                <Input {...register('shippingCountry')} placeholder="Tchad" />
              </Field>
              <Field
                label="Instructions pour le livreur (optionnel)"
                error={errors.deliveryInstructions?.message}
                className="sm:col-span-2"
              >
                <Textarea
                  {...register('deliveryInstructions')}
                  rows={2}
                  placeholder="Précisions de remise, disponibilité horaire ou indications d'accès."
                />
              </Field>

              <div className="sm:col-span-2 rounded-xl border border-emerald-600/25 bg-emerald-500/[0.04] p-4 transition-all">
                <label htmlFor="notifyWhatsApp" className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    id="notifyWhatsApp"
                    type="checkbox"
                    {...register('notifyWhatsApp')}
                    className="mt-1 h-4 w-4 rounded border-emerald-600/40 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                        Mises à jour et suivi en direct sur WhatsApp & SMS
                      </span>
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                        Recommandé Tchad
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Recevez les confirmations clés sur votre mobile : préparation du colis, fret aérien/maritime, dédouanement et contact du livreur à N'Djamena.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Section 2: Mode de livraison et fret international */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight">Mode de livraison & Expédition</h2>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Transfrontalier certifié
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Choisissez entre livraison urbaine immédiate ou fret express depuis l'international.
            </p>

            <div className="mt-5 space-y-3">
              {shippingMethods.map((method) => {
                const isSelected = selectedShippingCode === method.code
                const feeXaf = method.delivery_fee_minor / 100
                const feeEur = feeXaf / xafRate
                const customsXaf = method.customs_fee_minor / 100
                const customsEur = customsXaf / xafRate

                let Icon = Truck
                let badgeText = 'Local Tchad'
                let badgeClass = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'

                if (method.shipping_type === 'cross_border_air') {
                  Icon = Plane
                  badgeText = 'Fret Aérien Express Diaspora 🇫🇷'
                  badgeClass = 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                } else if (method.shipping_type === 'cross_border_sea') {
                  Icon = Ship
                  badgeText = 'Fret Maritime & Cargo 🇪🇺 🇨🇦'
                  badgeClass = 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }

                return (
                  <div
                    key={method.code}
                    onClick={() => setSelectedShippingCode(method.code)}
                    className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground">{method.name}</span>
                            <Badge variant="outline" className={`text-xs ${badgeClass}`}>
                              {badgeText}
                            </Badge>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            Délai estimé : {method.estimated_min_days} à {method.estimated_max_days} jours ouvrés
                          </p>
                          {customsXaf > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Dédouanement à l'arrivée inclus :{' '}
                              <span className="font-medium text-foreground">{format(customsEur)}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-display font-bold text-foreground">{format(feeEur)}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {new Intl.NumberFormat('fr-FR').format(feeXaf)} FCFA
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Section 3: Moyen de paiement */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight">Mode de paiement</h2>
              </div>
              <Badge variant="outline" className="border-border">
                {currency}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Réglez en ligne par carte internationale ou optez pour le paiement local au Tchad.
            </p>

            <div className="mt-5 space-y-3">
              {paymentMethods.map((pm) => {
                const isSelected = effectivePaymentMethod === pm.method
                const isCod = pm.method === 'cash_on_delivery'
                const isCodDisabled = isCod && isCodExceeded

                let Icon = CreditCard
                if (pm.method === 'tchad_mobile_money') Icon = Smartphone
                if (pm.method === 'cash_on_delivery') Icon = Banknote
                if (pm.method === 'bank_transfer') Icon = Building2

                return (
                  <div
                    key={pm.method}
                    onClick={() => {
                      if (!isCodDisabled) setSelectedPaymentMethod(pm.method)
                    }}
                    className={`relative rounded-xl border p-4 transition-all ${
                      isCodDisabled
                        ? 'cursor-not-allowed border-dashed border-border/80 bg-secondary/30 opacity-60'
                        : isSelected
                        ? 'cursor-pointer border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                        : 'cursor-pointer border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{pm.label}</span>
                            {isCod && (
                              <Badge variant="secondary" className="text-xs">
                                Max 150 000 FCFA
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{pm.instructions}</p>
                          {isCodDisabled && (
                            <div className="mt-2 flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Plafond de 150 000 FCFA dépassé pour cette commande.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-1">
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Récapitulatif de commande */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold tracking-tight">Récapitulatif financier</h2>

            <ul className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {item.title} <span className="font-medium text-foreground">x{item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">{format(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total articles</span>
                <span>{format(subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  Frais de transport ({selectedShipping?.name.split('(')[0].trim() || 'Livraison'})
                </span>
                <span>{format(shippingFeeEur)}</span>
              </div>

              {customsFeeEur > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Dédouanement et formalités
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <span>{format(customsFeeEur)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-semibold text-foreground">Total à régler</span>
                <p className="text-xs text-muted-foreground">
                  Équivalent : {new Intl.NumberFormat('fr-FR').format(orderTotalXaf)} FCFA
                </p>
              </div>
              <span className="font-display text-2xl font-bold text-primary">{format(orderTotalEur)}</span>
            </div>

            {PAYMENT_ENABLED ? (
              <Button
                type="submit"
                size="lg"
                disabled={submitting || (effectivePaymentMethod === 'cash_on_delivery' && isCodExceeded)}
                className="mt-6 w-full bg-accent font-semibold text-accent-foreground shadow hover:bg-accent/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Validation en cours...
                  </>
                ) : effectivePaymentMethod === 'card' ? (
                  <>
                    <Lock className="h-4 w-4" strokeWidth={1.75} />
                    Payer par carte sécurisée
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    Confirmer la commande
                  </>
                )}
              </Button>

            ) : (
              <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-semibold">Validation assistée</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Contactez notre service client pour finaliser votre commande.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-3 w-full text-xs">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Garantie Dounia Market
              </div>
              <p className="mt-1">
                Articles vérifiés avant dispatch, suivi de colis temps réel et dédouanement sécurisé.
              </p>
            </div>
          </div>
        </aside>
      </form>
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
