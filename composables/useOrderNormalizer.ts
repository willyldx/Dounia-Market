import type { Order, OrderItem } from '~/types'

/**
 * Normalise une commande venue de l'API Laravel vers le format attendu par l'UI.
 * Gère à la fois:
 * - items dans metadata.items (checkout API)
 * - order_items en jointure (ancien schéma)
 * - shipping_address en jsonb (objet)
 */
export function useOrderNormalizer() {
  function normalizeOrder(dbOrder: any): Order {
    const items: OrderItem[] = getOrderItems(dbOrder)
    const shippingAddress = dbOrder.shipping_address && typeof dbOrder.shipping_address === 'object'
      ? {
          firstName: dbOrder.shipping_address.first_name ?? 'Destinataire',
          lastName: dbOrder.shipping_address.last_name ?? '',
          address1: dbOrder.shipping_address.address_1 ?? dbOrder.shipping_address.address1 ?? '',
          address2: dbOrder.shipping_address.address_2 ?? dbOrder.shipping_address.address2,
          city: dbOrder.shipping_address.city ?? "N'Djamena",
          country: dbOrder.shipping_address.country ?? 'Tchad',
          phone: dbOrder.shipping_address.phone,
        }
      : null

    return {
      id: dbOrder.id,
      displayId: dbOrder.display_id || `DM-${(dbOrder.id || '').toString().slice(0, 8).toUpperCase()}`,
      status: dbOrder.status,
      paymentStatus: dbOrder.payment_status,
      fulfillmentStatus: dbOrder.fulfillment_status,
      items,
      shippingAddress,
      subtotal: Number(dbOrder.subtotal ?? 0),
      shippingTotal: Number(dbOrder.shipping_total ?? 0),
      total: Number(dbOrder.total ?? 0),
      currency: dbOrder.currency ?? 'EUR',
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      assignedTo: dbOrder.assigned_to,
      assignedAt: dbOrder.assigned_at,
      pickedUpAt: dbOrder.picked_up_at,
      deliveredAt: dbOrder.delivered_at,
      deliveryPhoto: dbOrder.delivery_photo,
      trackingNumber: dbOrder.tracking_number,
      email: dbOrder.email,
      customerFirstName: dbOrder.customer_first_name,
      customerLastName: dbOrder.customer_last_name,
      customerPhone: dbOrder.customer_phone,
      recipientName: dbOrder.recipient_name,
      recipientPhone: dbOrder.recipient_phone,
      deliveryInstructions: dbOrder.delivery_instructions,
      notes: dbOrder.notes,
    }
  }

  function getOrderItems(dbOrder: any): OrderItem[] {
    const fromMetadata = dbOrder.metadata?.items
    if (Array.isArray(fromMetadata) && fromMetadata.length > 0) {
      return fromMetadata.map((item: any, index: number) => ({
        id: item.id || item.product_id || `item-${index}`,
        productId: item.product_id,
        variantId: item.variant_id,
        title: item.title,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
      }))
    }
    const fromJoin = dbOrder.order_items
    if (Array.isArray(fromJoin) && fromJoin.length > 0) {
      return fromJoin.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
      }))
    }
    return []
  }

  return { normalizeOrder, getOrderItems }
}
