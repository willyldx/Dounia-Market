// Auth plugin - restores the current user session on app load.
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  if (import.meta.client) {
    await authStore.checkSession()
  }
})
