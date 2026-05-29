import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteItem } from '@/lib/types'

interface FavoritesState {
  items: FavoriteItem[]
  isFavorite: (productId: string) => boolean
  toggle: (item: Omit<FavoriteItem, 'addedAt'>) => void
  remove: (productId: string) => void
  clear: () => void
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      isFavorite: (productId) => get().items.some((i) => i.productId === productId),
      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId)
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) })
        } else {
          set({ items: [...get().items, { ...item, addedAt: new Date().toISOString() }] })
        }
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'dounia_market_favorites' },
  ),
)

export const selectFavCount = (s: FavoritesState) => s.items.length
