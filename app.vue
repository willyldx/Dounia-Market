<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtLoadingIndicator color="#f59e0b" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <CartDrawer />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()


onMounted(async () => {
  // 1. Initialiser le panier d'abord pour l'UI
  cartStore.loadFromStorage()
  
  // 2. Charger les taux en temps réel pour corriger les prix
  await cartStore.fetchRates()
  
  // 3. Charger les favoris
  favoritesStore.initialize()
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | TchadBox` : 'TchadBox - Envoyez des cadeaux au Tchad'
  }
})
</script>
