'use client'

/** Paystack inline v2 loader. Ported from composables/usePaystack.ts. */
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

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Paystack: browser only'))
    if (window.Paystack) return resolve()
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.head.appendChild(script)
  })
}

export function usePaystack() {
  const resumeTransaction = async (accessCode: string) => {
    await loadScript()
    if (!window.Paystack) throw new Error('Paystack SDK not loaded')
    new window.Paystack().resumeTransaction(accessCode)
  }
  return { resumeTransaction }
}
