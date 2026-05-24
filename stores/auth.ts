import { defineStore } from 'pinia'
import type { UserRole, Address } from '~/types'

interface AuthUser {
  id: string | number
  name: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  addresses: Address[]
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  sessionChecked: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    sessionChecked: false,
  }),

  getters: {
    fullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName || ''}`.trim()
    },

    initials: (state): string => {
      if (!state.user) return '?'
      const first = state.user.firstName?.[0] || ''
      const last = state.user.lastName?.[0] || ''
      return (first + last).toUpperCase() || '?'
    },

    userRole: (state): UserRole => {
      return (state.user?.role as UserRole) || 'client'
    },

    isClient(): boolean {
      return this.userRole === 'client'
    },

    isLivreur(): boolean {
      return this.userRole === 'livreur'
    },

    isAdmin(): boolean {
      return this.userRole === 'admin' || this.userRole === 'super_admin'
    },

    isSuperAdmin(): boolean {
      return this.userRole === 'super_admin'
    },

    canAccessAdmin(): boolean {
      return ['admin', 'super_admin'].includes(this.userRole)
    },

    canAccessLivreur(): boolean {
      return ['livreur', 'admin', 'super_admin'].includes(this.userRole)
    },
  },

  actions: {
    // =============================================
    // INTERNAL HELPERS
    // =============================================
    _getApiUrl(): string {
      const config = useRuntimeConfig()
      return config.public.apiUrl
    },

    _getHeaders(): Record<string, string> {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }
      return headers
    },

    _parseUser(apiUser: any): AuthUser {
      const nameParts = (apiUser.name || '').split(' ')
      return {
        id: apiUser.id,
        name: apiUser.name || '',
        email: apiUser.email || '',
        firstName: apiUser.first_name || nameParts[0] || '',
        lastName: apiUser.last_name || nameParts.slice(1).join(' ') || '',
        phone: apiUser.phone || '',
        role: apiUser.role || 'client',
        addresses: apiUser.addresses || [],
        createdAt: apiUser.created_at || new Date().toISOString(),
      }
    },

    _persistToken(token: string) {
      this.token = token
      const authCookie = useCookie('tchadbox_auth_token', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: !import.meta.dev,
      })
      authCookie.value = token
    },

    _clearSession(existingCookie?: any) {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (existingCookie) {
         existingCookie.value = null
      } else {
         try {
           const authCookie = useCookie('tchadbox_auth_token', {
             path: '/',
             sameSite: 'lax',
             secure: !import.meta.dev,
           })
           authCookie.value = null
         } catch(e) {}
      }
    },

    // =============================================
    // SESSION CHECK (on app mount)
    // =============================================
    async checkSession() {
      if (this.sessionChecked) return
      this.sessionChecked = true

      // Lisez le jeton depuis les cookies (fonctionne SSR et CSR)
      const authCookie = useCookie('tchadbox_auth_token', {
        path: '/',
        sameSite: 'lax',
        secure: !import.meta.dev,
      })
      const savedToken = authCookie.value
      
      if (!savedToken) return

      this.token = savedToken

      try {
        const response: any = await $fetch(`${this._getApiUrl()}/user`, {
          headers: this._getHeaders(),
        })

        if (response.user) {
          this.user = this._parseUser(response.user)
          this.isAuthenticated = true
        } else {
          this._clearSession(authCookie)
        }
      } catch (e) {
        // Token expired or invalid
        this._clearSession(authCookie)
      }
    },

    // =============================================
    // OTP LOGIN (Passwordless — for Clients)
    // =============================================

    /**
     * Step 1: Request OTP code to be sent to email via Resend
     */
    async sendOtp(email: string, firstName?: string, lastName?: string) {
      this.isLoading = true
      this.error = null

      try {
        const response: any = await $fetch(`${this._getApiUrl()}/auth/send-otp`, {
          method: 'POST',
          headers: this._getHeaders(),
          body: { email, first_name: firstName, last_name: lastName },
        })

        return {
          success: true,
          isNewUser: response.is_new_user,
          message: response.message,
        }
      } catch (error: any) {
        const msg = error.data?.message || error.data?.errors?.email?.[0] || 'Erreur lors de l\'envoi du code'
        this.error = msg
        return { success: false, error: msg }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Step 2: Verify the OTP code and get authenticated
     */
    async verifyOtp(email: string, code: string, firstName?: string, lastName?: string, phone?: string) {
      this.isLoading = true
      this.error = null

      try {
        const response: any = await $fetch(`${this._getApiUrl()}/auth/verify-otp`, {
          method: 'POST',
          headers: this._getHeaders(),
          body: { email, code, first_name: firstName, last_name: lastName, phone },
        })

        if (response.token && response.user) {
          this._persistToken(response.token)
          this.user = this._parseUser(response.user)
          this.isAuthenticated = true
          return { success: true, role: this.userRole }
        }

        this.error = 'Réponse inattendue du serveur'
        return { success: false, error: this.error }
      } catch (error: any) {
        const msg = error.data?.message || error.data?.errors?.code?.[0] || 'Code invalide ou expiré'
        this.error = msg
        return { success: false, error: msg }
      } finally {
        this.isLoading = false
      }
    },

    // =============================================
    // PASSWORD LOGIN (for Admin / Livreur)
    // =============================================
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const response: any = await $fetch(`${this._getApiUrl()}/auth/login`, {
          method: 'POST',
          headers: this._getHeaders(),
          body: { email, password },
        })

        if (response.token && response.user) {
          this._persistToken(response.token)
          this.user = this._parseUser(response.user)
          this.isAuthenticated = true
          return { success: true, role: this.userRole }
        }

        this.error = 'Réponse inattendue du serveur'
        return { success: false, error: this.error }
      } catch (error: any) {
        const msg = error.data?.message || error.data?.errors?.email?.[0] || 'Erreur de connexion'
        this.error = msg
        return { success: false, error: msg }
      } finally {
        this.isLoading = false
      }
    },

    // =============================================
    // LOGOUT
    // =============================================
    async logout() {
      try {
        if (this.token) {
          await $fetch(`${this._getApiUrl()}/auth/logout`, {
            method: 'POST',
            headers: this._getHeaders(),
          }).catch(() => {})
        }
      } finally {
        this._clearSession()

        const cartStore = useCartStore()
        if (cartStore && typeof cartStore.clearCart === 'function') {
          cartStore.clearCart()
        }

        navigateTo('/')
      }
    },

    // =============================================
    // PROFILE UPDATE
    // =============================================
    async updateProfile(updates: Partial<{ firstName: string; lastName: string; phone: string }>) {
      if (!this.user || !this.token) return { success: false, error: 'Non connecté' }

      try {
        const payload = {
          first_name: updates.firstName ?? this.user.firstName,
          last_name: updates.lastName ?? this.user.lastName,
          phone: updates.phone ?? this.user.phone,
        }

        const response: any = await $fetch(`${this._getApiUrl()}/user`, {
          method: 'PATCH',
          headers: this._getHeaders(),
          body: payload,
        })

        if (response.user) {
          this.user = this._parseUser(response.user)
          return { success: true }
        }

        return { success: false, error: 'Réponse inattendue' }
      } catch (error: any) {
        return { success: false, error: error.data?.message || 'Erreur lors de la mise à jour' }
      }
    },

    // =============================================
    // ADDRESSES
    // =============================================
    async addAddress(address: Partial<Address>) {
      if (!this.user || !this.token) return { success: false }
      
      const newAddress = {
        ...address,
        id: Math.random().toString(36).substring(2, 9),
      }
      
      let newAddresses = [...(this.user.addresses || [])]
      
      if (address.isDefault || newAddresses.length === 0) {
        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }))
        newAddress.isDefault = true
      }
      
      newAddresses.push(newAddress as Address)
      return this._saveAddresses(newAddresses)
    },

    async updateAddress(addressId: string, updates: Partial<Address>) {
      if (!this.user || !this.token) return { success: false }
      
      let newAddresses = [...(this.user.addresses || [])]
      
      if (updates.isDefault) {
        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }))
      }
      
      const index = newAddresses.findIndex(a => a.id === addressId)
      if (index !== -1) {
        newAddresses[index] = { ...newAddresses[index], ...updates }
        return this._saveAddresses(newAddresses)
      }
      
      return { success: false }
    },

    async deleteAddress(addressId: string) {
      if (!this.user || !this.token) return { success: false }
      
      const newAddresses = (this.user.addresses || []).filter(a => a.id !== addressId)
      
      // If we deleted the default, set the first remaining as default
      if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
        newAddresses[0].isDefault = true
      }
      
      return this._saveAddresses(newAddresses)
    },

    async _saveAddresses(addresses: Address[]) {
      try {
        const response: any = await $fetch(`${this._getApiUrl()}/user`, {
          method: 'PATCH',
          headers: this._getHeaders(),
          body: { addresses },
        })

        if (response.user) {
          this.user = this._parseUser(response.user)
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        return { success: false }
      }
    },

    // =============================================
    // HELPERS
    // =============================================
    clearError() {
      this.error = null
    },

    getRedirectPath(): string {
      if (!this.user) return '/'

      switch (this.userRole) {
        case 'super_admin':
        case 'admin':
          return '/admin'
        case 'livreur':
          return '/livreur'
        default:
          return '/compte'
      }
    },
  },
})
