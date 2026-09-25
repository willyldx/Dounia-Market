import { NextResponse } from 'next/server'
import { API_URL } from '@/lib/api'
import { FALLBACK_PAYMENT_METHODS } from '@/lib/payment'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const backendUrl = new URL(`${API_URL}/checkout/payment-methods`)
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value)
    })

    const res = await fetch(backendUrl.toString(), {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ data: FALLBACK_PAYMENT_METHODS })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ data: FALLBACK_PAYMENT_METHODS })
  }
}
