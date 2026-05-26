<template>
  <div class="px-4 py-6">
    <!-- Back button -->
    <div class="mb-4">
      <UButton to="/livreur" color="gray" variant="ghost" icon="i-lucide-arrow-left" size="sm">
        Retour
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-amber-600" />
    </div>

    <div
      v-else-if="delivery"
      :class="delivery.fulfillmentStatus === 'delivered' && delivery.deliveryPhoto ? 'pb-72' : 'pb-20'"
    >
      <!-- Header -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h1 class="text-xl font-bold text-gray-900">#{{ delivery.displayId }}</h1>
            <p class="text-sm text-gray-500">Assignée {{ formatDateTime(delivery.assignedAt) }}</p>
          </div>
          <UBadge :color="getStatusColor(delivery.fulfillmentStatus)" variant="soft" size="lg">
            {{ getStatusLabel(delivery.fulfillmentStatus) }}
          </UBadge>
        </div>
        <div class="text-2xl font-bold text-dounia-500">
          {{ formatPrice(delivery.total) }}
        </div>
      </div>

      <!-- Recipient Card -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <h2 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="lucide:user" class="w-5 h-5 text-gray-400" />
          Destinataire
        </h2>
        
        <div class="space-y-3">
          <div>
            <p class="font-medium text-gray-900">{{ delivery.recipientName }}</p>
          </div>
          
          <a :href="`tel:${delivery.recipientPhone}`" class="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Icon name="lucide:phone" class="w-5 h-5 text-amber-700" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Téléphone</p>
              <p class="font-medium text-gray-900">{{ delivery.recipientPhone }}</p>
            </div>
            <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
          </a>
        </div>
      </div>

      <!-- Address Card -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <h2 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="lucide:map-pin" class="w-5 h-5 text-gray-400" />
          Adresse de livraison
        </h2>
        
        <div v-if="delivery.shippingAddress" class="mb-4">
          <p class="text-gray-900">{{ delivery.shippingAddress.address1 }}</p>
          <p v-if="delivery.shippingAddress.address2" class="text-gray-600">{{ delivery.shippingAddress.address2 }}</p>
          <p class="text-gray-600">{{ delivery.shippingAddress.city }}, {{ delivery.shippingAddress.country }}</p>
        </div>
        <p v-else class="text-gray-500">Adresse non spécifiée</p>

        <!-- Open in Maps -->
        <UButton 
          v-if="delivery.shippingAddress"
          @click="openInMaps"
          color="gray"
          variant="outline"
          icon="i-lucide-navigation"
          class="w-full"
        >
          Ouvrir dans Google Maps
        </UButton>

        <!-- Delivery instructions -->
        <div v-if="delivery.deliveryInstructions" class="mt-4 p-3 bg-amber-50 rounded-lg">
          <p class="text-xs text-amber-600 font-medium mb-1">Instructions de livraison</p>
          <p class="text-sm text-gray-700">{{ delivery.deliveryInstructions }}</p>
        </div>
      </div>

      <!-- Items Card -->
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <h2 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="lucide:package" class="w-5 h-5 text-gray-400" />
          Articles ({{ delivery.items?.length || 0 }})
        </h2>
        
        <div class="space-y-3">
          <div v-for="item in delivery.items" :key="item.id" class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:package" class="w-5 h-5 text-gray-400" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 text-sm">{{ item.title }}</p>
              <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="fixed bottom-24 left-4 right-4 space-y-3">
        <!-- Start delivery -->
        <UButton
          v-if="delivery.fulfillmentStatus === 'fulfilled'"
          @click="startDelivery"
          color="primary"
          size="xl"
          class="w-full"
          :loading="updating"
        >
          <Icon name="lucide:truck" class="w-5 h-5 mr-2" />
          Commencer la livraison
        </UButton>

        <!-- Complete delivery -->
        <UButton
          v-if="delivery.fulfillmentStatus === 'shipped'"
          @click="showCompleteModal = true"
          color="green"
          size="xl"
          class="w-full"
        >
          <Icon name="lucide:check-circle" class="w-5 h-5 mr-2" />
          Confirmer la livraison
        </UButton>

        <!-- Already delivered -->
        <div v-if="delivery.fulfillmentStatus === 'delivered'" class="bg-green-50 rounded-lg p-4 text-center">
          <Icon name="lucide:check-circle" class="w-12 h-12 mx-auto text-green-500 mb-2" />
          <p class="font-medium text-green-700">Livraison effectuée</p>
          <p class="text-sm text-green-600">{{ formatDateTime(delivery.deliveredAt) }}</p>
          <img v-if="delivery.deliveryPhoto" :src="delivery.deliveryPhoto" alt="Photo de remise" class="mt-3 rounded-lg w-full max-h-40 object-cover" />
        </div>
      </div>
    </div>

    <!-- Complete Delivery Modal -->
    <UModal v-model="showCompleteModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmer la livraison</h3>
        <p class="text-sm text-gray-500 mb-4">
          Ajoutez la photo de remise requise pour clôturer cette livraison
        </p>

        <!-- Photo capture -->
        <div class="mb-4">
          <div 
            v-if="!photoPreview"
            @click="triggerCamera"
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
          >
            <Icon name="lucide:camera" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p class="text-sm text-gray-500">Appuyez pour prendre une photo</p>
          </div>
          <div v-else class="relative">
            <img :src="photoPreview" alt="Aperçu de la photo de remise" class="w-full rounded-lg" />
            <button 
              @click="clearPhoto"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            capture="environment"
            @change="handlePhoto"
            class="hidden"
          />
        </div>

        <div class="flex gap-3">
          <UButton color="gray" variant="outline" class="flex-1" @click="showCompleteModal = false">
            Annuler
          </UButton>
          <UButton 
            color="green" 
            class="flex-1" 
            :loading="updating"
            @click="completeDelivery"
          >
            Confirmer
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

definePageMeta({
  layout: 'livreur',
  middleware: ['livreur']
})

const route = useRoute()
const { livreurOrderUpdate } = useBackendApi()
const toast = useToast()

// State
const loading = ref(true)
const updating = ref(false)
const delivery = ref<Order | null>(null)
const showCompleteModal = ref(false)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Fetch delivery
const fetchDelivery = async () => {
  loading.value = true
  try {
    const { fetchWithAuth } = useBackendApi()
    const response = await fetchWithAuth<any>(`api/livreur/orders/${route.params.id}`)

    const { normalizeOrder } = useOrderNormalizer()
    delivery.value = normalizeOrder(response.order || response.data)
  } catch (error) {
    console.error('Error fetching delivery:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger la livraison', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Start delivery (change to 'shipped')
const startDelivery = async () => {
  if (!delivery.value) return
  updating.value = true

  try {
    await livreurOrderUpdate(delivery.value.id, {
      fulfillment_status: 'shipped',
      picked_up_at: new Date().toISOString()
    })

    delivery.value.fulfillmentStatus = 'shipped'
    toast.add({ title: 'Succès', description: 'Livraison démarrée', color: 'green' })
  } catch (error) {
    console.error('Error starting delivery:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de démarrer la livraison', color: 'red' })
  } finally {
    updating.value = false
  }
}

// Photo handling
const triggerCamera = () => {
  fileInput.value?.click()
}

const handlePhoto = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    photoFile.value = input.files[0]
    photoPreview.value = URL.createObjectURL(input.files[0])
  }
}

const clearPhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Complete delivery
const completeDelivery = async () => {
  if (!delivery.value) return

  if (!photoFile.value) {
    toast.add({ title: 'Photo de remise requise', description: 'Ajoutez la photo de remise pour clôturer cette livraison.', color: 'amber' })
    return
  }

  updating.value = true

  try {
    let photoUrl = null

    // Upload photo if provided
    if (photoFile.value) {
      // Use standard admin upload or new delivery endpoint (if backend supports formData)
      const { adminUploadFile } = useBackendApi()
      const uploadRes = await adminUploadFile(photoFile.value)
      photoUrl = uploadRes.url
    }

    await livreurOrderUpdate(delivery.value.id, {
      fulfillment_status: 'delivered',
      delivered_at: new Date().toISOString(),
      delivery_photo: photoUrl,
      status: 'completed'
    })

    delivery.value.fulfillmentStatus = 'delivered'
    delivery.value.deliveredAt = new Date().toISOString()
    delivery.value.deliveryPhoto = photoUrl || undefined

    showCompleteModal.value = false
    toast.add({ title: 'Succès', description: 'Livraison confirmée !', color: 'green' })
  } catch (error: any) {
    console.error('Error completing delivery:', error)
    const errMessage = error?.data?.error || 'Impossible de confirmer la livraison'
    toast.add({ title: 'Erreur', description: errMessage, color: 'red' })
  } finally {
    updating.value = false
  }
}

// Open in Google Maps
const openInMaps = () => {
  if (!delivery.value?.shippingAddress) return
  const addr = delivery.value.shippingAddress
  const query = encodeURIComponent(`${addr.address1}, ${addr.city}, ${addr.country}`)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}

// Map order from database
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
  customerFirstName: o.customer_first_name,
  customerLastName: o.customer_last_name,
  recipientName: o.recipient_name || 'Non spécifié',
  recipientPhone: o.recipient_phone || '-',
  deliveryInstructions: o.delivery_instructions,
  assignedTo: o.assigned_to,
  assignedAt: o.assigned_at,
  deliveredAt: o.delivered_at,
  deliveryPhoto: o.delivery_photo
})

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDateTime = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
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
  fetchDelivery()
})

useHead({
  title: computed(() => delivery.value ? `Livraison #${delivery.value.displayId}` : 'Chargement...')
})
</script>
