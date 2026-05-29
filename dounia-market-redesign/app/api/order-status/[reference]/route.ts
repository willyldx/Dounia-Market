import { NextResponse } from 'next/server'
import { API_URL } from '@/lib/api'

export async function GET(_req: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  if (!reference) {
    return NextResponse.json({ message: 'Référence manquante' }, { status: 400 })
  }
  try {
    const res = await fetch(`${API_URL}/orders/status/${encodeURIComponent(reference)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    const data = await res.json().catch(() => null)
    if (res.status === 404) {
      return NextResponse.json({ message: 'Commande introuvable' }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json({ message: 'Erreur lors de la vérification du statut' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Erreur lors de la vérification du statut' }, { status: 500 })
  }
}
