import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppNotification } from '@/lib/types'
import { fetchNotifications } from '@/lib/notifications'

const REFRESH_TTL_MS = 60_000
const MAX_READ_IDS = 300

interface NotificationsState {
  items: AppNotification[]
  readIds: string[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  lastFetched: number | null
  refresh: (token: string, force?: boolean) => Promise<void>
  markRead: (id: string) => void
  markAllRead: () => void
  reset: () => void
}

export const useNotifications = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      readIds: [],
      status: 'idle',
      lastFetched: null,

      refresh: async (token, force = false) => {
        const { status, lastFetched } = get()
        if (status === 'loading') return
        if (!force && lastFetched && Date.now() - lastFetched < REFRESH_TTL_MS) return
        set({ status: 'loading' })
        try {
          const items = await fetchNotifications(token)
          set({ items, status: 'ready', lastFetched: Date.now() })
        } catch {
          set({ status: 'error' })
        }
      },

      markRead: (id) => {
        const { readIds } = get()
        if (readIds.includes(id)) return
        set({ readIds: [...readIds, id].slice(-MAX_READ_IDS) })
      },

      markAllRead: () => {
        const ids = get().items.map((i) => i.id)
        const merged = Array.from(new Set([...get().readIds, ...ids]))
        set({ readIds: merged.slice(-MAX_READ_IDS) })
      },

      reset: () => set({ items: [], status: 'idle', lastFetched: null }),
    }),
    {
      name: 'dounia_market_notifications',
      partialize: (s) => ({ readIds: s.readIds }),
    },
  ),
)

export const selectUnreadCount = (s: NotificationsState) =>
  s.items.filter((i) => !s.readIds.includes(i.id)).length
