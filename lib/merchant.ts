/**
 * Merchant API client for Dounia Market.
 * Connects directly to backend /api/merchant endpoints using Bearer token authentication.
 */
import { apiFetch } from './api'

type QueryParams = Record<string, string | number | undefined>

export interface MerchantProductPayload {
  title: string
  subtitle?: string | null
  description?: string | null
  category_id?: number | null
  sku?: string | null
  price?: string | number
  price_minor?: number
  currency?: string
  stock_quantity?: number
  available_from?: string | null
  available_until?: string | null
}

export interface MerchantPayoutMethodPayload {
  type: 'mobile_money' | 'bank_account_sepa' | 'bank_account_chadian' | 'bank_account_north_america' | 'bank_account_international'
  currency: string
  country: string
  account_holder_name: string
  account_identifier: string
  routing_identifier?: string | null
  bank_name?: string | null
  operator?: 'airtel' | 'moov' | null
  is_default?: boolean
}

export const merchantApi = {
  // Dashboard & Stores
  dashboard: (token: string, params?: QueryParams) =>
    apiFetch<{ data: any }>('merchant/dashboard', { token, query: params }),

  store: (token: string) =>
    apiFetch<{ data: any }>('merchant/store', { token }),

  stores: (token: string) =>
    apiFetch<{ data: any[] }>('merchant/stores', { token }),

  profile: (token: string) =>
    apiFetch<{ data: any }>('merchant/profile', { token }),

  updateProfile: (token: string, body: Record<string, unknown>) =>
    apiFetch<{ data: any }>('merchant/profile', { method: 'PATCH', token, body }),

  onboardingStatus: (token: string) =>
    apiFetch<{ data: any }>('merchant/onboarding', { token }),

  // Products
  products: (token: string, params?: QueryParams) =>
    apiFetch<{ data: any[]; meta?: any; current_page?: number; total?: number; last_page?: number }>(
      'merchant/products',
      { token, query: params },
    ),

  productDetail: (token: string, id: number | string) =>
    apiFetch<{ data: any; product?: any }>(`merchant/products/${id}`, { token }),

  productCreate: (token: string, body: MerchantProductPayload) =>
    apiFetch<{ data: any; product?: any }>('merchant/products', { method: 'POST', token, body }),

  productUpdate: (token: string, id: number | string, body: Partial<MerchantProductPayload>) =>
    apiFetch<{ data: any; product?: any }>(`merchant/products/${id}`, { method: 'PATCH', token, body }),

  productStock: (token: string, id: number | string, stock_quantity: number) =>
    apiFetch<{ data: any }>(`merchant/products/${id}/stock`, {
      method: 'PATCH',
      token,
      body: { stock_quantity },
    }),

  productSubmit: (token: string, id: number | string) =>
    apiFetch<{ data: any }>(`merchant/products/${id}/submit`, { method: 'POST', token }),

  productDelete: (token: string, id: number | string) =>
    apiFetch<{ message?: string }>(`merchant/products/${id}`, { method: 'DELETE', token }),

  // Orders & Shipments
  orders: (token: string, params?: QueryParams) =>
    apiFetch<{ data: any[]; meta?: any; current_page?: number; total?: number }>(
      'merchant/orders',
      { token, query: params },
    ),

  orderDetail: (token: string, id: number | string) =>
    apiFetch<{ data: any }>(`merchant/orders/${id}`, { token }),

  orderTransition: (token: string, id: number | string, status: string, note?: string) =>
    apiFetch<{ data: any }>(`merchant/orders/${id}/status`, {
      method: 'PATCH',
      token,
      body: { status, note },
    }),

  orderFulfillment: (token: string, id: number | string) =>
    apiFetch<{ data: any }>(`merchant/orders/${id}/fulfillment`, { token }),

  orderDispatchInternational: (
    token: string,
    id: number | string,
    body: { carrier_name: string; tracking_reference: string; notes?: string },
  ) =>
    apiFetch<{ data: any }>(`merchant/orders/${id}/international-dispatch`, {
      method: 'POST',
      token,
      body,
    }),

  // Finances & Payouts
  earnings: (token: string, params?: QueryParams) =>
    apiFetch<{
      data: any[]
      aggregates?: { totals_by_currency?: Record<string, number> }
      balances_by_currency?: Record<string, number>
      meta?: any
    }>('merchant/earnings', { token, query: params }),

  payoutBatches: (token: string, params?: QueryParams) =>
    apiFetch<{
      data: any[]
      eligible_balances_by_currency?: Record<string, number>
      meta?: any
    }>('merchant/payout-batches', { token, query: params }),

  payoutMethods: (token: string, params?: QueryParams) =>
    apiFetch<{ data: any[] }>('merchant/payout-methods', { token, query: params }),

  payoutMethodCreate: (token: string, body: MerchantPayoutMethodPayload) =>
    apiFetch<{ data: any; message?: string }>('merchant/payout-methods', {
      method: 'POST',
      token,
      body,
    }),

  payoutMethodSetDefault: (token: string, id: number | string) =>
    apiFetch<{ data: any }>(`merchant/payout-methods/${id}/default`, {
      method: 'PATCH',
      token,
    }),

  payoutMethodDelete: (token: string, id: number | string) =>
    apiFetch<{ message?: string }>(`merchant/payout-methods/${id}`, {
      method: 'DELETE',
      token,
    }),

  // KYC Documents
  documents: (token: string) =>
    apiFetch<{ data: any[] }>('merchant/documents', { token }),

  documentUpload: (token: string, file: File, type: string, notes?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('document_type', type)
    if (notes) fd.append('notes', notes)
    return apiFetch<{ data: any; message?: string }>('merchant/documents', {
      method: 'POST',
      token,
      body: fd,
    })
  },

  documentDelete: (token: string, id: number | string) =>
    apiFetch<{ message?: string }>(`merchant/documents/${id}`, {
      method: 'DELETE',
      token,
    }),
}
