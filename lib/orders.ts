/**
 * Typed boundary for customer orders: normalizes the Laravel API's free-form
 * order payloads (snake_case, several historical field names) into CustomerOrder.
 * Shared by the account order pages, public tracking and notifications.
 */
import { apiFetch } from './api'
import type {
  CustomerOrder,
  CustomerOrderItem,
  OrderReturn,
  OrderStatusInfo,
  OrderStatusKey,
  OrderTimelineEvent,
  ReturnStatusKey,
} from './types'

export const ORDER_STATUS_LABELS: Record<OrderStatusKey, string> = {
  received: 'Commande reçue',
  preparing: 'En préparation',
  shipping: 'En cours de livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

/** Delivery steps shown in the timeline (cancelled is rendered separately). */
export const ORDER_STEPS: { key: Exclude<OrderStatusKey, 'cancelled'>; label: string }[] = [
  { key: 'received', label: ORDER_STATUS_LABELS.received },
  { key: 'preparing', label: ORDER_STATUS_LABELS.preparing },
  { key: 'shipping', label: ORDER_STATUS_LABELS.shipping },
  { key: 'delivered', label: ORDER_STATUS_LABELS.delivered },
]

/** Map the backend's free-form status strings (fr/en variants) to a canonical key. */
export function parseOrderStatus(raw?: string): OrderStatusInfo {
  const s = (raw || '').toLowerCase()
  let key: OrderStatusKey = 'received'
  if (/(cancel|annul|refus|rejet)/.test(s)) key = 'cancelled'
  else if (/(deliver|livr[ée]|complet|termin)/.test(s)) key = 'delivered'
  else if (/(ship|transit|cours|route|en_livraison|out_for)/.test(s)) key = 'shipping'
  else if (/(prepar|process|en_cours|confirm|paid|pay)/.test(s)) key = 'preparing'
  return { key, label: ORDER_STATUS_LABELS[key], raw }
}

export function orderStepIndex(key: OrderStatusKey): number {
  const i = ORDER_STEPS.findIndex((s) => s.key === key)
  return i === -1 ? 0 : i
}

/** Build the delivery timeline for an order, using backend event dates when present. */
export function buildTimeline(order: Pick<CustomerOrder, 'status' | 'createdAt' | 'updatedAt'>): OrderTimelineEvent[] {
  const current = orderStepIndex(order.status.key)
  return ORDER_STEPS.map((step, i) => ({
    key: step.key,
    label: step.label,
    date: i === 0 ? order.createdAt : i === current ? order.updatedAt : undefined,
    done: i < current || order.status.key === 'delivered',
    active: i === current && order.status.key !== 'delivered',
  }))
}

const RETURN_STATUS_LABELS: Record<ReturnStatusKey, string> = {
  requested: 'Retour demandé',
  approved: 'Retour accepté',
  refused: 'Retour refusé',
  in_transit: 'Retour en cours',
  refunded: 'Remboursé',
}

function parseReturnStatus(raw?: string): { status: ReturnStatusKey; label: string } {
  const s = (raw || '').toLowerCase()
  let status: ReturnStatusKey = 'requested'
  if (/(refund|rembours)/.test(s)) status = 'refunded'
  else if (/(refus|reject|denied)/.test(s)) status = 'refused'
  else if (/(transit|cours|shipping)/.test(s)) status = 'in_transit'
  else if (/(approv|accept|valid)/.test(s)) status = 'approved'
  return { status, label: RETURN_STATUS_LABELS[status] }
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined
}

function normalizeItem(it: any): CustomerOrderItem {
  return {
    title: str(it?.title) ?? str(it?.name) ?? str(it?.product_title) ?? 'Article',
    quantity: num(it?.quantity) ?? num(it?.qty) ?? 1,
    price: num(it?.price) ?? num(it?.unit_price),
    variantTitle: str(it?.variant_title) ?? str(it?.variant?.title),
    thumbnail: str(it?.thumbnail) ?? str(it?.image),
  }
}

function normalizeReturn(r: any): OrderReturn {
  const { status, label } = parseReturnStatus(str(r?.status) ?? str(r?.state))
  return {
    id: r?.id != null ? String(r.id) : undefined,
    status,
    label,
    reason: str(r?.reason) ?? str(r?.motif),
    createdAt: str(r?.created_at) ?? str(r?.date),
  }
}

export function normalizeOrder(raw: any): CustomerOrder {
  const o = raw || {}
  const rawItems: any[] = Array.isArray(o.items) ? o.items : Array.isArray(o.line_items) ? o.line_items : []
  const rawReturns: any[] = Array.isArray(o.returns) ? o.returns : o.return ? [o.return] : []
  const address = o.address
  return {
    id: o.id != null ? String(o.id) : (str(o.reference) ?? ''),
    reference: str(o.reference) ?? (o.id != null ? String(o.id) : ''),
    status: parseOrderStatus(str(o.status) ?? str(o.state) ?? str(o.fulfillment_status)),
    createdAt: str(o.created_at) ?? str(o.date),
    updatedAt: str(o.updated_at),
    items: rawItems.map(normalizeItem),
    subtotal: num(o.subtotal),
    shipping: num(o.shipping) ?? num(o.delivery_fee),
    customsTotal: num(o.customs_total) ?? num(o.customs_fee),
    total: num(o.total) ?? num(o.amount),
    currency: o.currency || 'XAF',
    paymentMethod: str(o.payment_method),
    shippingMethod: o.shipping_method || null,
    fulfillments: Array.isArray(o.fulfillments) ? o.fulfillments : o.suborders?.[0]?.fulfillment ? [o.suborders[0].fulfillment] : [],
    recipient: str(o.recipient) ?? str(o.recipient_name) ?? str(o.customer_name),
    phone: str(o.phone) ?? str(o.recipient_phone),
    address:
      str(typeof address === 'string' ? address : address?.line1) ??
      str(o.shipping_address) ??
      str(o.shipping_address_1),
    city: str(o.city) ?? str(address?.city) ?? str(o.recipient_city) ?? str(o.shipping_city),
    deliveryInstructions: str(o.delivery_instructions),
    returns: rawReturns.map(normalizeReturn),
  }
}


export function formatOrderDate(value?: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Authenticated: orders of the logged-in customer. */
export async function getMyOrders(token: string): Promise<CustomerOrder[]> {
  const res = await apiFetch<{ data: any[] }>('orders/mine', { token })
  return (Array.isArray(res?.data) ? res.data : []).map(normalizeOrder)
}

/** Authenticated: one order of the logged-in customer, by reference. */
export async function getMyOrder(token: string, reference: string): Promise<CustomerOrder | null> {
  const res = await apiFetch<{ order: any }>(`orders/${encodeURIComponent(reference)}`, { token })
  const raw = res?.order ?? res
  return raw ? normalizeOrder(raw) : null
}

/** Public tracking by reference (proxied to hide the API origin). Returns null when unknown. */
export async function trackOrder(reference: string): Promise<CustomerOrder | null> {
  const res = await fetch(`/api/order-status/${encodeURIComponent(reference)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('order-status failed')
  const data = await res.json().catch(() => null)
  const raw = data?.order ?? data
  return raw ? normalizeOrder(raw) : null
}
