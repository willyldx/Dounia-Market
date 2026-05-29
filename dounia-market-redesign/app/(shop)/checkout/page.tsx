'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Clock, ShoppingBag, Loader2, Lock } from 'lucide-react'
import { useCart, selectSubtotal } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import { usePaystack } from '@/hooks/use-paystack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

const PAYMENT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_PAYMENT_ENABLED === 'true'

const schema = z.object({
  customerFirstName: z.string().min(2, 'Indiquez votre prenom.'),
  customerLastName: z.string().min(2, 'Indiquez votre nom.'),
  email: z.string().email('Adresse e-mail invalide.'),
  customerPhone: z.string().optional(),
  recipientName: z.string().min(2, 'Indiquez le nom du destinataire.'),
  recipientPhone: z.string().min(6, 'Indiquez un numero a N\'Djamena.'),
  shippingAddress1: z.string().min(4, 'Indiquez une adresse de livraison.'),
  shippingCity: z.string().optional(),
  deliveryInstructions: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const format = useCart((s) => s.format)
  const subtotal = useCart(selectSubtotal)
  const user = useAuth((s) => s.user)
  const { resumeTransaction } = usePaystack()

  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { shippingCity: "N'Djamena" },
  })

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

  async function onSubmit(values: FormValues) {
    if (!PAYMENT_ENABLED) return
    if (items.length === 0) {
      toast.error('Votre panier est vide.')
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
          customer_phone: values.customerPhone || null,
          recipient_name: values.recipientName,
          recipient_phone: values.recipientPhone || null,
          shipping_address_1: values.shippingAddress1 || null,
          shipping_city: values.shippingCity || "N'Djamena",
          delivery_instructions: values.deliveryInstructions || null,
          items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.message || 'La commande n\'a pas pu etre creee.')
        return
      }
      const accessCode = data?.access_code || data?.data?.access_code
      if (!accessCode) {
        toast.error('Reponse de paiement invalide. Reessayez plus tard.')
        return
      }
      await resumeTransaction(accessCode)
    } catch {
      toast.error('Une erreur est survenue. Reessayez.')
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
          <h2 className="mt-5 font-display text-xl font-bold tracking-tight">Aucun article a commander</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Ajoutez des produits a votre panier avant de passer commande.
          </p>
          <Button asChild className="mt-6">
            <Link href="/catalogue">Voir le catalogue</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Finaliser la commande</h1>
      <p className="mt-2 text-muted-foreground">
        Renseignez vos informations et celles de votre famille a N'Djamena.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold tracking-tight">Vos coordonnees</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Prenom" error={errors.customerFirstName?.message}>
                <Input {...register('customerFirstName')} autoComplete="given-name" />
              </Field>
              <Field label="Nom" error={errors.customerLastName?.message}>
                <Input {...register('customerLastName')} autoComplete="family-name" />
              </Field>
              <Field label="E-mail" error={errors.email?.message}>
                <Input type="email" {...register('email')} autoComplete="email" />
              </Field>
              <Field label="Telephone (optionnel)" error={errors.customerPhone?.message}>
                <Input type="tel" {...register('customerPhone')} autoComplete="tel" />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold tracking-tight">Destinataire a N'Djamena</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Nom du destinataire" error={errors.recipientName?.message}>
                <Input {...register('recipientName')} autoComplete="name" />
              </Field>
              <Field label="Telephone du destinataire" error={errors.recipientPhone?.message}>
                <Input type="tel" {...register('recipientPhone')} />
              </Field>
              <Field label="Adresse a N'Djamena" error={errors.shippingAddress1?.message} className="sm:col-span-2">
                <Input {...register('shippingAddress1')} placeholder="Quartier, rue, reperes" />
              </Field>
              <Field label="Ville" error={errors.shippingCity?.message}>
                <Input {...register('shippingCity')} />
              </Field>
              <Field
                label="Instructions de livraison (optionnel)"
                error={errors.deliveryInstructions?.message}
                className="sm:col-span-2"
              >
                <Textarea
                  {...register('deliveryInstructions')}
                  rows={3}
                  placeholder="Indications pour faciliter la livraison."
                />
              </Field>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold tracking-tight">Votre commande</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {item.title} <span className="text-foreground">x{item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">{format(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total estime</span>
              <span className="font-display text-xl font-bold">{format(subtotal)}</span>
            </div>

            {PAYMENT_ENABLED ? (
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" strokeWidth={1.75} />
                    Payer maintenant
                  </>
                )}
              </Button>
            ) : (
              <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-semibold">La commande en ligne ouvre bientot</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Le paiement en ligne n'est pas encore disponible. Contactez-nous pour finaliser votre
                      commande des aujourd'hui.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Paiement securise. Vos donnees restent confidentielles.
            </p>
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
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}
