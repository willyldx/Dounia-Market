<template>
  <nav class="fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-[90] lg:hidden rounded-2xl overflow-hidden ring-1 ring-black/5">
    <div class="flex items-center justify-between px-2 h-16">
      <!-- Accueil -->
      <NuxtLink to="/" class="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors nav-item" :class="route.path === '/' ? 'text-gray-900' : 'text-gray-400'">
        <Home class="w-5 h-5 nav-icon" :class="{ 'fill-gray-900': route.path === '/' }" />
        <span class="text-[9px] font-black uppercase tracking-widest">Accueil</span>
      </NuxtLink>
 
      <!-- Catégories (Menu Sidebar) -->
      <button @click="emit('openSidebar')" class="flex-1 flex flex-col items-center justify-center gap-1 h-full text-gray-400 transition-colors nav-item">
        <LayoutList class="w-5 h-5 nav-icon" />
        <span class="text-[9px] font-black uppercase tracking-widest">Menu</span>
      </button>
 
      <!-- Panier (avec nombre dynamique) -->
      <button @click="cartStore.toggleCart" class="flex-1 relative flex flex-col items-center justify-center gap-1 h-full text-gray-400 transition-colors nav-item group">
        <div class="relative">
          <ShoppingBag class="w-5 h-5 nav-icon" />
          <ClientOnly>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-gray-900 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-scale-in">
              {{ cartStore.itemCount }}
            </span>
          </ClientOnly>
        </div>
        <span class="text-[9px] font-black uppercase tracking-widest">Panier</span>
      </button>
 
      <!-- Compte -->
      <NuxtLink to="/compte" class="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors nav-item" :class="route.path.startsWith('/compte') ? 'text-gray-900' : 'text-gray-400'">
        <User class="w-5 h-5 nav-icon" :class="{ 'fill-gray-900': route.path.startsWith('/compte') }" />
        <span class="text-[9px] font-black uppercase tracking-widest">
          {{ authStore.isAuthenticated ? 'Compte' : 'Login' }}
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
