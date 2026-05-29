import type { CurrencyCode } from './types'

export const DEFAULT_RATES: Record<Exclude<CurrencyCode, 'EUR'>, number> = {
  USD: 1.08,
  XAF: 655.957,
  GBP: 0.86,
  CAD: 1.48,
  CHF: 0.94,
}

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: 'EUR', label: 'EUR' },
  { code: 'USD', label: 'USD' },
  { code: 'XAF', label: 'FCFA' },
  { code: 'GBP', label: 'GBP' },
  { code: 'CAD', label: 'CAD' },
  { code: 'CHF', label: 'CHF' },
]

/** Amounts are stored in EUR; format/convert for display. (Ported from the old cart store.) */
export function formatPrice(
  amount: number,
  currency: CurrencyCode,
  rates: Record<string, number>,
): string {
  if (currency === 'XAF') {
    const xaf = Math.round(amount * (rates.XAF || 655.957))
    return new Intl.NumberFormat('fr-FR').format(xaf) + ' FCFA'
  }
  if (currency === 'EUR') {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
  }
  const rate = rates[currency] ?? 1
  const locales: Record<string, string> = {
    USD: 'en-US',
    GBP: 'en-GB',
    CAD: 'en-CA',
    CHF: 'fr-CH',
  }
  return new Intl.NumberFormat(locales[currency] || 'fr-FR', {
    style: 'currency',
    currency,
  }).format(amount * rate)
}
