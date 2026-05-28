<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold text-foreground tracking-tight">Mon compte</h1>
          <p class="text-muted-foreground font-medium mt-2">Commandes et adresses de livraison pour <span class="font-bold text-foreground">{{ authStore.fullName || 'vous' }}</span></p>
        </div>
      </div>

      <div class="grid xl:grid-cols-4 gap-8">
        <div class="xl:col-span-1">
          <nav class="bg-card rounded-lg overflow-hidden shadow-sm border border-border sticky top-32">
            <div class="p-6 border-b border-border bg-muted/30">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-foreground font-bold shadow-sm">
                  {{ authStore.initials }}
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-foreground truncate text-lg tracking-tight">{{ authStore.fullName }}</p>
                  <p class="text-xs font-medium text-muted-foreground truncate mt-0.5">{{ authStore.user?.email }}</p>
                </div>
              </div>
            </div>
            
            <ul class="p-3 space-y-1">
              <li v-for="item in navItems" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="flex items-center gap-3 px-5 py-4 rounded-md text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-all group"
                  :class="{ 'bg-muted !text-foreground font-bold shadow-sm': $route.path === item.to }"
                >
                  <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" :class="{ 'text-foreground': $route.path === item.to }" />
                  <span>{{ item.label }}</span>
                  <span v-if="item.badge" class="ml-auto bg-brand/10 text-brand border border-brand/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {{ item.badge }}
                  </span>
                </NuxtLink>
              </li>
            </ul>

            <div class="p-3 border-t border-border/50">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-5 py-4 rounded-md text-muted-foreground/80 font-medium hover:bg-red-500/10 hover:text-red-500 transition-all group"
              >
                <LogOutIcon class="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>

        <div class="xl:col-span-3 space-y-6">
          <div class="grid sm:grid-cols-3 gap-4">
            <div class="bg-card rounded-lg shadow-sm border border-border p-6 transition-colors">
              <div class="flex items-center justify-between mb-6">
                <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <PackageIcon class="w-4 h-4 text-foreground" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">Activité</span>
              </div>
              <p class="text-3xl font-bold text-foreground tracking-tighter">{{ stats.totalOrders }}</p>
              <p class="text-sm text-muted-foreground mt-1">Commandes totales</p>
            </div>

            <div class="bg-card rounded-lg shadow-sm border border-border p-6 transition-colors">
              <div class="flex items-center justify-between mb-6">
                <div class="relative w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <div v-if="stats.inProgress > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-card animate-ping"></div>
                  <div v-if="stats.inProgress > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-card"></div>
                  <TruckIcon class="w-4 h-4 text-foreground" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">En cours</span>
              </div>
              <p class="text-3xl font-bold text-foreground tracking-tighter">{{ stats.inProgress }}</p>
              <p class="text-sm text-muted-foreground mt-1">Livraisons en cours</p>
            </div>

            <div class="bg-card rounded-lg shadow-sm border border-border p-6 transition-colors">
              <div class="flex items-center justify-between mb-6">
                <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/20">Livrés</span>
              </div>
              <p class="text-3xl font-bold text-foreground tracking-tighter">{{ stats.delivered }}</p>
              <p class="text-sm text-muted-foreground mt-1">Commandes livrées</p>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <NuxtLink
              to="/catalogue"
              class="bg-brand text-brand-foreground rounded-lg p-6 shadow-sm group hover:bg-brand/90 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-bold text-xl mb-1 tracking-tight">Choisir des produits</h3>
                  <p class="text-brand-foreground/80 text-sm leading-relaxed max-w-[230px]">Produits disponibles localement pour vos proches.</p>
                </div>
                <div class="w-10 h-10 bg-brand-foreground/10 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusIcon class="w-5 h-5" />
                </div>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/suivi"
              class="bg-card rounded-lg p-6 border border-border group hover:bg-muted/50 shadow-sm transition-colors"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-bold text-xl text-foreground mb-1 tracking-tight">Suivre une commande</h3>
                  <p class="text-muted-foreground text-sm leading-relaxed max-w-[230px]">Consultez son avancement avec sa référence.</p>
                </div>
                <div class="w-10 h-10 bg-muted rounded-full border border-border flex items-center justify-center group-hover:bg-background transition-colors">
                  <SearchIcon class="w-4 h-4 text-foreground" />
                </div>
              </div>
            </NuxtLink>
          </div>

          <div class="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div class="flex items-center justify-between p-8 border-b border-border/50">
              <h2 class="text-xl font-bold text-foreground tracking-tight">Commandes récentes</h2>
              <NuxtLink 
                to="/compte/commandes" 
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Voir tout
                <ChevronRightIcon class="w-4 h-4" />
              </NuxtLink>
            </div>

            <div v-if="recentOrders.length === 0" class="p-16 text-center">
              <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageIcon class="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 class="font-bold text-xl text-foreground mb-2">Aucune commande</h3>
              <p class="text-muted-foreground mb-8">Vos prochaines commandes apparaîtront ici.</p>
              <NuxtLink to="/catalogue" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2">
                <ShoppingBagIcon class="w-4 h-4 mr-2" /> Visiter la boutique
              </NuxtLink>
            </div>

            <div v-else class="divide-y divide-border/50">
              <NuxtLink
                v-for="order in recentOrders"
                :key="order.id"
                :to="`/compte/commandes/${order.id}`"
                class="flex flex-col sm:flex-row sm:items-center gap-5 p-6 hover:bg-muted/50 transition-colors group"
              >
                <div class="flex items-center gap-5 flex-1 min-w-0">
                   <div class="w-16 h-16 bg-card border border-border shadow-sm rounded-lg flex items-center justify-center shrink-0">
                     <img 
                       v-if="order.items[0]?.thumbnail" 
                       :src="order.items[0].thumbnail" 
                       :alt="order.items[0].title"
                       class="w-10 h-10 object-contain mix-blend-multiply"
                     />
                     <PackageIcon v-else class="w-6 h-6 text-muted-foreground/40" />
                   </div>
                   <div class="min-w-0 pr-4">
                     <p class="font-bold text-foreground tracking-tight">{{ order.displayId }}</p>
                     <p class="text-sm font-medium text-muted-foreground truncate mt-0.5">
                       {{ formatDate(order.createdAt) }} • {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}
                     </p>
                   </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-6 sm:w-auto mt-4 sm:mt-0 pl-[5.25rem] sm:pl-0">
                  <span 
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shrink-0"
                    :class="getStatusClass(order.fulfillmentStatus)"
                  >
                    {{ getStatusLabel(order.fulfillmentStatus) }}
                  </span>
                  
                  <div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground/50 group-hover:text-foreground group-hover:border-border/80 transition-all shrink-0 hidden sm:flex">
                     <ChevronRightIcon class="w-4 h-4" />
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <div class="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div class="flex items-center justify-between p-8 border-b border-border/50">
              <h2 class="text-xl font-bold text-foreground tracking-tight">Adresses enregistrées</h2>
              <NuxtLink 
                to="/compte/adresses" 
                class="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Gérer
                <ChevronRightIcon class="w-4 h-4" />
              </NuxtLink>
            </div>

            <div v-if="!authStore.hasAddresses" class="p-12 text-center">
              <MapPinIcon class="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p class="text-muted-foreground font-medium mb-6">Ajoutez l'adresse d'un proche à N'Djamena pour préparer une livraison locale.</p>
              <NuxtLink
                to="/compte/adresses"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground font-bold rounded-md hover:bg-muted/80 transition-colors"
              >
                <PlusIcon class="w-4 h-4" /> Ajouter un destinataire
              </NuxtLink>
            </div>

            <div v-else class="p-8">
              <div v-if="authStore.defaultAddress" class="flex items-start gap-5">
                <div class="w-12 h-12 bg-muted border border-border rounded-lg flex items-center justify-center shrink-0">
                  <MapPinIcon class="w-5 h-5 text-foreground" />
                </div>
                <div class="flex-1 bg-muted/50 rounded-lg p-6 border border-border">
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <p class="font-bold text-foreground text-lg">
                      {{ authStore.defaultAddress.firstName }} {{ authStore.defaultAddress.lastName }}
                    </p>
                    <span class="text-[10px] font-bold tracking-widest uppercase bg-brand/10 text-brand px-2.5 py-1 rounded-md border border-brand/20">Principal</span>
                  </div>
                  <p class="text-sm font-medium text-muted-foreground leading-relaxed">
                    {{ authStore.defaultAddress.address1 }}<br />
                    <span class="text-foreground font-bold">{{ authStore.defaultAddress.city }}, {{ authStore.defaultAddress.country }}</span>
                  </p>
                  <p v-if="authStore.defaultAddress.phone" class="text-sm font-bold text-muted-foreground/80 font-mono tracking-widest mt-4">
                    {{ authStore.defaultAddress.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Package as PackageIcon,
  Truck as TruckIcon,
  CheckCircle as CheckCircleIcon,
  ChevronRight as ChevronRightIcon,
  ShoppingBag as ShoppingBagIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  MapPin as MapPinIcon,
  User as UserIcon,
  Heart as HeartIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next'
import type { Order, FulfillmentStatus } from '~/types'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Mon espace | Dounia Market Tchad',
  robots: 'noindex, nofollow, noarchive',
  description: 'Gérez vos commandes et votre profil depuis votre espace privé.',
})

const authStore = useAuthStore()

const navItems = [
  { to: '/compte', label: 'Vue d\'ensemble', icon: PackageIcon },
  { to: '/compte/commandes', label: 'Mes commandes', icon: ShoppingBagIcon, badge: null },
  { to: '/compte/profil', label: 'Mon profil', icon: UserIcon },
  { to: '/compte/adresses', label: 'Mes adresses', icon: MapPinIcon },
  { to: '/favoris', label: 'Mes favoris', icon: HeartIcon },
]

// Stats
const stats = reactive({
  totalOrders: 0,
  inProgress: 0,
  delivered: 0,
})

// Recent orders
const recentOrders = ref<Order[]>([])

onMounted(async () => {
  await fetchDashboardData()
})

async function fetchDashboardData() {
  if (!authStore.user) return

  try {
    const response = await useBackendApi().userOrders()
    const orders = response?.data || []
    
    const mappedOrders = orders.map(transformOrder)
    
    recentOrders.value = mappedOrders.slice(0, 5)
    
    stats.totalOrders = mappedOrders.length
    stats.inProgress = mappedOrders.filter(o => ['shipped', 'partially_fulfilled', 'fulfilled'].includes(o.fulfillmentStatus)).length
    stats.delivered = mappedOrders.filter(o => o.fulfillmentStatus === 'delivered').length
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

const { normalizeOrder: transformOrder } = useOrderNormalizer()

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusLabel(status: FulfillmentStatus): string {
  const labels: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'Préparation',
    partially_fulfilled: 'Partiel',
    fulfilled: 'Prête',
    shipped: 'En livraison',
    delivered: 'Livré',
  }
  return labels[status] || status
}

function getStatusClass(status: FulfillmentStatus): string {
  const classes: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'bg-gray-100 text-gray-500 border-gray-200',
    partially_fulfilled: 'bg-blue-50 text-blue-600 border-blue-100',
    fulfilled: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    shipped: 'bg-orange-50 text-orange-600 border-orange-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-500 border-gray-200'
}

async function handleLogout() {
  await authStore.logout()
}
</script>
