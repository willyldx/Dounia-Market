import { NextResponse } from 'next/server'

const FALLBACK = { USD: 1.08, XAF: 655.957, XOF: 655.957, GBP: 0.86, CAD: 1.48, CHF: 0.94 }

export const revalidate = 3600

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', { next: { revalidate: 3600 } })
    const data = await res.json()
    if (!data || data.result !== 'success') throw new Error('rates unavailable')
    return NextResponse.json({
      success: true,
      base: 'EUR',
      rates: {
        USD: data.rates.USD,
        XAF: 655.957,
        XOF: 655.957,
        GBP: data.rates.GBP,
        CAD: data.rates.CAD,
        CHF: data.rates.CHF,
      },
      updated_at: data.time_last_update_utc,
    })
  } catch {
    return NextResponse.json({ success: false, base: 'EUR', rates: FALLBACK })
  }
}
