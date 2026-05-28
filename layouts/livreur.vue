<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/livreur" class="flex items-center gap-2">
            <img src="/logo-full.svg" alt="Dounia Market Tchad" class="h-8 w-auto" />
            <div>
              <span class="font-bold text-stone-800">Dounia Market Tchad</span>
              <span class="block text-xs text-gold-700 font-medium">Livreur</span>
            </div>
          </NuxtLink>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Status Toggle -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-stone-500">{{ isOnline ? 'En ligne' : 'Hors ligne' }}</span>
            <UToggle v-model="isOnline" color="green" />
          </div>
          
          <!-- User Menu -->
          <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
            <div class="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center cursor-pointer">
              <span class="text-sm font-semibold text-gold-800">{{ authStore.initials }}</span>
            </div>
          </UDropdown>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16 pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-stone-200 safe-area-bottom">
      <div class="flex items-center justify-around py-2">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.to"
          :to="item.to"
          :class="[
            'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
            isActive(item.to) ? 'text-gold-600' : 'text-stone-400'
          ]"
        >
          <Icon :name="item.icon" class="w-6 h-6" />
          <span class="text-xs font-medium">{{ item.label }}</span>
          <span v-if="item.badge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ item.badge }}
          </span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const isOnline = ref(true)

const navItems = computed(() => [
  { to: '/livreur', label: 'Livraisons', icon: 'lucide:package' },
  { to: '/livreur/historique', label: 'Historique', icon: 'lucide:history' },
  { to: '/livreur/profil', label: 'Profil', icon: 'lucide:user' }
])

const userMenuItems = [
  [{
    label: 'Mon profil',
    icon: 'i-lucide-user',
    click: () => navigateTo('/livreur/profil')
  }],
  [{
    label: 'Déconnexion',
    icon: 'i-lucide-log-out',
    click: () => authStore.logout()
  }]
]

const isActive = (path: string) => {
  if (path === '/livreur') {
    return route.path === '/livreur'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
