// Auth plugin — restores user session on app load
// Initializes Sanctum token-based auth.
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  if (import.meta.client) {
    // Migration: Migrate users from localStorage to Cookie
    const savedToken = localStorage.getItem('tchadbox_auth_token')
    if (savedToken) {
      const authCookie = useCookie('tchadbox_auth_token', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: !import.meta.dev,
      })
      if (!authCookie.value) authCookie.value = savedToken
      localStorage.removeItem('tchadbox_auth_token')
    }

    // Restore session
    await authStore.checkSession()
  }
})
