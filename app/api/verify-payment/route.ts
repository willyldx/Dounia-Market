import { NextResponse } from 'next/server'
import { API_URL } from '@/lib/api'

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_CHECKOUT_PAYMENT_ENABLED !== 'true') {
    return NextResponse.json({ message: "La validation de commande n'est pas ouverte." }, { status: 503 })
  }

  const { orderReference, paymentReference } = (await req.json().catch(() => ({}))) as {
    orderReference?: string
    paymentReference?: string
  }
  if (!orderReference || !paymentReference) {
    return NextResponse.json(
      { message: 'Les références de commande et de paiement sont requises.' },
      { status: 400 },
    )
  }

  try {
    const res = await fetch(`${API_URL}/orders/${encodeURIComponent(orderReference)}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ payment_reference: paymentReference }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Le paiement ne correspond pas à cette commande.' },
        { status: res.status || 422 },
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Le paiement ne correspond pas à cette commande.' }, { status: 422 })
  }
}
