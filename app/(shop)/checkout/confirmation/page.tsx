'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, Clock, Banknote, Smartphone, Building2 } from 'lucide-react'
import { useCart } from '@/stores/cart'
import { Button } from '@/components/ui/button'

type Status = 'loading' | 'success' | 'failed' | 'missing'

function ConfirmationContent() {
  const params = useSearchParams()
  const clearCart = useCart((s) => s.clear)
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string>('')
  const ran = useRef(false)

  const mode = params.get('mode') || ''
  const paymentMethod = params.get('method') || ''
  const paymentReference = params.get('reference') || params.get('trxref') || ''
  const orderReference =
    params.get('orderReference') || params.get('order') || params.get('orderRef') || paymentReference

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    // Direct checkout completion (COD, Mobile Money, Bank Transfer)
    if (mode === 'direct' && orderReference) {
      clearCart()
      setStatus('success')
      return
    }

    if (!paymentReference || !orderReference) {
      setStatus('missing')
      return
    }

    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderReference, paymentReference }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (res.ok) {
          setStatus('success')
          clearCart()
        } else {
          setStatus('failed')
          setMessage(data?.message || '')
        }
      })
      .catch(() => {
        setStatus('failed')
      })
  }, [mode, orderReference, paymentReference, clearCart])

  if (status === 'loading') {
    return (
      <Shell>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Vérification de la commande</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Merci de patienter, nous finalisons la confirmation de votre commande.
        </p>
      </Shell>
    )
  }

  if (status === 'success') {
    let methodMessage = "Votre commande est enregistrée et nous préparons l'expédition."
    let MethodIcon = CheckCircle2

    if (paymentMethod === 'cash_on_delivery') {
      methodMessage = "Paiement en espèces prévu à la livraison. Préparez le montant exact pour le livreur à N'Djamena."
      MethodIcon = Banknote
    } else if (paymentMethod === 'tchad_mobile_money') {
      methodMessage = "Règlement Mobile Money initié. La préparation débutera dès confirmation de l'opérateur Airtel ou Moov."
      MethodIcon = Smartphone
    } else if (paymentMethod === 'bank_transfer') {
      methodMessage = "Veuillez effectuer le virement sur notre compte bancaire en indiquant impérativement la référence en libellé."
      MethodIcon = Building2
    }

    return (
      <Shell>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MethodIcon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Commande confirmée !</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{methodMessage}</p>

        {orderReference && (
          <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Référence de commande</span>
            <div className="mt-1 font-mono text-lg font-bold text-foreground">{orderReference}</div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={`/suivi?reference=${encodeURIComponent(orderReference)}`}>Suivre la livraison en direct</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalogue">Continuer mes achats</Link>
          </Button>
        </div>
      </Shell>
    )
  }

  if (status === 'missing') {
    return (
      <Shell>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground">
          <Clock className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Aucune commande à confirmer</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Cette page confirme le statut de votre commande. Aucune référence valide n'a été transmise.
        </p>
        <Button asChild className="mt-6">
          <Link href="/catalogue">Voir le catalogue</Link>
        </Button>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Paiement non confirmé</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message || "Nous n'avons pas pu confirmer la transaction. Si vous avez été débité, contactez le support."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/checkout">Réessayer</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contacter l'assistance</Link>
        </Button>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-soft">
        {children}
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={1.75} />
        </Shell>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
