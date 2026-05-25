/**
 * Paystack Webhook Handler
 * Forward to Laravel backend for centralized processing.
 * Configure this URL in Paystack Dashboard → Settings → Webhooks
 */
import { createHmac } from 'crypto'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const secretKey = config.paystackSecretKey

    // Read raw body for signature verification
    const rawBody = await readRawBody(event) || ''

    // Verify webhook signature — MANDATORY
    const signature = getHeader(event, 'x-paystack-signature')

    if (!signature) {
        console.error('Paystack webhook: Missing signature')
        throw createError({
            statusCode: 401,
            statusMessage: 'Missing signature',
        })
    }

    const hash = createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex')

    if (hash !== signature) {
        console.error('Paystack webhook: Invalid signature')
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid signature',
        })
    }

    // Forward the verified webhook to Laravel backend
    const apiUrl = (config.public.apiUrl as string || 'https://api.douniamarket.com/api').replace(/\/+$/, '')
    
    try {
        await $fetch(`${apiUrl}/webhooks/paystack`, {
            method: 'POST',
            body: rawBody,
            headers: {
                'Content-Type': 'application/json',
                'x-paystack-signature': signature,
            },
        })
    } catch (error: any) {
        console.error('[Paystack Webhook] Failed to forward to Laravel:', error)
        // Don't throw — still acknowledge to Paystack
    }

    // Always return 200 to acknowledge receipt
    return { status: 'ok' }
})
