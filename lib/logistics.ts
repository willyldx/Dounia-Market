import { apiFetch } from './api'

export interface LogisticsLookupResponse {
  fulfillment: {
    id: number
    tracking_reference: string
    status: string
    carrier_name?: string | null
    origin_country?: string | null
    destination_country?: string | null
    weight_kg?: number | null
    volume_cbm?: number | null
    dispatched_from_origin_at?: string | null
    customs_cleared_at?: string | null
    delivered_at?: string | null
    shipping_method?: {
      id: number
      name: string
      code: string
      shipping_type: string
    } | null
    order?: {
      id: number
      reference: string
      customer_name: string
      recipient_name: string
      recipient_phone: string
      city: string
      address: string
      status: string
    } | null
    scans?: Array<{
      id: number
      scan_stage: string
      location: string
      scanned_at: string
      notes?: string | null
      operator_name?: string | null
    }>
  }
}

export interface CargoManifest {
  id: number
  manifest_number: string
  transport_type: 'air_cargo' | 'sea_container' | 'road_freight'
  carrier_name: string
  voyage_flight_number?: string | null
  origin_hub: string
  destination_hub: string
  departure_scheduled_at?: string | null
  arrival_scheduled_at?: string | null
  dispatched_at?: string | null
  arrived_at?: string | null
  customs_cleared_at?: string | null
  status: 'draft' | 'sealed' | 'dispatched' | 'arrived' | 'customs_cleared' | 'completed' | 'cancelled'
  total_parcels: number
  total_weight_kg?: number | null
  total_volume_cbm?: number | null
  notes?: string | null
  items?: Array<{
    id: number
    order_fulfillment_id: number
    package_tracking_number: string
    status: string
    weight_kg?: number | null
    notes?: string | null
    fulfillment?: {
      id: number
      tracking_reference: string
      status: string
      suborder?: {
        order?: {
          display_id: string
          recipient_name: string
          recipient_phone: string
          shipping_city: string
        }
      }
    }
  }>
}

export interface ShippingLabelResponse {
  reference: string
  svg_barcode: string
  label_data: {
    reference: string
    carrier_name: string
    shipping_type: string
    origin_hub: string
    destination_hub: string
    recipient_name: string
    recipient_phone: string
    shipping_city: string
    shipping_address: string
    weight_kg: number
    created_at: string
  }
}

export const logisticsApi = {
  lookup: (token: string, barcode: string) =>
    apiFetch<LogisticsLookupResponse>(`admin/logistics/lookup?barcode=${encodeURIComponent(barcode)}`, { token }),

  scan: (
    token: string,
    body: {
      barcode: string
      scan_stage: string
      location?: string
      notes?: string
      latitude?: number
      longitude?: number
    },
  ) =>
    apiFetch<{ success: boolean; scan: any; fulfillment: any }>('admin/logistics/scan', {
      method: 'POST',
      token,
      body,
    }),

  manifests: (token: string, params?: Record<string, string | number | undefined>) =>
    apiFetch<{ data: CargoManifest[]; total: number }>('admin/logistics/manifests', {
      token,
      query: params,
    }),

  createManifest: (
    token: string,
    body: {
      transport_type: string
      carrier_name: string
      voyage_flight_number?: string
      origin_hub: string
      destination_hub: string
      departure_scheduled_at?: string
      arrival_scheduled_at?: string
      notes?: string
    },
  ) =>
    apiFetch<{ manifest: CargoManifest }>('admin/logistics/manifests', {
      method: 'POST',
      token,
      body,
    }),

  manifestDetail: (token: string, id: number | string) =>
    apiFetch<{ manifest: CargoManifest }>(`admin/logistics/manifests/${id}`, { token }),

  addParcelToManifest: (
    token: string,
    manifestId: number | string,
    body: {
      barcode: string
      weight?: number
      notes?: string
    },
  ) =>
    apiFetch<{ success: boolean; item: any; manifest: CargoManifest }>(
      `admin/logistics/manifests/${manifestId}/items`,
      { method: 'POST', token, body },
    ),

  dispatchManifest: (token: string, manifestId: number | string, body?: { notes?: string }) =>
    apiFetch<{ success: boolean; manifest: CargoManifest }>(
      `admin/logistics/manifests/${manifestId}/dispatch`,
      { method: 'POST', token, body: body || {} },
    ),

  customsClearManifest: (token: string, manifestId: number | string, body?: { notes?: string }) =>
    apiFetch<{ success: boolean; manifest: CargoManifest }>(
      `admin/logistics/manifests/${manifestId}/customs-clear`,
      { method: 'POST', token, body: body || {} },
    ),

  getShippingLabel: (token: string, reference: string) =>
    apiFetch<ShippingLabelResponse>(`admin/logistics/label/${encodeURIComponent(reference)}`, { token }),
}
