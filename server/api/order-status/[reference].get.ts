/**
 * GET /api/order-status/:reference
 * Proxy vers Laravel pour vérifier le statut de paiement (polling Mobile Money).
 */
export default defineEventHandler(async (event) => {
  const reference = getRouterParam(event, 'reference')

  if (!reference) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Référence manquante',
    })
  }

  const config = useRuntimeConfig()
  const apiUrl = (config.public.apiUrl as string || 'https://api.douniamarket.com/api').replace(/\/+$/, '')

  try {
    const result = await $fetch<{
      reference: string
      payment_status: string
      status: string
      payment_method: string
    }>(`${apiUrl}/orders/status/${encodeURIComponent(reference)}`)

    return result
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Commande introuvable',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la vérification du statut',
    })
  }
})
