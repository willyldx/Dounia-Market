<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Relations clients</p>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Clients</h1>
        <p class="mt-1 text-sm text-zinc-500">Coordonnées et activité des clients enregistrés.</p>
      </div>
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <UInput
          v-model="search"
          placeholder="Nom, email ou téléphone"
          icon="i-lucide-search"
          class="w-full sm:w-64"
          size="md"
        >
          <template #trailing>
            <UButton v-show="search" color="gray" variant="link" icon="i-lucide-x" :padded="false" @click="search = ''" />
          </template>
        </UInput>
        <UButton
          color="gray"
          variant="outline"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          class="h-10 justify-center font-medium"
          @click="fetchClients"
        >
          Actualiser
        </UButton>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="stat in clientStats"
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
      <div class="border-b border-zinc-100 px-4 py-4 sm:px-5">
        <h2 class="text-base font-semibold text-zinc-950">Annuaire clients</h2>
        <p class="mt-0.5 text-xs text-zinc-500">{{ filteredClients.length }} client(s) affiché(s)</p>
      </div>

      <div v-if="loading" class="flex min-h-[200px] items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
      </div>

      <div v-else-if="filteredClients.length === 0" class="flex min-h-[210px] flex-col items-center justify-center p-8 text-center">
        <Icon name="lucide:users" class="mb-3 h-8 w-8 text-zinc-300" />
        <p class="text-sm font-medium text-zinc-800">Aucun client trouvé</p>
        <p class="mt-1 text-xs text-zinc-500">Modifiez votre recherche pour afficher d'autres clients.</p>
      </div>

      <div v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold text-zinc-500">
              <tr>
                <th scope="col" class="px-5 py-3">Client</th>
                <th scope="col" class="px-5 py-3">Téléphone</th>
                <th scope="col" class="px-5 py-3">Activité</th>
                <th scope="col" class="px-5 py-3">Total commandes</th>
                <th scope="col" class="px-5 py-3">Inscription</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-zinc-50">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                      <span class="text-sm font-semibold text-zinc-700">{{ getInitials(client) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate font-medium text-zinc-950">{{ getName(client) }}</p>
                      <p class="truncate text-xs text-zinc-500">{{ client.email || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-zinc-600">{{ client.phone || '-' }}</td>
                <td class="whitespace-nowrap px-5 py-3">
                  <UBadge :color="getActivityBadge(client).color" variant="soft" size="xs">
                    {{ getActivityBadge(client).label }}
                  </UBadge>
                </td>
                <td class="whitespace-nowrap px-5 py-3">
                  <p class="font-medium text-zinc-950">{{ client.totalOrders || 0 }} commande(s)</p>
                  <p class="text-xs text-zinc-500">{{ formatPrice(client.totalSpent || 0) }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-zinc-500">{{ formatDate(client.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-zinc-100 md:hidden">
          <article v-for="client in filteredClients" :key="client.id" class="p-4">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <span class="text-sm font-semibold text-zinc-700">{{ getInitials(client) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="truncate font-medium text-zinc-950">{{ getName(client) }}</p>
                  <UBadge :color="getActivityBadge(client).color" variant="soft" size="xs">
                    {{ getActivityBadge(client).label }}
                  </UBadge>
                </div>
                <p class="mt-0.5 truncate text-sm text-zinc-500">{{ client.email || '-' }}</p>
                <p class="mt-1 text-sm text-zinc-500">{{ client.phone || 'Téléphone non renseigné' }}</p>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 p-3 text-sm">
              <div>
                <p class="text-xs text-zinc-500">Commandes</p>
                <p class="mt-1 font-medium text-zinc-900">{{ client.totalOrders || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500">Total</p>
                <p class="mt-1 font-medium text-zinc-900">{{ formatPrice(client.totalSpent || 0) }}</p>
              </div>
            </div>
            <p class="mt-3 text-xs text-zinc-500">Inscrit le {{ formatDate(client.created_at) }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const api = useBackendApi()
const toast = useToast()

const loading = ref(true)
const search = ref('')
const clients = ref<any[]>([])

const filteredClients = computed(() => {
  if (!search.value.trim()) return clients.value

  const query = search.value.trim().toLowerCase()
  return clients.value.filter(client =>
    client.first_name?.toLowerCase().includes(query) ||
    client.last_name?.toLowerCase().includes(query) ||
    client.email?.toLowerCase().includes(query) ||
    client.phone?.toLowerCase().includes(query)
  )
})

const newThisMonth = computed(() => {
  const firstOfMonth = new Date()
  firstOfMonth.setDate(1)
  firstOfMonth.setHours(0, 0, 0, 0)

  return clients.value.filter(client => {
    const createdAt = new Date(client.created_at)
    return !Number.isNaN(createdAt.getTime()) && createdAt >= firstOfMonth
  }).length
})

const activeClients = computed(() => clients.value.filter(client => (client.totalOrders || 0) > 0).length)
const totalOrders = computed(() => clients.value.reduce((total, client) => total + (client.totalOrders || 0), 0))

const clientStats = computed(() => [
  { label: 'Total clients', value: clients.value.length, icon: 'lucide:users', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' },
  { label: 'Ont commandé', value: activeClients.value, icon: 'lucide:shopping-bag', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Nouveaux ce mois', value: newThisMonth.value, icon: 'lucide:user-plus', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Commandes', value: totalOrders.value, icon: 'lucide:package', bgColor: 'bg-amber-50', iconColor: 'text-amber-700' }
])

const fetchClients = async () => {
  loading.value = true
  try {
    const result = await api.adminClients()
    clients.value = result?.data || []
  } catch (error) {
    console.error('Error fetching clients:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les clients', color: 'red' })
  } finally {
    loading.value = false
  }
}

const getInitials = (client: any) => {
  return ((client.first_name?.[0] || '') + (client.last_name?.[0] || '')).toUpperCase() || '?'
}

const getName = (client: any) => {
  return [client.first_name, client.last_name].filter(Boolean).join(' ') || 'Client sans nom'
}

const getActivityBadge = (client: any) => {
  if ((client.totalOrders || 0) > 0) return { label: 'A commandé', color: 'sky' }
  return { label: 'Sans commande', color: 'gray' }
}

const formatPrice = (amount: number) => {
  return useCartStore().formatPrice(amount || 0)
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return '-'
  return parsedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchClients()
})

useHead({
  title: 'Clients - Administration'
})
</script>
