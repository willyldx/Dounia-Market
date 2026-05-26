/**
 * Verification de retour paiement. Laravel reste l'autorite pour rattacher
 * la reference Paystack a la commande et valider montant/devise.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (String(config.public.checkoutPaymentEnabled) !== 'true') {
    throw createError({
      statusCode: 503,
      statusMessage: 'La validation de commande n’est pas ouverte.',
    })
  }

  const { orderReference, paymentReference } = await readBody<{
    orderReference?: string
    paymentReference?: string
  }>(event)

  if (!orderReference || !paymentReference) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Les références de commande et de paiement sont requises.',
    })
  }

  const apiUrl = (config.public.apiUrl as string || 'https://api.douniamarket.com/api').replace(/\/+$/, '')

  try {
    return await $fetch<{ verified: boolean; reference: string }>(
      `${apiUrl}/orders/${encodeURIComponent(orderReference)}/verify-payment`,
      {
        method: 'POST',
        body: { payment_reference: paymentReference },
      }
    )
  } catch (error: any) {
    console.error('Payment verification rejected by Laravel:', error)
    throw createError({
      statusCode: error.statusCode || error.response?.status || 422,
      statusMessage: error.data?.message || 'Le paiement ne correspond pas à cette commande.',
    })
  }
})
