import type { ShippingMethod } from './types'

export const FALLBACK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 1,
    shipping_zone_id: 1,
    name: "Livraison Urbaine Express (N'Djamena)",
    code: 'LOCAL-NDJ',
    delivery_fee_minor: 150000,
    currency: 'XAF',
    estimated_min_days: 1,
    estimated_max_days: 2,
    is_active: true,
    shipping_type: 'local',
    origin_country: 'TD',
    customs_fee_minor: 0,
    zone: {
      id: 1,
      name: "Tchad National & N'Djamena",
      code: 'TD-NAT',
      country_code: 'TD',
    },
  },
  {
    id: 2,
    shipping_zone_id: 1,
    name: 'Fret Aérien Express (Diaspora France -> N’Djamena)',
    code: 'AIR-FR-TD',
    delivery_fee_minor: 1500000,
    currency: 'XAF',
    estimated_min_days: 5,
    estimated_max_days: 9,
    is_active: true,
    shipping_type: 'cross_border_air',
    origin_country: 'FR',
    customs_fee_minor: 350000,
    tracking_url_template: 'https://www.laposte.fr/outils/suivre-vos-envois?code={tracking_reference}',
    zone: {
      id: 1,
      name: "Tchad National & N'Djamena",
      code: 'TD-NAT',
      country_code: 'TD',
    },
  },
  {
    id: 3,
    shipping_zone_id: 1,
    name: 'Fret Maritime & Cargo (Diaspora Europe / Canada -> N’Djamena)',
    code: 'CARGO-INT-TD',
    delivery_fee_minor: 800000,
    currency: 'XAF',
    estimated_min_days: 15,
    estimated_max_days: 30,
    is_active: true,
    shipping_type: 'cross_border_sea',
    origin_country: null,
    customs_fee_minor: 200000,
    zone: {
      id: 1,
      name: "Tchad National & N'Djamena",
      code: 'TD-NAT',
      country_code: 'TD',
    },
  },
]

export async function fetchShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const res = await fetch('/api/shipping-methods', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return FALLBACK_SHIPPING_METHODS
    const json = await res.json()
    const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : null
    return list && list.length > 0 ? list : FALLBACK_SHIPPING_METHODS
  } catch {
    return FALLBACK_SHIPPING_METHODS
  }
}
