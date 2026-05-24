// Paystack Payment Composable
export const usePaystack = () => {
  const config = useRuntimeConfig()
  const publicKey = config.public.paystackPublicKey

  // Load Paystack script dynamically
  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Paystack can only be used in the browser'))
        return
      }

      // Already loaded
      if ((window as any).PaystackPop) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v2/inline.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Paystack script'))
      document.head.appendChild(script)
    })
  }

  interface PaystackOptions {
    email: string
    amount: number // in the smallest currency unit (kobo for NGN, centimes for XOF/XAF)
    currency?: string
    reference?: string
    metadata?: Record<string, any>
    channels?: string[]
    onSuccess: (response: PaystackResponse) => void
    onClose: () => void
  }

  interface PaystackResponse {
    reference: string
    trans: string
    status: string
    message: string
    transaction: string
    trxref: string
  }

  // Generate unique reference
  const generateReference = (): string => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `TCB-${timestamp}-${random}`.toUpperCase()
  }

  // Convert standard amount to Paystack unit (cents/whole)
  const convertToPaymentAmount = (amount: number, currency: string): number => {
    const cartStore = useCartStore()
    
    if (currency === 'XAF' || currency === 'XOF') {
      // XAF/XOF: 1 unit = 1 Franc (no cents)
      return Math.round(amount * cartStore.rates.XAF)
    }
    
    if (currency === 'USD') {
      // USD: 1 unit = 100 cents
      return Math.round(amount * cartStore.rates.USD * 100)
    }
    
    // Default EUR: 1 unit = 100 cents
    return Math.round(amount * 100)
  }

  // Initialize payment
  const initializePayment = async (options: PaystackOptions): Promise<void> => {
    await loadScript()

    const PaystackPop = (window as any).PaystackPop

    if (!PaystackPop) {
      throw new Error('Paystack SDK not loaded')
    }

    const handler = PaystackPop.setup({
      key: publicKey,
      email: options.email,
      amount: options.amount, 
      ref: options.reference || generateReference(),
      metadata: {
        custom_fields: [
          ...(options.metadata?.custom_fields || []),
        ],
        ...options.metadata,
      },
      callback: (response: PaystackResponse) => {
        options.onSuccess(response)
      },
      onClose: () => {
        options.onClose()
      },
    })

    handler.openIframe()
  }

  // Format XOF amount for display
  const formatXof = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Convert EUR to XOF
  const eurToXof = (amount: number): number => {
    const cartStore = useCartStore()
    return Math.round(amount * cartStore.rates.XAF)
  }

  return {
    initializePayment,
    verifyPayment: async (reference: string) => {
      return $fetch<{ success: boolean; error?: string }>('/api/verify-payment', {
        method: 'POST',
        body: { reference },
      })
    },
    generateReference,
    convertToPaymentAmount,
    eurToXof,
    formatXof,
  }
}
