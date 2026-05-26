<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mes livraisons</h1>
      <p class="text-gray-500 mt-1">{{ todayDate }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <p class="text-2xl font-bold text-amber-600">{{ pendingCount }}</p>
        <p class="text-xs text-gray-500">En attente</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <p class="text-2xl font-bold text-dounia-500">{{ inProgressCount }}</p>
        <p class="text-xs text-gray-500">En cours</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <p class="text-2xl font-bold text-green-600">{{ deliveredTodayCount }}</p>
        <p class="text-xs text-gray-500">Livrées</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          activeTab === tab.value
            ? 'bg-dounia-500 text-white'
            : 'bg-gray-100 text-gray-600'
        ]"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1 px-1.5 py-0.5 rounded-full text-xs" :class="activeTab === tab.value ? 'bg-white/20' : 'bg-gray-200'">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-amber-600" />
    </div>

    <!-- Deliveries List -->
    <div v-else-if="filteredDeliveries.length > 0" class="space-y-3">
      <NuxtLink
        v-for="delivery in filteredDeliveries"
        :key="delivery.id"
        :to="`/livreur/${delivery.id}`"
        class="block bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900">#{{ delivery.displayId }}</span>
              <UBadge :color="getStatusColor(delivery.fulfillmentStatus)" variant="soft" size="xs">
                {{ getStatusLabel(delivery.fulfillmentStatus) }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-500 mt-0.5">{{ formatTime(delivery.assignedAt) }}</p>
          </div>
          <span class="font-bold text-dounia-500">{{ formatPrice(delivery.total) }}</span>
        </div>

        <!-- Recipient -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="lucide:user" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ delivery.recipientName }}</p>
            <p class="text-sm text-gray-500">{{ delivery.recipientPhone }}</p>
          </div>
        </div>

        <!-- Address -->
        <div class="flex items-start gap-2 text-sm text-gray-600">
          <Icon name="lucide:map-pin" class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p>{{ formatAddress(delivery.shippingAddress) }}</p>
        </div>

        <!-- Items preview -->
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs text-gray-500">{{ delivery.items?.length || 0 }} article(s)</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon name="lucide:package" class="w-10 h-10 text-gray-400" />
      </div>
      <p class="text-gray-500 font-medium">Aucune livraison</p>
      <p class="text-sm text-gray-400 mt-1">
        {{ activeTab === 'pending' ? 'Pas de nouvelles livraisons assignées' : 'Aucune livraison dans cette catégorie' }}
      </p>
    </div>

    <!-- Refresh button -->
    <div class="fixed bottom-24 right-4">
      <UButton
        @click="fetchDeliveries"
        color="primary"
        icon="i-lucide-refresh-cw"
        size="lg"
        class="rounded-full shadow-lg"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

definePageMeta({
  layout: 'livreur',
  middleware: ['livreur']
})

const authStore = useAuthStore()

// State
const loading = ref(true)
const activeTab = ref('pending')
const deliveries = ref<Order[]>([])

// Tabs
const tabs = computed(() => [
  { label: 'À livrer', value: 'pending', count: pendingCount.value },
  { label: 'En cours', value: 'in_progress', count: inProgressCount.value },
  { label: 'Livrées', value: 'delivered', count: deliveredTodayCount.value }
])

// Computed counts
const pendingCount = computed(() => deliveries.value.filter(d => d.fulfillmentStatus === 'fulfilled').length)
const inProgressCount = computed(() => deliveries.value.filter(d => d.fulfillmentStatus === 'shipped').length)
const deliveredTodayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return deliveries.value.filter(d => 
    d.fulfillmentStatus === 'delivered' && 
    new Date(d.deliveredAt || '') >= today
  ).length
})

// Filtered deliveries
const filteredDeliveries = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return deliveries.value.filter(d => d.fulfillmentStatus === 'fulfilled')
    case 'in_progress':
      return deliveries.value.filter(d => d.fulfillmentStatus === 'shipped')
    case 'delivered':
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return deliveries.value.filter(d => 
        d.fulfillmentStatus === 'delivered' && 
        new Date(d.deliveredAt || '') >= today
      )
    default:
      return deliveries.value
  }
})

// Today's date
const todayDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
})

// Fetch deliveries assigned to me
const fetchDeliveries = async () => {
  if (!authStore.user) return
  
  loading.value = true
  try {
    const data = await useBackendApi().livreurOrders()

    const { normalizeOrder } = useOrderNormalizer()
    deliveries.value = (data?.data || []).map((order: any) => normalizeOrder(order))
  } catch (error) {
    console.error('Error fetching deliveries:', error)
  } finally {
    loading.value = false
  }
}


// Map order from database (legacy, préférer normalizeOrder)
const mapOrder = (o: any): Order => ({
  id: o.id,
  displayId: o.display_id || o.id?.slice(0, 8).toUpperCase(),
  status: o.status,
  paymentStatus: o.payment_status,
  fulfillmentStatus: o.fulfillment_status,
  items: [],
  shippingAddress: o.shipping_address,
  subtotal: Number(o.subtotal) || 0,
  shippingTotal: Number(o.shipping_total) || 0,
  total: Number(o.total) || 0,
  currency: o.currency || 'EUR',
  createdAt: o.created_at,
  updatedAt: o.updated_at,
  email: o.email,
  customerFirstName: o.customer_first_name,
  customerLastName: o.customer_last_name,
  recipientName: o.recipient_name || 'Non spécifié',
  recipientPhone: o.recipient_phone || '-',
  assignedTo: o.assigned_to,
  assignedAt: o.assigned_at,
  deliveredAt: o.delivered_at,
  deliveryPhoto: o.delivery_photo
})

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatTime = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatAddress = (address: any) => {
  if (!address) return 'Adresse non spécifiée'
  const addressLine = address.address1 || address.address_1
  return [addressLine, address.city].filter(Boolean).join(', ') || 'Adresse non spécifiée'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    fulfilled: 'amber',
    shipped: 'primary',
    delivered: 'green'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    fulfilled: 'À récupérer',
    shipped: 'En livraison',
    delivered: 'Livré'
  }
  return labels[status] || status
}

// Fetch on mount
onMounted(() => {
  fetchDeliveries()
})

useHead({
  title: 'Mes livraisons - Dounia Market'
})
</script>
