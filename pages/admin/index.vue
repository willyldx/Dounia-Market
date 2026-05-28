<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Opérations · {{ todayLabel }}</p>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Vue d'ensemble</h1>
        <p class="mt-1 text-sm text-zinc-500">Bonjour {{ authStore.fullName }}. Voici les commandes et livraisons à traiter.</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/admin/commandes" class="inline-flex h-10 items-center gap-2 rounded-lg bg-dounia-500 px-4 text-sm font-medium text-white hover:bg-dounia-600">
          <Icon name="lucide:package" class="h-4 w-4" />
          Commandes
        </NuxtLink>
        <NuxtLink to="/admin/stocks" class="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          <Icon name="lucide:warehouse" class="h-4 w-4" />
          Stocks
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="relative min-h-[108px] rounded-lg border border-zinc-200 bg-white p-4 sm:min-h-[124px] sm:p-5">
        <div>
          <div class="pr-10">
            <p class="text-xs font-medium text-zinc-500 sm:text-sm">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-semibold text-zinc-950">{{ stat.value }}</p>
            <p v-if="stat.subtext" class="mt-1 text-xs text-zinc-500">{{ stat.subtext }}</p>
          </div>
          <div :class="['absolute right-4 top-4 h-9 w-9 rounded-lg flex items-center justify-center sm:right-5 sm:top-5', stat.bgColor]">
            <Icon :name="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div class="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-5">
          <div>
            <h2 class="font-semibold text-zinc-950">Commandes en attente</h2>
            <p class="mt-0.5 text-xs text-zinc-500">Paiements confirmés à préparer</p>
          </div>
          <NuxtLink to="/admin/commandes" class="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800">
            Toutes
            <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </div>
        <div v-if="pendingOrders.length > 0" class="divide-y divide-zinc-100">
          <div v-for="order in pendingOrders" :key="order.id" class="flex flex-col gap-3 px-4 py-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div class="min-w-0">
              <p class="font-medium text-zinc-950">#{{ order.display_id || order.id.slice(0, 8).toUpperCase() }}</p>
              <p class="truncate text-sm text-zinc-500">{{ order.recipient_name || order.customer_first_name }}</p>
            </div>
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div class="text-left sm:text-right">
                <p class="font-medium text-zinc-950">{{ formatPrice(order.total) }}</p>
                <p class="text-xs text-zinc-500">{{ formatDate(order.created_at) }}</p>
              </div>
              <NuxtLink :to="`/admin/commandes/${order.id}`" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
                Ouvrir
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
          <Icon name="lucide:package-check" class="mb-3 h-8 w-8 text-dounia-500" />
          <p class="text-sm font-medium text-zinc-800">Aucune commande en attente</p>
          <p class="mt-1 text-xs text-zinc-500">Les nouvelles commandes confirmées apparaîtront ici.</p>
        </div>
      </section>

      <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div class="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-5">
          <h2 class="font-semibold text-zinc-950">Livraisons en cours</h2>
          <span class="min-w-6 rounded-full bg-sky-50 px-2 py-1 text-center text-xs font-semibold text-sky-700">
            {{ activeDeliveries.length }}
          </span>
        </div>
        <div v-if="activeDeliveries.length > 0" class="divide-y divide-zinc-100">
          <div v-for="delivery in activeDeliveries" :key="delivery.id" class="p-4 sm:px-5">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50">
                <Icon name="lucide:truck" class="h-5 w-5 text-sky-700" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-zinc-950">#{{ delivery.display_id || delivery.id.slice(0, 8).toUpperCase() }}</p>
                <p class="truncate text-xs text-zinc-500">{{ delivery.recipient_name }}</p>
              </div>
              <UBadge :color="getStatusColor(delivery.fulfillment_status)" variant="soft" size="xs">
                {{ getStatusLabel(delivery.fulfillment_status) }}
              </UBadge>
            </div>
          </div>
        </div>
        <div v-else class="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
          <Icon name="lucide:truck" class="mb-3 h-8 w-8 text-zinc-300" />
          <p class="text-sm font-medium text-zinc-700">Aucune livraison en cours</p>
          <p class="mt-1 text-xs text-zinc-500">Les colis expédiés seront suivis ici.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const authStore = useAuthStore()
const todayLabel = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long'
}).format(new Date())

// Stats
const stats = ref([
  { label: "Commandes aujourd'hui", value: '0', icon: 'lucide:shopping-bag', bgColor: 'bg-sky-50', iconColor: 'text-sky-700', subtext: 'Montant selon commandes' },
  { label: 'En attente', value: '0', icon: 'lucide:clock', bgColor: 'bg-amber-50', iconColor: 'text-amber-700' },
  { label: 'En livraison', value: '0', icon: 'lucide:truck', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Livrées ce mois', value: '0', icon: 'lucide:package-check', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' },
])

const pendingOrders = ref<any[]>([])
const activeDeliveries = ref<any[]>([])

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const data = await useBackendApi().adminStats()
    
    if (data && data.stats) {
      // Stats du jour
      stats.value[0].value = data.stats.today.count.toString()
      stats.value[0].subtext = `${formatPrice(data.stats.today.revenue)} de CA`

      // En attente
      stats.value[1].value = data.stats.pending.toString()

      // En livraison
      stats.value[2].value = data.stats.active.toString()

      // Livrées ce mois
      stats.value[3].value = data.stats.monthly_delivered.toString()

      // Listes 
      pendingOrders.value = data.pending_orders || []
      activeDeliveries.value = data.active_deliveries || []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'amber',
    processing: 'blue',
    fulfilled: 'cyan',
    shipped: 'indigo',
    delivered: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    not_fulfilled: 'Non traité',
    fulfilled: 'Prêt',
    shipped: 'En livraison',
    delivered: 'Livré'
  }
  return labels[status] || status
}

// Fetch on mount
onMounted(() => {
  fetchDashboardData()
})

useHead({
  title: 'Tableau de bord - Administration'
})
</script>
