interface PaystackInlineInstance {
  resumeTransaction: (accessCode: string) => void
}

interface PaystackConstructor {
  new (): PaystackInlineInstance
}

declare global {
  interface Window {
    Paystack?: PaystackConstructor
  }
}

export const usePaystack = () => {
  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Paystack can only be used in the browser'))
        return
      }

      if (window.Paystack) {
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

  const resumeTransaction = async (accessCode: string): Promise<void> => {
    await loadScript()

    if (!window.Paystack) {
      throw new Error('Paystack SDK not loaded')
    }

    const popup = new window.Paystack()
    popup.resumeTransaction(accessCode)
  }

  return {
    resumeTransaction,
  }
}
