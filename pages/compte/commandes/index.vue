<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Conciergerie</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">Historique</span>
      </nav>

      <!-- Premium Header -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 border-b border-border pb-8">
        <div>
          <h1 class="text-4xl font-black text-foreground tracking-tight">Registre Logistique</h1>
          <p class="text-muted-foreground font-medium mt-2">Suivi complet de vos {{ orders.length }} expéditions.</p>
        </div>

         <div class="relative">
           <select
             v-model="statusFilter"
             class="appearance-none w-full sm:w-64 px-6 py-4 bg-card border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm cursor-pointer"
           >
             <option value="all">Tous les statuts</option>
             <option value="pending">En préparation</option>
             <option value="shipped">En transit / Logistique</option>
             <option value="delivered">Dossiers clos (Livrés)</option>
           </select>
           <ChevronDownIcon class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
         </div>
      </div>

      <!-- Orders List -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-card rounded-[2rem] border border-border p-8 shadow-sm animate-pulse glass-strong">
          <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="w-24 h-24 bg-muted rounded-2xl shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-muted rounded-md w-1/3"></div>
              <div class="h-3 bg-muted/50 rounded-md w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="bg-card rounded-[2rem] shadow-premium-lg p-16 text-center max-w-3xl mx-auto mt-10 border border-border glass-strong">
        <div class="relative mb-8 group mx-auto w-max">
           <div class="absolute inset-0 bg-muted rounded-full scale-150 opacity-50 blur-2xl"></div>
           <div class="w-28 h-28 rounded-full border border-border bg-card shadow-sm flex items-center justify-center relative z-10">
             <PackageIcon class="w-10 h-10 text-muted-foreground/30" />
           </div>
        </div>
        <h3 class="text-3xl font-black text-foreground mb-3 tracking-tight">
          {{ statusFilter === 'all' ? 'Aucune opération' : 'Filtre vide' }}
        </h3>
        <p class="text-muted-foreground font-medium mb-12 max-w-sm mx-auto leading-relaxed">
          {{ statusFilter === 'all' ? "Aucun colis n'a encore été confié à notre équipe de logistique." : "Aucune commande ne correspond au statut recherché." }}
        </p>
        <NuxtLink
          v-if="statusFilter === 'all'"
          to="/catalogue"
          class="inline-flex items-center justify-center gap-3 px-10 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent"
        >
          <ShoppingBagIcon class="w-5 h-5 opacity-70 text-accent" /> Visiter la boutique
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <NuxtLink
          v-for="order in filteredOrders"
          :key="order.id"
          :to="`/compte/commandes/${order.id}`"
          class="block bg-card rounded-[2rem] border border-border shadow-premium hover:border-border/80 hover:shadow-premium-lg transition-all duration-300 overflow-hidden group glass-strong"
        >
          <!-- Premium Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-8 border-b border-border/50 bg-muted/30">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-card shadow-sm border border-border rounded-2xl flex items-center justify-center shrink-0">
                <PackageIcon class="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p class="font-black text-xl text-foreground tracking-tight">{{ order.displayId }}</p>
                <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mt-1">{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-5">
              <span
                class="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border"
                :class="getStatusClass(order.fulfillmentStatus)"
              >
                {{ getStatusLabel(order.fulfillmentStatus) }}
              </span>
              <div class="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-muted-foreground/80 group-hover:bg-brand group-hover:text-brand-foreground group-hover:border-transparent transition-all shadow-sm">
                <ChevronRightIcon class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- Order Content Preview -->
          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-center gap-8">
              <!-- Collaged Thumbnail Stack -->
              <div class="flex -space-x-4 shrink-0">
                <div
                  v-for="(item, index) in order.items.slice(0, 3)"
                  :key="item.id"
                  class="w-20 h-20 bg-muted/50 rounded-2xl border-4 border-card flex items-center justify-center overflow-hidden shadow-sm"
                  :style="{ zIndex: 3 - index }"
                >
                  <img
                    v-if="item.thumbnail"
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-full h-full object-cover mix-blend-multiply"
                  />
                  <PackageIcon v-else class="w-6 h-6 text-muted-foreground/40" />
                </div>
                <!-- Excess Items count -->
                <div
                  v-if="order.items.length > 3"
                  class="w-20 h-20 bg-brand rounded-2xl border-4 border-card flex items-center justify-center text-sm font-black text-brand-foreground shadow-sm z-0 relative overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-tr from-brand to-brand/80 opacity-50"></div>
                  <span class="relative z-10">+{{ order.items.length - 3 }}</span>
                </div>
              </div>

              <!-- Content Summary -->
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <p class="text-sm font-bold text-foreground capitalize leading-relaxed line-clamp-2 pr-4">
                  {{ order.items.map(i => i.title).join(', ') }}
                </p>
                <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                  Dossier de {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}
                </p>
              </div>

              <!-- Price Box -->
              <div class="md:text-right shrink-0 bg-muted/30 p-4 rounded-xl border border-border">
                <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-1">Total payé</p>
                <p class="text-2xl font-black text-foreground tracking-tight">{{ formatPrice(order.total) }}</p>
              </div>
            </div>

            <!-- Luxury Progress Bar (If shipped/transit) -->
            <div v-if="order.fulfillmentStatus === 'shipped'" class="mt-8 pt-6 border-t border-border/50">
              <div class="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest">
                 <span class="text-accent animate-pulse flex items-center gap-2"><TruckIcon class="w-4 h-4"/> En cours d'acheminement</span>
                 <span class="text-muted-foreground/80">Atterrissage estimé : {{ estimatedDelivery(order.createdAt) }}</span>
              </div>
              <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                <div class="h-full bg-accent rounded-full w-2/3 relative overflow-hidden">
                   <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-14">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="w-12 h-12 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm bg-card"
        >
          <ChevronLeftIcon class="w-5 h-5 text-foreground" />
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          class="w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all text-sm shadow-sm border"
          :class="currentPage === page 
            ? 'bg-brand text-brand-foreground border-brand' 
            : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'"
        >
          {{ page }}
        </button>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="w-12 h-12 flex items-center justify-center rounded-xl border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm bg-card"
        >
          <ChevronRightIcon class="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronDown as ChevronDownIcon,
  Package as PackageIcon,
  ShoppingBag as ShoppingBagIcon,
  Truck as TruckIcon
} from 'lucide-vue-next'
import type { Order, FulfillmentStatus } from '~/types'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Historique des Logistiques | Dounia Market',
  description: 'Consultez et suivez l\'ensemble de vos expéditions Dounia Market.',
})

const authStore = useAuthStore()

// State
const orders = ref<Order[]>([])
const isLoading = ref(true)
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value
  
  const statusMap: Record<string, FulfillmentStatus[]> = {
    pending: ['not_fulfilled', 'partially_fulfilled'],
    shipped: ['fulfilled', 'shipped'],
    delivered: ['delivered'],
  }
  
  return orders.value.filter(o => 
    statusMap[statusFilter.value]?.includes(o.fulfillmentStatus)
  )
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Fetch orders
onMounted(async () => {
  await fetchOrders()
})

const { normalizeOrder: transformOrder } = useOrderNormalizer()

async function fetchOrders() {
  if (!authStore.user) {
    isLoading.value = false
    return
  }

  try {
    const response = await useBackendApi().userOrders()
    const rawOrders = response?.data || []
    orders.value = rawOrders.map(transformOrder)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    isLoading.value = false
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function estimatedDelivery(orderDate: string): string {
  const date = new Date(orderDate)
  date.setDate(date.getDate() + 14) // 14 days shipping estimate
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
  })
}

function getStatusLabel(status: FulfillmentStatus): string {
  const labels: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'Dossier Ouvert',
    partially_fulfilled: 'Prépa Partielle',
    fulfilled: 'Prêt Logistique',
    shipped: 'Transit en cours',
    delivered: 'Colis Livré',
  }
  return labels[status] || status
}

function getStatusClass(status: FulfillmentStatus): string {
  const classes: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'bg-card text-foreground border-border',
    partially_fulfilled: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    fulfilled: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    shipped: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return classes[status] || 'bg-card text-foreground border-border'
}
</script>
