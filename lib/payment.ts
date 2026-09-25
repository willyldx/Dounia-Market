import type { CurrencyCode, PaymentMethodConfig } from './types'

export const FALLBACK_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    method: 'card',
    label: 'Carte Bancaire Internationale',
    provider: 'paystack',
    currencies: ['EUR', 'USD', 'XAF', 'CAD'],
    instructions: 'Paiement sécurisé par carte bancaire (Visa, Mastercard).',
    min_amount_minor: null,
    max_amount_minor: null,
  },
  {
    method: 'tchad_mobile_money',
    label: 'Airtel & Moov Money Tchad',
    provider: 'tchad_mobile_money',
    currencies: ['XAF'],
    instructions: 'Règlement instantané via Airtel Money ou Moov Money au Tchad.',
    min_amount_minor: 100,
    max_amount_minor: 50000000,
  },
  {
    method: 'cash_on_delivery',
    label: 'Paiement à la livraison (Cash on Delivery)',
    provider: 'cash_on_delivery',
    currencies: ['XAF'],
    instructions: 'Paiement en espèces auprès du livreur lors de la remise du colis à N’Djamena (Plafond 150 000 FCFA).',
    min_amount_minor: 500,
    max_amount_minor: 15000000, // 150 000 XAF (in minor units)
  },
  {
    method: 'bank_transfer',
    label: 'Virement bancaire / Dépôt officiel',
    provider: 'bank_transfer',
    currencies: ['EUR', 'USD', 'XAF', 'CAD'],
    instructions: 'Veuillez effectuer le virement sur notre compte bancaire officiel et indiquer la référence de commande.',
    min_amount_minor: 1000,
    max_amount_minor: null,
  },
]

export const COD_MAX_XAF = 150000 // 150 000 FCFA

export async function fetchPaymentMethods(params?: {
  country?: string
  currency?: CurrencyCode
  amountMinor?: number
}): Promise<PaymentMethodConfig[]> {
  try {
    const query = new URLSearchParams()
    if (params?.country) query.set('country', params.country)
    if (params?.currency) query.set('currency', params.currency)
    if (params?.amountMinor) query.set('amount_minor', String(params.amountMinor))

    const url = `/api/checkout/payment-methods${query.toString() ? `?${query.toString()}` : ''}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return FALLBACK_PAYMENT_METHODS
    const json = await res.json()
    const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : null
    return list && list.length > 0 ? list : FALLBACK_PAYMENT_METHODS
  } catch {
    return FALLBACK_PAYMENT_METHODS
  }
}
