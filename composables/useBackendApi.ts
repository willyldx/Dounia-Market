/**
 * Appels vers l'API backend Laravel avec le token Sanctum.
 * Utiliser pour: /api/admin/*, /api/livreur/*, /api/checkout.
 */
import type { CheckoutPaymentInitialization, PublicOrderStatus } from '~/types'

export function useBackendApi() {
  const authCookie = useCookie('dounia_market_auth_token')

  const getBaseUrl = () => {
    const config = useRuntimeConfig()
    let url = config.public.apiUrl || 'https://api.douniamarket.com'
    // Ensure baseUrl does NOT end with /api — we add it in paths
    url = url.replace(/\/api\/?$/, '')
    // Remove trailing slash
    url = url.replace(/\/$/, '')
    return url
  }

  const fetchWithAuth = async <T>(
    path: string,
    options: { method?: any; body?: any; query?: Record<string, any> } = {}
  ): Promise<T> => {
    // Get Sanctum token from cookies
    const token = authCookie.value || ''

    const baseUrl = getBaseUrl()
    // Ensure path starts with /api/
    let cleanPath = path.replace(/^\/+/, '')
    if (!cleanPath.startsWith('api/')) {
      cleanPath = `api/${cleanPath}`
    }
    const url = `${baseUrl}/${cleanPath}`
    
    return $fetch<T>(url, {
      method: options.method || 'GET',
      body: options.body,
      query: options.query,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    } as any)
  }

  return {
    fetchWithAuth,
    /** POST /api/checkout — proxied to Laravel. Supports guests (no auth needed). */
    checkout: (body: any) =>
      $fetch<CheckoutPaymentInitialization>('/api/checkout', {
        method: 'POST',
        body,
      }),
    /** GET /api/admin/stats */
    adminStats: () => fetchWithAuth<any>('api/admin/stats'),

    /** GET /api/order-status/:reference — public, no auth */
    orderStatus: (reference: string) =>
      $fetch<PublicOrderStatus>(
        `/api/order-status/${encodeURIComponent(reference)}`
      ),

    // ── Public ─────────────────────────────────────────────
    /** POST /api/contact — public */
    contactSupport: (body: any) =>
      fetchWithAuth<{ success: boolean; message: string }>('api/contact', {
        method: 'POST',
        body,
      }),

    /** GET /api/orders/mine — requires auth */
    userOrders: () =>
      fetchWithAuth<{ data: any[] }>('api/orders/mine'),

    /** GET /api/orders/:reference — requires auth */
    userOrderDetail: (reference: string) =>
      fetchWithAuth<{ order: any }>(`api/orders/${encodeURIComponent(reference)}`),

    // ── Orders ──────────────────────────────────────────────
    /** GET /api/admin/orders */
    adminOrders: (params?: { limit?: number; offset?: number; status?: string; payment_status?: string; fulfillment_status?: string; search?: string }) =>
      fetchWithAuth<{ data: any[]; count: number; offset: number; limit: number; hasMore: boolean }>(
        'api/admin/orders',
        { query: params }
      ),
    /** GET /api/admin/orders/:id */
    adminOrderDetail: (id: string | number) =>
      fetchWithAuth<{ order: any }>(`api/admin/orders/${id}`),
    /** PATCH /api/admin/orders/:id */
    adminOrderUpdate: (id: string | number, body: Record<string, unknown>) =>
      fetchWithAuth<{ order: any }>(`api/admin/orders/${id}`, { method: 'PATCH', body }),

    // ── Clients ─────────────────────────────────────────────
    /** GET /api/admin/clients */
    adminClients: (params?: { limit?: number; offset?: number }) =>
      fetchWithAuth<{ data: any[]; count: number }>('api/admin/clients', { query: params }),

    // ── Stocks ──────────────────────────────────────────────
    /** POST /api/admin/upload */
    adminUploadFile: (file: File) => {
      const formData = new FormData()
      formData.append('image', file)
      return fetchWithAuth<{ url: string; path: string }>('api/admin/upload', {
        method: 'POST',
        body: formData,
      })
    },
    /** GET /api/admin/stocks */
    adminStocks: () =>
      fetchWithAuth<{ data: any[] }>('api/admin/stocks'),
    /** POST /api/admin/stocks/import */
    adminStockImport: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return fetchWithAuth<{ success: boolean; message?: string; stats?: any }>('api/admin/stocks/import', {
        method: 'POST',
        body: formData,
      })
    },
    /** PATCH /api/admin/stocks/:id */
    adminStockUpdate: (id: number, body: Record<string, unknown>) =>
      fetchWithAuth<{ product: any }>(`api/admin/stocks/${id}`, { method: 'PATCH', body }),
    /** POST /api/admin/products */
    adminProductCreate: (body: Record<string, unknown>) =>
      fetchWithAuth<{ product: any }>('api/admin/products', { method: 'POST', body }),
    /** DELETE /api/admin/products/:id */
    adminProductDelete: (id: number) =>
      fetchWithAuth<{ success: boolean }>(`api/admin/products/${id}`, { method: 'DELETE' }),

    // ── Livreurs ────────────────────────────────────────────
    /** GET /api/admin/livreurs */
    adminLivreurs: () =>
      fetchWithAuth<{ data: any[] }>('api/admin/livreurs'),
    /** POST /api/admin/livreurs */
    adminLivreurCreate: (body: Record<string, unknown>) =>
      fetchWithAuth<{ agent: any }>('api/admin/livreurs', { method: 'POST', body }),
    /** PATCH /api/admin/livreurs/:id */
    adminLivreurUpdate: (id: number, body: Record<string, unknown>) =>
      fetchWithAuth<{ agent: any }>(`api/admin/livreurs/${id}`, { method: 'PATCH', body }),
    /** DELETE /api/admin/livreurs/:id */
    adminLivreurDelete: (id: number) =>
      fetchWithAuth<{ success: boolean }>(`api/admin/livreurs/${id}`, { method: 'DELETE' }),

    // ── Finances & Team ─────────────────────────────────────
    /** GET /api/admin/finances */
    adminFinances: () => fetchWithAuth<any>('api/admin/finances'),
    /** GET /api/admin/team */
    adminTeam: () => fetchWithAuth<any>('api/admin/team'),
    /** POST /api/admin/team/promote */
    adminPromoteTeam: (targetId: string, role: string) => 
      fetchWithAuth<any>('api/admin/team/promote', { method: 'POST', body: { target_user_id: targetId, new_role: role } }),
    
    /** GET /api/livreur/orders */
    livreurOrders: (params?: { limit?: number; offset?: number; status?: string }) =>
      fetchWithAuth<{ data: any[] }>('api/livreur/orders', { query: params }),
    /** PATCH /api/livreur/orders/:id */
    livreurOrderUpdate: (id: string, body: Record<string, unknown>) =>
      fetchWithAuth(`api/livreur/orders/${id}`, { method: 'PATCH', body }),
  }
}
