/**
 * Admin + livreur API calls (Bearer token). Ported from composables/useBackendApi.ts.
 * Pass the auth token (from useAuth store / cookie) to each call.
 */
import { apiFetch } from './api'

type Q = Record<string, string | number | undefined>

export const adminApi = {
  stats: (token: string) => apiFetch<any>('admin/stats', { token }),

  // Orders
  orders: (token: string, params?: Q) =>
    apiFetch<{ data: any[]; count: number; offset: number; limit: number; hasMore: boolean }>(
      'admin/orders',
      { token, query: params },
    ),
  orderDetail: (token: string, id: string | number) =>
    apiFetch<{ order: any }>(`admin/orders/${id}`, { token }),
  orderUpdate: (token: string, id: string | number, body: Record<string, unknown>) =>
    apiFetch<{ order: any }>(`admin/orders/${id}`, { method: 'PATCH', token, body }),

  // Clients
  clients: (token: string, params?: Q) =>
    apiFetch<{ data: any[]; count: number }>('admin/clients', { token, query: params }),

  // Stocks / products
  stocks: (token: string) => apiFetch<{ data: any[] }>('admin/stocks', { token }),
  stockUpdate: (token: string, id: number, body: Record<string, unknown>) =>
    apiFetch<{ product: any }>(`admin/stocks/${id}`, { method: 'PATCH', token, body }),
  uploadFile: (token: string, file: File) => {
    const fd = new FormData()
    fd.append('image', file)
    return apiFetch<{ url: string; path: string }>('admin/upload', { method: 'POST', token, body: fd })
  },
  stockImport: (token: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return apiFetch<{ success: boolean; message?: string; stats?: any }>('admin/stocks/import', {
      method: 'POST',
      token,
      body: fd,
    })
  },
  productCreate: (token: string, body: Record<string, unknown>) =>
    apiFetch<{ product: any }>('admin/products', { method: 'POST', token, body }),
  productDelete: (token: string, id: number) =>
    apiFetch<{ success: boolean }>(`admin/products/${id}`, { method: 'DELETE', token }),

  // Livreurs
  livreurs: (token: string) => apiFetch<{ data: any[] }>('admin/livreurs', { token }),
  livreurCreate: (token: string, body: Record<string, unknown>) =>
    apiFetch<{ agent: any }>('admin/livreurs', { method: 'POST', token, body }),
  livreurUpdate: (token: string, id: number, body: Record<string, unknown>) =>
    apiFetch<{ agent: any }>(`admin/livreurs/${id}`, { method: 'PATCH', token, body }),
  livreurDelete: (token: string, id: number) =>
    apiFetch<{ success: boolean }>(`admin/livreurs/${id}`, { method: 'DELETE', token }),

  // Finances & team
  finances: (token: string) => apiFetch<any>('admin/finances', { token }),
  team: (token: string) => apiFetch<any>('admin/team', { token }),
  promoteTeam: (token: string, targetId: string, role: string) =>
    apiFetch<any>('admin/team/promote', {
      method: 'POST',
      token,
      body: { target_user_id: targetId, new_role: role },
    }),
}

export const livreurApi = {
  orders: (token: string, params?: Q) =>
    apiFetch<{ data: any[] }>('livreur/orders', { token, query: params }),
  orderUpdate: (token: string, id: string, body: Record<string, unknown>) =>
    apiFetch(`livreur/orders/${id}`, { method: 'PATCH', token, body }),
}

// Customer orders (client account)
export const customerApi = {
  myOrders: (token: string) => apiFetch<{ data: any[] }>('orders/mine', { token }),
  orderDetail: (token: string, reference: string) =>
    apiFetch<{ order: any }>(`orders/${encodeURIComponent(reference)}`, { token }),
}
