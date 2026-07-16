/**
 * Customer notifications. The backend has no notifications endpoint yet, so
 * they are derived from the statuses of the customer's orders and returns.
 * `fetchNotifications` is the single boundary to swap for a real API later.
 */
import { getMyOrders } from './orders'
import type { AppNotification, CustomerOrder, OrderStatusKey } from './types'

const ORDER_NOTIFICATION_COPY: Record<OrderStatusKey, { title: string; body: (ref: string) => string }> = {
  received: {
    title: 'Commande reçue',
    body: (ref) => `Nous avons bien reçu votre commande ${ref}.`,
  },
  preparing: {
    title: 'Commande en préparation',
    body: (ref) => `Votre commande ${ref} est en cours de préparation.`,
  },
  shipping: {
    title: 'Livraison en cours',
    body: (ref) => `Votre commande ${ref} est en route vers son destinataire.`,
  },
  delivered: {
    title: 'Commande livrée',
    body: (ref) => `Votre commande ${ref} a été livrée. Merci pour votre confiance.`,
  },
  cancelled: {
    title: 'Commande annulée',
    body: (ref) => `Votre commande ${ref} a été annulée.`,
  },
}

export function deriveNotifications(orders: CustomerOrder[]): AppNotification[] {
  const list: AppNotification[] = []
  for (const order of orders) {
    if (!order.reference) continue
    const href = `/compte/commandes/${encodeURIComponent(order.reference)}`
    const copy = ORDER_NOTIFICATION_COPY[order.status.key]
    list.push({
      id: `order:${order.reference}:${order.status.key}`,
      type: 'order_status',
      title: copy.title,
      body: copy.body(order.reference),
      href,
      createdAt: order.updatedAt ?? order.createdAt,
    })
    for (const r of order.returns) {
      list.push({
        id: `return:${order.reference}:${r.id ?? r.status}`,
        type: 'return_status',
        title: r.label,
        body: `Retour sur la commande ${order.reference}${r.reason ? ` : ${r.reason}` : '.'}`,
        href,
        createdAt: r.createdAt ?? order.updatedAt ?? order.createdAt,
      })
    }
  }
  return list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export async function fetchNotifications(token: string): Promise<AppNotification[]> {
  const orders = await getMyOrders(token)
  return deriveNotifications(orders)
}
