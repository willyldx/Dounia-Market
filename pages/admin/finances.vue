<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="mb-2 flex items-center gap-2">
          <p class="text-xs font-semibold uppercase text-amber-700">Direction</p>
          <UBadge color="amber" variant="soft" size="xs">
            <span class="inline-flex items-center gap-1">
              <Icon name="lucide:lock-keyhole" class="h-3 w-3" />
              Accès réservé
            </span>
          </UBadge>
        </div>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Finances</h1>
        <p class="mt-1 text-sm text-zinc-500">Lecture interne des commandes et montants enregistrés.</p>
      </div>
      <UButton
        color="gray"
        variant="outline"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        class="h-10 justify-center font-medium"
        @click="fetchFinancialData"
      >
        Actualiser
      </UButton>
    </header>

    <div v-if="loading" class="flex min-h-[260px] items-center justify-center rounded-lg border border-zinc-200 bg-white">
      <div class="text-center">
        <UIcon name="i-lucide-loader-2" class="mx-auto h-7 w-7 animate-spin text-zinc-400" />
        <p class="mt-3 text-sm text-zinc-500">Chargement des données financières</p>
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="stat in financialStats"
          :key="stat.label"
          class="relative min-h-[112px] rounded-lg border border-zinc-200 bg-white p-4"
        >
          <p class="pr-10 text-xs font-medium text-zinc-500 sm:text-sm">{{ stat.label }}</p>
          <p class="mt-3 text-xl font-semibold text-zinc-950 sm:text-2xl">{{ stat.value }}</p>
          <p v-if="stat.helper" class="mt-1 text-xs text-zinc-500">{{ stat.helper }}</p>
          <div :class="['absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg', stat.bgColor]">
            <Icon :name="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
          <div class="mb-5">
            <h2 class="font-semibold text-zinc-950">Statuts de paiement</h2>
            <p class="mt-0.5 text-xs text-zinc-500">Répartition des montants remontés par les commandes.</p>
          </div>
          <div v-if="paymentStats.length" class="space-y-4">
            <div v-for="item in paymentStats" :key="item.status">
              <div class="mb-2 flex items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span :class="['h-2.5 w-2.5 rounded-full', item.bgColor]" />
                  <span class="font-medium text-zinc-700">{{ item.label }}</span>
                </div>
                <span class="font-medium text-zinc-950">{{ formatPrice(item.amount) }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div :class="['h-full rounded-full', item.bgColor]" :style="{ width: `${item.percent}%` }" />
              </div>
            </div>
          </div>
          <div v-else class="flex min-h-[140px] items-center justify-center text-sm text-zinc-500">
            Aucun montant à répartir.
          </div>
        </section>

        <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div class="border-b border-zinc-100 px-4 py-4 sm:px-5">
            <h2 class="font-semibold text-zinc-950">Produits les plus commandés</h2>
            <p class="mt-0.5 text-xs text-zinc-500">Classement selon les données disponibles.</p>
          </div>
          <div v-if="topProducts.length" class="divide-y divide-zinc-100">
            <div v-for="(product, index) in topProducts" :key="product.id || index" class="flex items-center gap-3 px-4 py-3 sm:px-5">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600">
                {{ index + 1 }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-zinc-950">{{ product.title }}</p>
                <p class="text-xs text-zinc-500">{{ product.quantity }} unité(s)</p>
              </div>
              <span class="whitespace-nowrap text-sm font-medium text-zinc-950">{{ formatPrice(product.revenue) }}</span>
            </div>
          </div>
          <div v-else class="flex min-h-[150px] flex-col items-center justify-center p-6 text-center">
            <Icon name="lucide:package-open" class="mb-2 h-7 w-7 text-zinc-300" />
            <p class="text-sm text-zinc-500">Aucune donnée produit disponible.</p>
          </div>
        </section>
      </div>

      <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div class="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-5">
          <div>
            <h2 class="font-semibold text-zinc-950">Transactions récentes</h2>
            <p class="mt-0.5 text-xs text-zinc-500">{{ recentOrders.length }} opération(s) affichée(s)</p>
          </div>
          <NuxtLink to="/admin/commandes" class="inline-flex items-center gap-1 text-sm font-medium text-dounia-500 hover:text-amber-700">
            Toutes
            <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="recentOrders.length" class="divide-y divide-zinc-100">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex flex-col gap-3 px-4 py-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:px-5"
          >
            <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', getPaymentBg(order.payment_status)]">
              <Icon :name="getPaymentIcon(order.payment_status)" :class="['h-5 w-5', getPaymentColor(order.payment_status)]" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-zinc-950">#{{ getOrderReference(order) }}</p>
              <p class="truncate text-sm text-zinc-500">{{ getCustomerName(order) }}</p>
            </div>
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div class="text-left sm:text-right">
                <p class="font-medium text-zinc-950">{{ formatPrice(order.total) }}</p>
                <p class="text-xs text-zinc-500">{{ formatDateTime(order.created_at) }}</p>
              </div>
              <UBadge :color="getPaymentBadgeColor(order.payment_status)" variant="soft" size="xs">
                {{ getPaymentLabel(order.payment_status) }}
              </UBadge>
            </div>
          </div>
        </div>
        <div v-else class="flex min-h-[180px] flex-col items-center justify-center p-8 text-center">
          <Icon name="lucide:receipt-text" class="mb-3 h-8 w-8 text-zinc-300" />
          <p class="text-sm font-medium text-zinc-700">Aucune transaction récente</p>
          <p class="mt-1 text-xs text-zinc-500">Les dernières commandes apparaîtront ici.</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const authStore = useAuthStore()
const toast = useToast()

if (!authStore.isSuperAdmin) {
  navigateTo('/admin')
}

const loading = ref(true)
const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  monthRevenue: 0,
  monthGrowth: 0,
  weekRevenue: 0,
  weekOrders: 0,
  todayRevenue: 0,
  todayOrders: 0
})

const paymentStats = ref<any[]>([])
const topProducts = ref<any[]>([])
const recentOrders = ref<any[]>([])

const financialStats = computed(() => [
  {
    label: 'Montant enregistré',
    value: formatPrice(stats.value.totalRevenue),
    helper: `${stats.value.totalOrders} commande(s)`,
    icon: 'lucide:wallet',
    bgColor: 'bg-zinc-100',
    iconColor: 'text-zinc-700'
  },
  {
    label: "Aujourd'hui",
    value: formatPrice(stats.value.todayRevenue),
    helper: `${stats.value.todayOrders} commande(s)`,
    icon: 'lucide:calendar-days',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-700'
  },
  {
    label: 'Cette semaine',
    value: formatPrice(stats.value.weekRevenue),
    helper: `${stats.value.weekOrders} commande(s)`,
    icon: 'lucide:bar-chart-3',
    bgColor: 'bg-zinc-100',
    iconColor: 'text-zinc-700'
  },
  {
    label: 'Ce mois',
    value: formatPrice(stats.value.monthRevenue),
    helper: formatGrowth(stats.value.monthGrowth),
    icon: stats.value.monthGrowth >= 0 ? 'lucide:trending-up' : 'lucide:trending-down',
    bgColor: stats.value.monthGrowth >= 0 ? 'bg-sky-50' : 'bg-red-50',
    iconColor: stats.value.monthGrowth >= 0 ? 'text-sky-700' : 'text-red-700'
  }
])

const fetchFinancialData = async () => {
  loading.value = true
  try {
    const data = await useBackendApi().adminFinances()
    if (!data) return

    const apiStats = data.stats || {}
    stats.value = {
      totalOrders: apiStats.total_orders || 0,
      totalRevenue: apiStats.total_revenue || 0,
      todayOrders: apiStats.today_orders || 0,
      todayRevenue: apiStats.today_revenue || 0,
      weekOrders: apiStats.week_orders || 0,
      weekRevenue: apiStats.week_revenue || 0,
      monthRevenue: apiStats.month_revenue || 0,
      monthGrowth: apiStats.month_growth || 0
    }

    const payments = data.payment_stats || {}
    const captured = payments.captured || 0
    const awaiting = payments.awaiting || 0
    const refunded = payments.refunded || 0
    const total = captured + awaiting + refunded

    paymentStats.value = total > 0
      ? [
          { status: 'captured', label: 'Payé', amount: captured, percent: Math.round((captured / total) * 100), bgColor: 'bg-emerald-500' },
          { status: 'awaiting', label: 'En attente', amount: awaiting, percent: Math.round((awaiting / total) * 100), bgColor: 'bg-amber-500' },
          { status: 'refunded', label: 'Remboursé', amount: refunded, percent: Math.round((refunded / total) * 100), bgColor: 'bg-red-500' }
        ]
      : []

    recentOrders.value = data.recent_orders || []
    topProducts.value = data.top_products || []
  } catch (error) {
    console.error('Error fetching financial data:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les données financières', color: 'red' })
  } finally {
    loading.value = false
  }
}

const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatGrowth = (growth: number) => {
  const prefix = growth > 0 ? '+' : ''
  return `${prefix}${growth}% par rapport au mois précédent`
}

const formatDateTime = (date?: string) => {
  if (!date) return '-'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return '-'
  return parsedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getOrderReference = (order: any) => {
  return order.display_id || order.id?.slice(0, 8).toUpperCase() || '-'
}

const getCustomerName = (order: any) => {
  return [order.customer_first_name, order.customer_last_name].filter(Boolean).join(' ') || 'Client non renseigné'
}

const getPaymentBg = (status: string) => {
  const map: Record<string, string> = { captured: 'bg-emerald-50', awaiting: 'bg-amber-50', refunded: 'bg-red-50' }
  return map[status] || 'bg-zinc-100'
}

const getPaymentIcon = (status: string) => {
  const map: Record<string, string> = { captured: 'lucide:check', awaiting: 'lucide:clock', refunded: 'lucide:rotate-ccw' }
  return map[status] || 'lucide:help-circle'
}

const getPaymentColor = (status: string) => {
  const map: Record<string, string> = { captured: 'text-emerald-700', awaiting: 'text-amber-700', refunded: 'text-red-700' }
  return map[status] || 'text-zinc-600'
}

const getPaymentBadgeColor = (status: string) => {
  const map: Record<string, string> = { captured: 'green', awaiting: 'amber', refunded: 'red' }
  return map[status] || 'gray'
}

const getPaymentLabel = (status: string) => {
  const map: Record<string, string> = { captured: 'Payé', awaiting: 'En attente', refunded: 'Remboursé' }
  return map[status] || status || 'Non renseigné'
}

onMounted(() => {
  fetchFinancialData()
})

useHead({
  title: 'Finances - Admin Dounia Market'
})
</script>
