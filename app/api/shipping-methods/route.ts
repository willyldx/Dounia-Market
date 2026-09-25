import { NextResponse } from 'next/server'
import { API_URL } from '@/lib/api'
import { FALLBACK_SHIPPING_METHODS } from '@/lib/shipping'

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/shipping-methods`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ data: FALLBACK_SHIPPING_METHODS })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ data: FALLBACK_SHIPPING_METHODS })
  }
}
