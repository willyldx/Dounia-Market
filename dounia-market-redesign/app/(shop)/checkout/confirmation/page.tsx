'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react'
import { useCart } from '@/stores/cart'
import { Button } from '@/components/ui/button'

type Status = 'loading' | 'success' | 'failed' | 'missing'

function ConfirmationContent() {
  const params = useSearchParams()
  const clearCart = useCart((s) => s.clear)
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string>('')
  const ran = useRef(false)

  const paymentReference = params.get('reference') || params.get('trxref') || ''
  const orderReference =
    params.get('orderReference') || params.get('order') || params.get('orderRef') || paymentReference

  useEffect(() => {
    if (ran.current) return
    ran.current = true

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
  }, [orderReference, paymentReference, clearCart])

  if (status === 'loading') {
    return (
      <Shell>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Verification du paiement</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Merci de patienter, nous confirmons votre commande.
        </p>
      </Shell>
    )
  }

  if (status === 'success') {
    return (
      <Shell>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Commande confirmee</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Merci. Votre paiement a bien ete recu et nous preparons la livraison a N'Djamena.
        </p>
        {orderReference && (
          <p className="mt-4 rounded-full bg-secondary/60 px-4 py-2 text-sm">
            Reference: <span className="font-semibold">{orderReference}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={`/suivi?reference=${encodeURIComponent(orderReference)}`}>Suivre ma commande</Link>
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
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Aucune commande a confirmer</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Cette page confirme votre paiement apres une commande. Aucune reference n'a ete trouvee.
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
      <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Paiement non confirme</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message || "Nous n'avons pas pu confirmer votre paiement. Si vous avez ete debite, contactez-nous."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/checkout">Reessayer</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Nous contacter</Link>
        </Button>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-soft">
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
