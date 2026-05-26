<template>
  <div class="space-y-5">
    <UButton to="/admin/commandes" color="gray" variant="ghost" icon="i-lucide-arrow-left">
      Retour aux commandes
    </UButton>

    <div v-if="loading" class="flex min-h-[280px] items-center justify-center rounded-lg border border-zinc-200 bg-white">
      <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
    </div>

    <template v-else-if="order">
      <section class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Traitement commande</p>
            <h1 class="text-xl font-semibold text-zinc-950 sm:text-2xl">
              #{{ order.display_id || order.id.slice(0, 8).toUpperCase() }}
            </h1>
            <p class="mt-1 text-sm text-zinc-500">{{ formatDateTime(order.created_at) }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <UBadge :color="getStatusColor(order.status)" variant="soft" size="sm">
                {{ getStatusLabel(order.status) }}
              </UBadge>
              <UBadge :color="getFulfillmentColor(order.fulfillment_status)" variant="soft" size="sm">
                {{ getFulfillmentLabel(order.fulfillment_status) }}
              </UBadge>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-if="order.fulfillment_status === 'not_fulfilled'"
              @click="updateFulfillment('fulfilled')"
              color="cyan"
              icon="i-lucide-package-check"
              :loading="updating"
            >
              Prête
            </UButton>
            <UButton
              v-if="order.fulfillment_status === 'fulfilled' && order.assigned_to"
              @click="updateFulfillment('shipped')"
              color="indigo"
              icon="i-lucide-truck"
              :loading="updating"
            >
              En livraison
            </UButton>
            <UButton
              v-if="order.fulfillment_status === 'shipped'"
              @click="showDeliveryModal = true"
              color="green"
              icon="i-lucide-check-circle"
            >
              Livrée
            </UButton>
            <UButton
              v-if="!order.assigned_to"
              @click="showAssignModal = true"
              color="gray"
              variant="outline"
              icon="i-lucide-user-plus"
            >
              Assigner
            </UButton>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div class="space-y-4">
          <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div class="border-b border-zinc-100 px-4 py-4 sm:px-5">
              <h2 class="font-semibold text-zinc-950">Articles commandés</h2>
              <p class="mt-0.5 text-xs text-zinc-500">{{ orderItems.length }} article(s)</p>
            </div>
            <div class="divide-y divide-zinc-100">
              <div v-for="item in orderItems" :key="item.id" class="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
                  <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
                  <Icon v-else name="lucide:package" class="h-5 w-5 text-zinc-300" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-zinc-950">{{ item.title }}</p>
                  <p class="text-xs text-zinc-500">{{ item.quantity }} x {{ formatPrice(item.unit_price) }}</p>
                </div>
                <p class="shrink-0 text-sm font-medium text-zinc-950">{{ formatPrice(item.total) }}</p>
              </div>
            </div>
            <dl class="space-y-2 border-t border-zinc-100 bg-zinc-50 px-4 py-4 text-sm sm:px-5">
              <div class="flex justify-between">
                <dt class="text-zinc-500">Sous-total</dt>
                <dd class="font-medium text-zinc-800">{{ formatPrice(order.subtotal) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-zinc-500">Livraison</dt>
                <dd class="font-medium text-zinc-800">{{ formatPrice(order.shipping_total) }}</dd>
              </div>
              <div class="flex justify-between border-t border-zinc-200 pt-2 text-base">
                <dt class="font-semibold text-zinc-950">Total</dt>
                <dd class="font-semibold text-zinc-950">{{ formatPrice(order.total) }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="order.notes || order.delivery_instructions" class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
            <h2 class="mb-4 font-semibold text-zinc-950">Consignes</h2>
            <div class="space-y-4 text-sm">
              <div v-if="order.delivery_instructions">
                <p class="mb-1 font-medium text-zinc-700">Livraison</p>
                <p class="text-zinc-600">{{ order.delivery_instructions }}</p>
              </div>
              <div v-if="order.notes">
                <p class="mb-1 font-medium text-zinc-700">Note interne</p>
                <p class="text-zinc-600">{{ order.notes }}</p>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-4">
          <section class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
            <h2 class="mb-4 font-semibold text-zinc-950">Destinataire</h2>
            <div class="flex gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <Icon name="lucide:map-pin" class="h-5 w-5 text-amber-700" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-zinc-950">{{ order.recipient_name || '-' }}</p>
                <p class="text-sm text-zinc-500">{{ order.recipient_phone || '-' }}</p>
              </div>
            </div>
            <p v-if="order.shipping_address" class="mt-4 border-t border-zinc-100 pt-4 text-sm leading-6 text-zinc-600">
              {{ order.shipping_address.address_1 }}<br>
              <span v-if="order.shipping_address.address_2">{{ order.shipping_address.address_2 }}<br></span>
              {{ order.shipping_address.city }}, {{ order.shipping_address.country }}
            </p>
          </section>

          <section class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
            <h2 class="mb-4 font-semibold text-zinc-950">Client</h2>
            <div class="flex gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <Icon name="lucide:user" class="h-5 w-5 text-zinc-700" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-zinc-950">{{ order.customer_first_name }} {{ order.customer_last_name }}</p>
                <p class="truncate text-sm text-zinc-500">{{ order.email }}</p>
              </div>
            </div>
            <p v-if="order.customer_phone" class="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
              <Icon name="lucide:phone" class="h-4 w-4 text-zinc-400" />
              {{ order.customer_phone }}
            </p>
          </section>

          <section class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <h2 class="font-semibold text-zinc-950">Livreur</h2>
              <UButton v-if="order.assigned_to" @click="showAssignModal = true" color="gray" variant="ghost" size="xs" icon="i-lucide-pencil">
                Changer
              </UButton>
            </div>
            <div v-if="assignedLivreur" class="flex gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                <Icon name="lucide:truck" class="h-5 w-5 text-sky-700" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-zinc-950">{{ assignedLivreur.first_name }} {{ assignedLivreur.last_name }}</p>
                <p class="text-sm text-zinc-500">{{ assignedLivreur.phone || 'Téléphone non renseigné' }}</p>
              </div>
            </div>
            <div v-else class="rounded-lg bg-zinc-50 p-4 text-center">
              <p class="text-sm text-zinc-500">Aucun livreur assigné</p>
              <UButton @click="showAssignModal = true" color="gray" variant="outline" icon="i-lucide-user-plus" size="sm" class="mt-3">
                Assigner
              </UButton>
            </div>
          </section>

          <section v-if="order.delivery_photo" class="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
            <h2 class="mb-4 font-semibold text-zinc-950">Preuve de livraison</h2>
            <img :src="order.delivery_photo" alt="Preuve de livraison" class="w-full rounded-lg border border-zinc-100 object-cover" />
            <p class="mt-2 text-xs text-zinc-500">Livrée le {{ formatDateTime(order.delivered_at) }}</p>
          </section>
        </aside>
      </div>
    </template>

    <UModal v-model="showAssignModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-zinc-950">Assigner un livreur</h3>
        <p class="mb-5 mt-1 text-sm text-zinc-500">Sélectionnez un membre pour cette livraison.</p>
        <USelectMenu
          v-model="selectedLivreur"
          :options="livreurs"
          option-attribute="label"
          value-attribute="value"
          placeholder="Sélectionner un livreur"
          class="mb-5"
        />
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="outline" @click="showAssignModal = false">Annuler</UButton>
          <UButton color="black" icon="i-lucide-user-plus" :loading="updating" @click="assignLivreur">Assigner</UButton>
        </div>
      </div>
    </UModal>

    <UModal v-model="showDeliveryModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-zinc-950">Confirmer la livraison</h3>
        <p class="mb-5 mt-1 text-sm text-zinc-500">Une photo de preuve peut être jointe avant la confirmation.</p>
        <input
          type="file"
          accept="image/*"
          @change="handlePhotoUpload"
          class="mb-5 w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
        />
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="outline" @click="showDeliveryModal = false">Annuler</UButton>
          <UButton color="green" icon="i-lucide-check-circle" :loading="updating" @click="confirmDelivery">Confirmer</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const route = useRoute()
const { adminOrderDetail, adminOrderUpdate, adminLivreurs, adminUploadFile } = useBackendApi()
const toast = useToast()

// State
const loading = ref(true)
const updating = ref(false)
const order = ref<any | null>(null)
const orderItems = ref<any[]>([])
const assignedLivreur = ref<any | null>(null)

// Modals
const showAssignModal = ref(false)
const showDeliveryModal = ref(false)
const selectedLivreur = ref<string | null>(null)
const livreurs = ref<{ label: string; value: string }[]>([])
const deliveryPhoto = ref<File | null>(null)

// Fetch order
const fetchOrder = async () => {
  loading.value = true
  try {
    const response = await adminOrderDetail(route.params.id as string)

    if (response && response.order) {
      order.value = response.order
      // Assumes Laravel returns items inside the order object
      orderItems.value = response.order.items || []

      // Fetch assigned livreur from the order object directly if eager loaded,
      // or we just find it from the livreurs list later
      if (order.value.assigned_to) {
        // Will be matched in fetchLivreurs
        assignedLivreur.value = order.value.assigned_agent || null
      }
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger la commande', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Fetch livreurs
const fetchLivreurs = async () => {
  try {
    const response = await adminLivreurs()
    if (response && response.data) {
      livreurs.value = response.data.map((l: any) => ({
        label: `${l.first_name} ${l.last_name}`,
        value: l.id
      }))
      
      // Update assigned livreur if it matches the current order
      if (order.value && order.value.assigned_to && !assignedLivreur.value) {
        assignedLivreur.value = response.data.find((l: any) => l.id === order.value?.assigned_to) || null
      }
    }
  } catch (err) {
    console.error('Error fetching livreurs', err)
  }
}

// Update fulfillment status
const updateFulfillment = async (status: string) => {
  if (!order.value) return
  updating.value = true

  try {
    await adminOrderUpdate(order.value.id, { 
      fulfillment_status: status
    })

    order.value.fulfillment_status = status
    toast.add({ title: 'Succès', description: 'Statut mis à jour', color: 'green' })
  } catch (error) {
    console.error('Error updating status:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', color: 'red' })
  } finally {
    updating.value = false
  }
}

// Assign livreur
const assignLivreur = async () => {
  if (!order.value || !selectedLivreur.value) return
  updating.value = true

  try {
    await adminOrderUpdate(order.value.id, {
      assigned_to: selectedLivreur.value
    })

    toast.add({ title: 'Succès', description: 'Livreur assigné', color: 'green' })
    showAssignModal.value = false
    fetchOrder()
  } catch (error) {
    console.error('Error assigning livreur:', error)
    toast.add({ title: 'Erreur', description: "Impossible d'assigner le livreur", color: 'red' })
  } finally {
    updating.value = false
  }
}

// Handle photo upload
const handlePhotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    deliveryPhoto.value = input.files[0]
  }
}

// Confirm delivery
const confirmDelivery = async () => {
  if (!order.value) return
  updating.value = true

  try {
    let photoUrl = null

    if (deliveryPhoto.value) {
      const uploadRes = await adminUploadFile(deliveryPhoto.value)
      photoUrl = uploadRes.url
    }

    await adminOrderUpdate(order.value.id, {
      fulfillment_status: 'delivered',
      delivered_at: new Date().toISOString(),
      delivery_photo: photoUrl,
      status: 'completed'
    })

    toast.add({ title: 'Succès', description: 'Livraison confirmée', color: 'green' })
    showDeliveryModal.value = false
    fetchOrder()
  } catch (error) {
    console.error('Error confirming delivery:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de confirmer la livraison', color: 'red' })
  } finally {
    updating.value = false
  }
}

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDateTime = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = { pending: 'amber', processing: 'blue', completed: 'green', cancelled: 'red' }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = { pending: 'En attente', processing: 'En cours', completed: 'Terminé', cancelled: 'Annulé' }
  return labels[status] || status
}

const getFulfillmentColor = (status: string) => {
  const colors: Record<string, string> = { not_fulfilled: 'gray', fulfilled: 'cyan', shipped: 'indigo', delivered: 'green' }
  return colors[status] || 'gray'
}

const getFulfillmentLabel = (status: string) => {
  const labels: Record<string, string> = { not_fulfilled: 'Non traité', fulfilled: 'Prêt', shipped: 'En livraison', delivered: 'Livré' }
  return labels[status] || status
}

// Fetch on mount
onMounted(() => {
  fetchOrder()
  fetchLivreurs()
})

useHead({
  title: computed(() => order.value ? `Commande #${order.value.display_id || order.value.id.slice(0, 8).toUpperCase()} - Administration` : 'Chargement...')
})
</script>
