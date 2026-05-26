<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Opérations</p>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Commandes</h1>
        <p class="mt-1 text-sm text-zinc-500">Préparation, affectation et livraison des commandes locales.</p>
      </div>
      <UButton
        @click="fetchOrders"
        color="gray"
        variant="outline"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        class="h-10 font-medium"
      >
        Actualiser
      </UButton>
    </header>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="stat in orderStats"
        :key="stat.label"
        class="relative min-h-[104px] rounded-lg border border-zinc-200 bg-white p-4"
      >
        <p class="pr-10 text-xs font-medium text-zinc-500 sm:text-sm">{{ stat.label }}</p>
        <p class="mt-3 text-2xl font-semibold text-zinc-950">{{ stat.value }}</p>
        <div :class="['absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg', stat.bgColor]">
          <Icon :name="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
        </div>
      </div>
    </div>

    <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div class="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-semibold text-zinc-950">File opérationnelle</h2>
          <p class="mt-0.5 text-xs text-zinc-500">{{ filteredOrders.length }} commande(s) affichée(s)</p>
        </div>
        <div class="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <UInput
            v-model="search"
            placeholder="N° commande, client, destinataire"
            icon="i-lucide-search"
            class="w-full sm:min-w-64"
            size="md"
          >
            <template #trailing>
              <UButton v-show="search" color="gray" variant="link" icon="i-lucide-x" :padded="false" @click="search = ''" />
            </template>
          </UInput>
          <USelectMenu
            v-model="statusFilter"
            :options="statusOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="Commande"
            class="w-full sm:w-40"
            size="md"
          />
          <USelectMenu
            v-model="fulfillmentFilter"
            :options="fulfillmentOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="Livraison"
            class="w-full sm:w-44"
            size="md"
          />
          <UButton v-if="hasActiveFilters" @click="clearFilters" color="gray" variant="ghost" icon="i-lucide-filter-x" class="h-10">
            Effacer
          </UButton>
        </div>
      </div>

      <div v-if="loading" class="flex min-h-[220px] items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
      </div>

      <div v-else-if="filteredOrders.length === 0" class="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
        <Icon name="lucide:package-open" class="mb-3 h-8 w-8 text-zinc-300" />
        <p class="text-sm font-medium text-zinc-800">Aucune commande trouvée</p>
        <p class="mt-1 text-xs text-zinc-500">Modifiez les filtres ou actualisez la file.</p>
      </div>

      <div v-else>
        <div class="hidden overflow-x-auto lg:block">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold text-zinc-500">
              <tr>
                <th scope="col" class="px-5 py-3">Commande</th>
                <th scope="col" class="px-5 py-3">Client / destinataire</th>
                <th scope="col" class="px-5 py-3">Commande</th>
                <th scope="col" class="px-5 py-3">Livraison</th>
                <th scope="col" class="px-5 py-3">Total</th>
                <th scope="col" class="px-5 py-3">Livreur</th>
                <th scope="col" class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="order in pagedOrders" :key="order.id" class="hover:bg-zinc-50">
                <td class="whitespace-nowrap px-5 py-3">
                  <NuxtLink :to="`/admin/commandes/${order.id}`" class="font-medium text-dounia-500 hover:text-amber-700">
                    #{{ order.display_id || order.id.slice(0, 8).toUpperCase() }}
                  </NuxtLink>
                  <p class="mt-0.5 text-xs text-zinc-500">{{ formatDate(order.created_at) }}</p>
                </td>
                <td class="max-w-[250px] px-5 py-3">
                  <p class="truncate font-medium text-zinc-950">{{ order.customer_first_name }} {{ order.customer_last_name }}</p>
                  <p class="truncate text-xs text-zinc-500">Pour {{ order.recipient_name || '-' }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3">
                  <UBadge :color="getStatusColor(order.status)" variant="soft" size="sm">
                    {{ getStatusLabel(order.status) }}
                  </UBadge>
                </td>
                <td class="whitespace-nowrap px-5 py-3">
                  <UBadge :color="getFulfillmentColor(order.fulfillment_status)" variant="soft" size="sm">
                    {{ getFulfillmentLabel(order.fulfillment_status) }}
                  </UBadge>
                </td>
                <td class="whitespace-nowrap px-5 py-3 font-medium text-zinc-950">{{ formatPrice(order.total) }}</td>
                <td class="whitespace-nowrap px-5 py-3 text-zinc-600">
                  <span v-if="order.assigned_to" class="inline-flex items-center gap-1.5">
                    <Icon name="lucide:truck" class="h-4 w-4 text-sky-700" />
                    Assigné
                  </span>
                  <span v-else class="text-zinc-400">Non assigné</span>
                </td>
                <td class="whitespace-nowrap px-5 py-3">
                  <div class="flex justify-end gap-1">
                    <UButton :to="`/admin/commandes/${order.id}`" color="gray" variant="ghost" icon="i-lucide-eye" size="sm" title="Ouvrir" aria-label="Ouvrir la commande" />
                    <UButton @click="openAssignModal(order)" color="gray" variant="ghost" icon="i-lucide-user-plus" size="sm" title="Assigner un livreur" aria-label="Assigner un livreur" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-zinc-100 lg:hidden">
          <article v-for="order in pagedOrders" :key="order.id" class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <NuxtLink :to="`/admin/commandes/${order.id}`" class="font-medium text-dounia-500">
                  #{{ order.display_id || order.id.slice(0, 8).toUpperCase() }}
                </NuxtLink>
                <p class="mt-1 text-xs text-zinc-500">{{ formatDate(order.created_at) }}</p>
              </div>
              <p class="shrink-0 text-sm font-semibold text-zinc-950">{{ formatPrice(order.total) }}</p>
            </div>
            <p class="mt-3 truncate text-sm font-medium text-zinc-950">{{ order.recipient_name || '-' }}</p>
            <p class="truncate text-xs text-zinc-500">Client : {{ order.customer_first_name }} {{ order.customer_last_name }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <UBadge :color="getStatusColor(order.status)" variant="soft" size="sm">{{ getStatusLabel(order.status) }}</UBadge>
              <UBadge :color="getFulfillmentColor(order.fulfillment_status)" variant="soft" size="sm">{{ getFulfillmentLabel(order.fulfillment_status) }}</UBadge>
            </div>
            <div class="mt-4 flex gap-2">
              <UButton :to="`/admin/commandes/${order.id}`" color="gray" variant="outline" icon="i-lucide-eye" size="sm" class="flex-1">
                Ouvrir
              </UButton>
              <UButton @click="openAssignModal(order)" color="gray" variant="outline" icon="i-lucide-user-plus" size="sm" class="flex-1">
                Assigner
              </UButton>
            </div>
          </article>
        </div>

        <div v-if="totalPages > 1" class="flex flex-col gap-3 border-t border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-zinc-500">{{ filteredOrders.length }} commande(s) sur {{ orders.length }}</p>
          <UPagination v-model="currentPage" :total="filteredOrders.length" :page-count="pageSize" />
        </div>
      </div>
    </section>

    <UModal v-model="showAssignModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-zinc-950">Assigner un livreur</h3>
        <p class="mb-5 mt-1 text-sm text-zinc-500">
          Commande #{{ selectedOrder?.display_id || selectedOrder?.id?.slice(0, 8).toUpperCase() }}
        </p>
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
          <UButton color="black" icon="i-lucide-user-plus" :loading="assigning" @click="assignLivreur">Assigner</UButton>
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

const api = useBackendApi()
const toast = useToast()

// State
const loading = ref(true)
const orders = ref<any[]>([])
const search = ref('')
const statusFilter = ref<string | null>(null)
const fulfillmentFilter = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 20

// Assign modal
const showAssignModal = ref(false)
const selectedOrder = ref<any | null>(null)
const selectedLivreur = ref<string | null>(null)
const livreurs = ref<{ label: string; value: string }[]>([])
const assigning = ref(false)

// Filter options
const statusOptions = [
  { label: 'Tous', value: null },
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'processing' },
  { label: 'Terminé', value: 'completed' },
  { label: 'Annulé', value: 'cancelled' }
]

const fulfillmentOptions = [
  { label: 'Tous', value: null },
  { label: 'Non traité', value: 'not_fulfilled' },
  { label: 'Prêt', value: 'fulfilled' },
  { label: 'En livraison', value: 'shipped' },
  { label: 'Livré', value: 'delivered' }
]

// Computed
const hasActiveFilters = computed(() => {
  return statusFilter.value || fulfillmentFilter.value || search.value
})

const filteredOrders = computed(() => {
  let result = orders.value

  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(o => 
      String(o.display_id || o.id || '').toLowerCase().includes(s) ||
      o.email?.toLowerCase().includes(s) ||
      o.customer_first_name?.toLowerCase().includes(s) ||
      o.customer_last_name?.toLowerCase().includes(s) ||
      o.recipient_name?.toLowerCase().includes(s)
    )
  }

  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }

  if (fulfillmentFilter.value) {
    result = result.filter(o => o.fulfillment_status === fulfillmentFilter.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})
const orderStats = computed(() => [
  { label: 'Chargées', value: orders.value.length, icon: 'lucide:package', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' },
  { label: 'À préparer', value: orders.value.filter(order => order.fulfillment_status === 'not_fulfilled').length, icon: 'lucide:clipboard-list', bgColor: 'bg-amber-50', iconColor: 'text-amber-700' },
  { label: 'En livraison', value: orders.value.filter(order => order.fulfillment_status === 'shipped').length, icon: 'lucide:truck', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Livrées', value: orders.value.filter(order => order.fulfillment_status === 'delivered').length, icon: 'lucide:package-check', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-700' }
])

watch([search, statusFilter, fulfillmentFilter], () => {
  currentPage.value = 1
})

// Methods
const fetchOrders = async () => {
  loading.value = true
  try {
    const result = await api.adminOrders({ limit: 200 })
    orders.value = result?.data || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les commandes', color: 'red' })
  } finally {
    loading.value = false
  }
}

const fetchLivreurs = async () => {
  try {
    const result = await api.adminLivreurs()
    if (result?.data) {
      livreurs.value = result.data.map((l: any) => ({
        label: `${l.first_name} ${l.last_name}`,
        value: l.user_id
      }))
    }
  } catch (error) {
    console.error('Error fetching livreurs:', error)
  }
}

const openAssignModal = (order: any) => {
  selectedOrder.value = order
  selectedLivreur.value = order.assigned_to || null
  showAssignModal.value = true
}

const assignLivreur = async () => {
  if (!selectedOrder.value || !selectedLivreur.value) return

  assigning.value = true
  try {
    await api.adminOrderUpdate(selectedOrder.value.id, {
      assigned_to: selectedLivreur.value
    })

    toast.add({ title: 'Succès', description: 'Livreur assigné avec succès', color: 'green' })
    showAssignModal.value = false
    fetchOrders()
  } catch (error) {
    console.error('Error assigning livreur:', error)
    toast.add({ title: 'Erreur', description: "Impossible d'assigner le livreur", color: 'red' })
  } finally {
    assigning.value = false
  }
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = null
  fulfillmentFilter.value = null
}

// Helpers
const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'amber',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getFulfillmentColor = (status: string) => {
  const colors: Record<string, string> = {
    not_fulfilled: 'gray',
    fulfilled: 'cyan',
    shipped: 'indigo',
    delivered: 'green'
  }
  return colors[status] || 'gray'
}

const getFulfillmentLabel = (status: string) => {
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
  fetchOrders()
  fetchLivreurs()
})

useHead({
  title: 'Commandes - Administration'
})
</script>
