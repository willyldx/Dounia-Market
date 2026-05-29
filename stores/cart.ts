import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CurrencyCode } from '@/lib/types'
import { DEFAULT_RATES, formatPrice as fmt } from '@/lib/currency'

interface CartState {
  items: CartItem[]
  currency: CurrencyCode
  rates: Record<string, number>
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string }, qty?: number) => void
  removeItem: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  clear: () => void
  setCurrency: (c: CurrencyCode) => void
  fetchRates: () => Promise<void>
  open: () => void
  close: () => void
  toggle: () => void
  format: (amount: number) => string
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'EUR',
      rates: { ...DEFAULT_RATES },
      isOpen: false,

      addItem: (item, qty = 1) => {
        const id = item.variantId ? `${item.productId}-${item.variantId}` : item.productId
        const items = [...get().items]
        const existing = items.find((i) => i.id === id)
        if (existing) existing.quantity += qty
        else items.push({ ...item, id, quantity: qty } as CartItem)
        set({ items, isOpen: true })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      increment: (id) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)) }),
      decrement: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item && item.quantity > 1) {
          set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)) })
        } else {
          set({ items: get().items.filter((i) => i.id !== id) })
        }
      },
      clear: () => set({ items: [] }),
      setCurrency: (currency) => set({ currency }),
      fetchRates: async () => {
        try {
          const res = await fetch('/api/exchange-rates')
          const data = await res.json()
          if (data?.rates) set({ rates: { ...get().rates, ...data.rates } })
        } catch {
          /* keep defaults */
        }
      },
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      format: (amount) => fmt(amount, get().currency, get().rates),
    }),
    {
      name: 'dounia_market_cart',
      partialize: (s) => ({ items: s.items, currency: s.currency }),
    },
  ),
)

export const selectItemCount = (s: CartState) => s.items.reduce((t, i) => t + i.quantity, 0)
export const selectSubtotal = (s: CartState) => s.items.reduce((t, i) => t + i.price * i.quantity, 0)
