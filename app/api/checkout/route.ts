import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_URL, AUTH_COOKIE } from '@/lib/api'

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_CHECKOUT_PAYMENT_ENABLED !== 'true') {
    return NextResponse.json({ message: "La validation de commande n'est pas ouverte." }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  if (
    !body?.email ||
    !body.customer_first_name ||
    !body.customer_last_name ||
    !body.recipient_name ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { message: 'Données de commande invalides (email, noms, destinataire et articles requis)' },
      { status: 400 },
    )
  }
  if (body.payment_method && body.payment_method !== 'card') {
    return NextResponse.json({ message: "Le mode de paiement demandé n'est pas disponible." }, { status: 422 })
  }

  const token = (await cookies()).get(AUTH_COOKIE)?.value

  try {
    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: body.user_id || null,
        email: body.email,
        customer_first_name: body.customer_first_name,
        customer_last_name: body.customer_last_name,
        customer_phone: body.customer_phone ?? null,
        recipient_name: body.recipient_name,
        recipient_phone: body.recipient_phone ?? null,
        shipping_address_1: body.shipping_address_1 ?? null,
        shipping_address_2: body.shipping_address_2 ?? null,
        shipping_city: body.shipping_city ?? "N'Djamena",
        shipping_country: body.shipping_country ?? 'Tchad',
        delivery_instructions: body.delivery_instructions ?? null,
        payment_method: 'card',
        items: body.items.map((i: any) => ({
          product_id: i.product_id,
          variant_id: i.variant_id,
          quantity: i.quantity,
        })),
      }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Erreur lors de la création de la commande' },
        { status: res.status },
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Erreur lors de la création de la commande' }, { status: 500 })
  }
}
