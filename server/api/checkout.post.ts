/**
 * Création de commande (checkout).
 * Laravel calcule le montant débité et initialise la transaction Paystack.
 */
import type { CheckoutPaymentInitialization } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (String(config.public.checkoutPaymentEnabled) !== 'true') {
    throw createError({
      statusCode: 503,
      statusMessage: 'La validation de commande n’est pas ouverte.',
    })
  }

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
    payment_method?: string
    items: Array<{
      product_id?: string
      variant_id?: string
      quantity: number
    }>
  }>(event)

  if (
    !body?.email ||
    !body.customer_first_name ||
    !body.customer_last_name ||
    !body.recipient_name ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données de commande invalides (email, noms, destinataire et articles requis)',
    })
  }

  if (body.payment_method && body.payment_method !== 'card') {
    throw createError({
      statusCode: 422,
      statusMessage: 'Le mode de paiement demandé n’est pas disponible.',
    })
  }

  const apiUrl = (config.public.apiUrl as string || 'https://api.douniamarket.com/api').replace(/\/+$/, '')
  const authToken = getCookie(event, 'dounia_market_auth_token')

  try {
    // Forward to Laravel backend
    const result = await $fetch<CheckoutPaymentInitialization>(`${apiUrl}/checkout`, {
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
        payment_method: 'card',
        items: body.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
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
