<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Historique</h1>
      <p class="text-gray-500 mt-1">Toutes vos livraisons passées</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <p class="text-3xl font-bold text-gray-900">{{ totalDeliveries }}</p>
        <p class="text-sm text-gray-500">Livraisons totales</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1">
          <Icon name="lucide:star" class="w-6 h-6 text-amber-500 fill-current" />
          <p class="text-3xl font-bold text-gray-900">{{ rating ?? '--' }}</p>
        </div>
        <p class="text-sm text-gray-500">{{ rating ? 'Note moyenne' : 'Note indisponible' }}</p>
      </div>
    </div>

    <!-- Filter by month -->
    <div class="mb-4">
      <USelectMenu
        v-model="selectedMonth"
        :options="monthOptions"
        placeholder="Filtrer par mois"
        class="w-full"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-amber-600" />
    </div>

    <!-- Deliveries List -->
    <div v-else-if="filteredHistory.length > 0" class="space-y-3">
      <div
        v-for="delivery in filteredHistory"
        :key="delivery.id"
        class="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <span class="font-semibold text-gray-900">#{{ delivery.displayId }}</span>
            <p class="text-sm text-gray-500">{{ formatDate(delivery.deliveredAt) }}</p>
          </div>
          <span class="font-bold text-dounia-500">{{ formatPrice(delivery.total) }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Icon name="lucide:user" class="w-4 h-4 text-gray-400" />
          <span>{{ delivery.recipientName }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Icon name="lucide:map-pin" class="w-4 h-4 text-gray-400" />
          <span>{{ delivery.shippingAddress?.city || 'N/A' }}</span>
        </div>

        <div v-if="delivery.deliveryPhoto" class="mt-3">
          <img :src="delivery.deliveryPhoto" alt="Photo de remise" class="w-full h-24 object-cover rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon name="lucide:history" class="w-10 h-10 text-gray-400" />
      </div>
      <p class="text-gray-500 font-medium">Aucune livraison</p>
      <p class="text-sm text-gray-400 mt-1">Votre historique apparaîtra ici</p>
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
const history = ref<Order[]>([])
const totalDeliveries = ref(0)
const rating = ref<string | null>(null)
const selectedMonth = ref<string | null>(null)

// Month options
const monthOptions = computed(() => {
  const months = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })
  }
  return [{ label: 'Tous', value: null }, ...months]
})

// Filtered history
const filteredHistory = computed(() => {
  if (!selectedMonth.value) return history.value
  
  return history.value.filter(d => {
    const date = new Date(d.deliveredAt || d.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return monthKey === selectedMonth.value
  })
})

// Fetch history
const fetchHistory = async () => {
  if (!authStore.user) return
  
  loading.value = true
  try {
    const { livreurOrders } = useBackendApi()
    // Fetch delivered orders from Laravel
    const response = await livreurOrders({ status: 'delivered' })

    if (response && response.data) {
      history.value = (response.data || []).map(mapOrder)
      totalDeliveries.value = history.value.length
    }
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loading.value = false
  }
}

// Map order
const mapOrder = (o: any): Order => ({
  id: o.id,
  displayId: o.display_id || o.id.slice(0, 8).toUpperCase(),
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
  recipientName: o.recipient_name || 'N/A',
  recipientPhone: o.recipient_phone,
  deliveredAt: o.delivered_at,
  deliveryPhoto: o.delivery_photo
})

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// Fetch on mount
onMounted(() => {
  fetchHistory()
})

useHead({
  title: 'Historique - Espace livreur'
})
</script>
