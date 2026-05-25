/**
 * Création de commande (checkout).
 * Proxy vers le backend Laravel: POST /api/checkout
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    user_id?: string
    email: string
    customer_first_name: string
    customer_last_name: string
    customer_phone?: string
    recipient_name: string
    recipient_phone?: string
    shipping_address_1?: string
    shipping_address_2?: string
    shipping_city?: string
    shipping_country?: string
    delivery_instructions?: string
    subtotal: number
    shipping_total: number
    total: number
    payment_method?: string
    payment_amount_fcfa?: number
    items: Array<{
      product_id?: string
      variant_id?: string
      title: string
      quantity: number
      unit_price: number
      total: number
      thumbnail?: string
    }>
  }>(event)

  if (
    !body?.email ||
    !body.customer_first_name ||
    !body.customer_last_name ||
    !body.recipient_name ||
    typeof body.total !== 'number' ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données de commande invalides (email, noms, destinataire, total, items requis)',
    })
  }

  const config = useRuntimeConfig()
  const apiUrl = (config.public.apiUrl as string || 'https://api.douniamarket.com/api').replace(/\/+$/, '')
  const authToken = getCookie(event, 'tchadbox_auth_token')

  try {
    // Forward to Laravel backend
    const result = await $fetch<{ orderId: string; reference: string }>(`${apiUrl}/checkout`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      body: {
        user_id: body.user_id || null,
        email: body.email,
        customer_first_name: body.customer_first_name,
        customer_last_name: body.customer_last_name,
        customer_phone: body.customer_phone ?? null,
        recipient_name: body.recipient_name,
        recipient_phone: body.recipient_phone ?? null,
        shipping_address_1: body.shipping_address_1 ?? null,
        shipping_address_2: body.shipping_address_2 ?? null,
        shipping_city: body.shipping_city ?? "N'Djamena",
        shipping_country: body.shipping_country ?? 'Tchad',
        delivery_instructions: body.delivery_instructions ?? null,
        subtotal: Number(body.subtotal),
        shipping_total: Number(body.shipping_total),
        total: Number(body.total),
        currency: 'EUR',
        payment_method: body.payment_method ?? 'card',
        payment_amount_fcfa: body.payment_amount_fcfa ?? null,
        items: body.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
          thumbnail: item.thumbnail,
        })),
      },
    })

    return result
  } catch (error: any) {
    console.error('[checkout] Laravel API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Erreur lors de la création de la commande',
    })
  }
})
