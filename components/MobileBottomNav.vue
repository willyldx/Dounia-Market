<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[90] lg:hidden pb-safe">
    <div class="flex items-center justify-between px-2 h-16">
      <!-- Accueil -->
      <NuxtLink to="/" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 hover:text-[var(--color-accent)] nav-item">
        <Home class="w-6 h-6 nav-icon" :class="{ 'text-[var(--color-primary)] fill-[var(--color-primary)]': route.path === '/' }" />
        <span class="text-[10px] font-medium" :class="{ 'text-[var(--color-primary)] font-bold': route.path === '/' }">Accueil</span>
      </NuxtLink>

      <!-- Catégories (Menu Sidebar) -->
      <button @click="emit('openSidebar')" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 hover:text-[var(--color-accent)] nav-item">
        <LayoutList class="w-6 h-6 nav-icon" />
        <span class="text-[10px] font-medium">Explorer</span>
      </button>

      <!-- Panier (avec nombre dynamique) -->
      <button @click="cartStore.toggleCart" class="flex-1 relative flex flex-col items-center justify-center gap-1 h-full text-gray-500 hover:text-[var(--color-accent)] nav-item group">
        <div class="relative">
          <ShoppingBag class="w-6 h-6 nav-icon" />
          <ClientOnly>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {{ cartStore.itemCount }}
            </span>
          </ClientOnly>
        </div>
        <span class="text-[10px] font-medium">Panier</span>
      </button>

      <!-- Compte -->
      <NuxtLink to="/compte" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-500 hover:text-[var(--color-accent)] nav-item">
        <User class="w-6 h-6 nav-icon" :class="{ 'text-[var(--color-primary)] fill-[var(--color-primary)]': route.path.startsWith('/compte') }" />
        <span class="text-[10px] font-medium" :class="{ 'text-[var(--color-primary)] font-bold': route.path.startsWith('/compte') }">
          {{ authStore.isAuthenticated ? 'Compte' : 'Connexion' }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Home, LayoutList, ShoppingBag, User } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const emit = defineEmits<{
  (e: 'openSidebar'): void
}>()
</script>

<style scoped>
/* iOS Safe area padding for bottom notch */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  transition: color 0.2s ease;
}

.nav-icon {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item:active .nav-icon {
  transform: scale(0.85);
}
</style>
