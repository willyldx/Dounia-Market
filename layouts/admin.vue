<template>
  <div class="min-h-screen bg-[#f5f6f2] text-zinc-900">
    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button aria-label="Ouvrir la navigation" @click="sidebarOpen = true" class="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-zinc-100">
          <Icon name="lucide:menu" class="w-5 h-5" />
        </button>
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <img src="/logo-full.svg" alt="Dounia Market" class="h-7 w-auto" />
          <span class="hidden min-[380px]:inline text-xs font-semibold uppercase text-emerald-700">Gestion</span>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <UButton color="gray" variant="ghost" class="p-2">
            <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <span class="text-sm font-semibold text-emerald-800">{{ authStore.initials }}</span>
            </div>
          </UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="sidebarOpen" class="lg:hidden fixed inset-0 z-50 bg-zinc-950/45" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar — Dark theme -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-[272px] bg-[#15251f] transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center justify-between px-5 border-b border-white/10">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/favicon.svg" alt="" class="w-7 h-7" />
          </div>
          <div>
            <span class="font-semibold text-white">Dounia Market</span>
            <span class="block text-xs text-emerald-300 font-medium">Gestion</span>
          </div>
        </NuxtLink>
        <button @click="sidebarOpen = false" class="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/60">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-6 px-3">
        <p class="px-3 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wide">
          Opérations
        </p>
        <div class="space-y-1">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'bg-white/10 text-white'
                : 'text-white/65 hover:bg-white/5 hover:text-white'
            ]"
            @click="sidebarOpen = false"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
            <span v-if="item.badge" class="ml-auto min-w-5 rounded-full bg-amber-400 px-1.5 py-0.5 text-center text-xs font-semibold text-zinc-950">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>

        <!-- Super Admin Section -->
        <div v-if="authStore.isSuperAdmin" class="mt-8">
          <p class="px-3 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wide">
            Direction
          </p>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in superAdminItems"
              :key="item.to"
              :to="item.to"
              :class="[
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive(item.to)
                  ? 'bg-white/10 text-white'
                  : 'text-white/65 hover:bg-white/5 hover:text-white'
              ]"
              @click="sidebarOpen = false"
            >
              <Icon :name="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Quick link to front -->
        <div class="mt-8 px-3">
          <a href="/" target="_blank" class="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Icon name="lucide:external-link" class="w-4 h-4" />
            Ouvrir la boutique
          </a>
        </div>
      </nav>

      <!-- User section -->
      <div class="border-t border-white/10 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
            <span class="text-sm font-semibold text-white">{{ authStore.initials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ authStore.fullName }}</p>
            <p class="text-xs text-white/40 truncate">{{ roleLabel }}</p>
          </div>
          <UDropdown :items="userMenuItems" :popper="{ placement: 'top-end' }">
            <UButton color="gray" variant="ghost" icon="i-lucide-more-vertical" size="sm" class="text-white/40 hover:text-white" />
          </UDropdown>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="lg:pl-[272px] pt-16 lg:pt-0">
      <div class="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const sidebarOpen = ref(false)

// Navigation items for all admins
const navigationItems = computed(() => [
  { to: '/admin', label: "Vue d'ensemble", icon: 'lucide:layout-dashboard' },
  { to: '/admin/commandes', label: 'Commandes', icon: 'lucide:package', badge: pendingOrdersCount.value || null },
  { to: '/admin/stocks', label: 'Stocks', icon: 'lucide:warehouse' },
  { to: '/admin/livreurs', label: 'Livreurs', icon: 'lucide:truck' },
  { to: '/admin/clients', label: 'Clients', icon: 'lucide:users' },
])

// Super admin only items
const superAdminItems = [
  { to: '/admin/equipe', label: 'Équipe', icon: 'lucide:user-cog' },
  { to: '/admin/finances', label: 'Finances', icon: 'lucide:wallet' },
]

// User menu
const userMenuItems = [
  [{
    label: 'Mon profil',
    icon: 'i-lucide-user',
    click: () => navigateTo('/compte/profil')
  }],
  [{
    label: 'Voir le site',
    icon: 'i-lucide-external-link',
    click: () => window.open('/', '_blank')
  }],
  [{
    label: 'Déconnexion',
    icon: 'i-lucide-log-out',
    click: () => authStore.logout()
  }]
]

// Role label
const roleLabel = computed(() => {
  const roles: Record<string, string> = {
    super_admin: 'Direction',
    admin: 'Administrateur',
    livreur: 'Livreur',
    client: 'Client'
  }
  return roles[authStore.userRole] || 'Utilisateur'
})

// Check if route is active
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

// Pending orders count (to be implemented)
const pendingOrdersCount = ref(0)

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>
