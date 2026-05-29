import { create } from 'zustand'
import type { Address, AuthUser, UserRole } from '@/lib/types'
import { getClientToken, setClientToken } from '@/lib/api'
import {
  fetchUser,
  login as loginReq,
  logoutRequest,
  parseUser,
  patchUser,
  saveAddresses as saveAddrReq,
  sendOtp as sendOtpReq,
  verifyOtp as verifyOtpReq,
} from '@/lib/auth'

type Status = 'idle' | 'loading' | 'authenticated' | 'guest'

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: Status
  error: string | null
  role: () => UserRole
  checkSession: () => Promise<void>
  sendOtp: (email: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (
    email: string,
    code: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
  ) => Promise<{ success: boolean; role?: UserRole; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>
  logout: () => Promise<void>
  updateProfile: (u: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'phone'>>) => Promise<{ success: boolean; error?: string }>
  saveAddresses: (addresses: Address[]) => Promise<{ success: boolean }>
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: 'idle',
  error: null,

  role: () => get().user?.role ?? 'client',

  checkSession: async () => {
    if (get().status === 'authenticated' || get().status === 'loading') return
    const token = getClientToken()
    if (!token) {
      set({ status: 'guest' })
      return
    }
    set({ status: 'loading', token })
    try {
      const { user } = await fetchUser(token)
      if (user) set({ user: parseUser(user), status: 'authenticated' })
      else {
        setClientToken(null)
        set({ user: null, token: null, status: 'guest' })
      }
    } catch {
      setClientToken(null)
      set({ user: null, token: null, status: 'guest' })
    }
  },

  sendOtp: async (email, firstName, lastName) => {
    set({ error: null })
    try {
      await sendOtpReq(email, firstName, lastName)
      return { success: true }
    } catch (e: any) {
      set({ error: e.message })
      return { success: false, error: e.message }
    }
  },

  verifyOtp: async (email, code, firstName, lastName, phone) => {
    set({ error: null })
    try {
      const res = await verifyOtpReq(email, code, firstName, lastName, phone)
      if (res.token && res.user) {
        setClientToken(res.token)
        const user = parseUser(res.user)
        set({ user, token: res.token, status: 'authenticated' })
        return { success: true, role: user.role }
      }
      return { success: false, error: 'Réponse inattendue du serveur' }
    } catch (e: any) {
      set({ error: e.message })
      return { success: false, error: e.message }
    }
  },

  login: async (email, password) => {
    set({ error: null })
    try {
      const res = await loginReq(email, password)
      if (res.token && res.user) {
        setClientToken(res.token)
        const user = parseUser(res.user)
        set({ user, token: res.token, status: 'authenticated' })
        return { success: true, role: user.role }
      }
      return { success: false, error: 'Réponse inattendue du serveur' }
    } catch (e: any) {
      set({ error: e.message })
      return { success: false, error: e.message }
    }
  },

  logout: async () => {
    const token = get().token
    if (token) await logoutRequest(token)
    setClientToken(null)
    set({ user: null, token: null, status: 'guest' })
  },

  updateProfile: async (updates) => {
    const { token, user } = get()
    if (!token || !user) return { success: false, error: 'Non connecté' }
    try {
      const res = await patchUser(token, {
        first_name: updates.firstName ?? user.firstName,
        last_name: updates.lastName ?? user.lastName,
        phone: updates.phone ?? user.phone,
      })
      if (res.user) {
        set({ user: parseUser(res.user) })
        return { success: true }
      }
      return { success: false, error: 'Réponse inattendue' }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  },

  saveAddresses: async (addresses) => {
    const { token } = get()
    if (!token) return { success: false }
    try {
      const res = await saveAddrReq(token, addresses)
      if (res.user) set({ user: parseUser(res.user) })
      return { success: true }
    } catch {
      return { success: false }
    }
  },
}))
