<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase text-amber-700">Équipe terrain</p>
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Livreurs</h1>
        <p class="mt-1 text-sm text-zinc-500">Affectations et activité des livreurs.</p>
      </div>
      <UButton
        v-if="authStore.isSuperAdmin"
        @click="showAddModal = true"
        color="black"
        icon="i-lucide-plus"
        class="h-10 font-medium"
      >
        Nouveau livreur
      </UButton>
    </header>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div v-for="stat in livreurStats" :key="stat.label" class="relative min-h-[104px] rounded-lg border border-zinc-200 bg-white p-4">
        <p class="pr-10 text-xs font-medium text-zinc-500 sm:text-sm">{{ stat.label }}</p>
        <p class="mt-3 text-2xl font-semibold text-zinc-950">{{ stat.value }}</p>
        <div :class="['absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg', stat.bgColor]">
          <Icon :name="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
        </div>
      </div>
    </div>

    <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div class="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 class="text-base font-semibold text-zinc-950">Registre des livreurs</h2>
          <p class="mt-0.5 text-xs text-zinc-500">{{ filteredLivreurs.length }} livreur(s) affiché(s)</p>
        </div>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <UInput
            v-model="search"
            placeholder="Nom, zone ou téléphone"
            icon="i-lucide-search"
            class="w-full sm:w-64"
            size="md"
          >
            <template #trailing>
              <UButton v-show="search" color="gray" variant="link" icon="i-lucide-x" :padded="false" @click="search = ''" />
            </template>
          </UInput>
          <USelectMenu
            v-model="activityFilter"
            :options="activityOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="Tous les statuts"
            class="w-full sm:w-44"
            size="md"
          />
        </div>
      </div>

      <div v-if="loading" class="flex min-h-[220px] items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
      </div>

      <div v-else-if="filteredLivreurs.length === 0" class="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
        <Icon name="lucide:truck" class="mb-3 h-8 w-8 text-zinc-300" />
        <p class="text-sm font-medium text-zinc-800">{{ livreurs.length ? 'Aucun livreur trouvé' : 'Aucun livreur enregistré' }}</p>
        <p class="mt-1 text-xs text-zinc-500">{{ livreurs.length ? 'Modifiez la recherche ou le filtre.' : 'Ajoutez un membre pour commencer les affectations.' }}</p>
        <UButton v-if="authStore.isSuperAdmin && !livreurs.length" @click="showAddModal = true" color="black" icon="i-lucide-plus" class="mt-5">
          Nouveau livreur
        </UButton>
      </div>

      <div v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold text-zinc-500">
              <tr>
                <th scope="col" class="px-5 py-3">Livreur</th>
                <th scope="col" class="px-5 py-3">Contact / zone</th>
                <th scope="col" class="px-5 py-3">Statut</th>
                <th scope="col" class="px-5 py-3">Livraisons</th>
                <th scope="col" class="px-5 py-3">Note</th>
                <th v-if="authStore.isSuperAdmin" scope="col" class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="livreur in filteredLivreurs" :key="livreur.id" class="hover:bg-zinc-50">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', livreur.is_active ? 'bg-emerald-50' : 'bg-zinc-100']">
                      <span :class="['text-sm font-semibold', livreur.is_active ? 'text-emerald-700' : 'text-zinc-500']">{{ getInitials(livreur) }}</span>
                    </div>
                    <p class="font-medium text-zinc-950">{{ livreur.first_name }} {{ livreur.last_name }}</p>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <p class="text-zinc-700">{{ livreur.phone || '-' }}</p>
                  <p class="text-xs text-zinc-500">{{ livreur.zone || '-' }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3">
                  <UBadge :color="livreur.is_active ? 'green' : 'gray'" variant="soft" size="sm">
                    {{ livreur.is_active ? 'Actif' : 'Inactif' }}
                  </UBadge>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-zinc-700">{{ livreur.total_deliveries || 0 }}</td>
                <td class="whitespace-nowrap px-5 py-3 text-zinc-700">
                  <span v-if="livreur.rating !== null && livreur.rating !== undefined" class="inline-flex items-center gap-1">
                    <Icon name="lucide:star" class="h-4 w-4 text-amber-500" />
                    {{ Number(livreur.rating).toFixed(1) }}
                  </span>
                  <span v-else class="text-zinc-400">-</span>
                </td>
                <td v-if="authStore.isSuperAdmin" class="whitespace-nowrap px-5 py-3">
                  <div class="flex justify-end gap-1">
                    <UButton
                      @click="toggleStatus(livreur)"
                      color="gray"
                      variant="ghost"
                      :icon="livreur.is_active ? 'i-lucide-pause' : 'i-lucide-play'"
                      size="sm"
                      :title="livreur.is_active ? 'Désactiver' : 'Activer'"
                      :aria-label="livreur.is_active ? 'Désactiver le livreur' : 'Activer le livreur'"
                    />
                    <UButton @click="removeLivreur(livreur)" color="red" variant="ghost" icon="i-lucide-trash-2" size="sm" title="Retirer" aria-label="Retirer le livreur" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-zinc-100 md:hidden">
          <article v-for="livreur in filteredLivreurs" :key="livreur.id" class="p-4">
            <div class="flex items-start gap-3">
              <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', livreur.is_active ? 'bg-emerald-50' : 'bg-zinc-100']">
                <span :class="['text-sm font-semibold', livreur.is_active ? 'text-emerald-700' : 'text-zinc-500']">{{ getInitials(livreur) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-sm font-medium text-zinc-950">{{ livreur.first_name }} {{ livreur.last_name }}</p>
                  <UBadge :color="livreur.is_active ? 'green' : 'gray'" variant="soft" size="xs">{{ livreur.is_active ? 'Actif' : 'Inactif' }}</UBadge>
                </div>
                <p class="mt-1 truncate text-sm text-zinc-500">{{ livreur.phone || '-' }} · {{ livreur.zone || '-' }}</p>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-4 text-xs text-zinc-500">
              <span class="inline-flex items-center gap-1"><Icon name="lucide:package-check" class="h-4 w-4" />{{ livreur.total_deliveries || 0 }} livraisons</span>
              <span v-if="livreur.rating !== null && livreur.rating !== undefined" class="inline-flex items-center gap-1"><Icon name="lucide:star" class="h-4 w-4 text-amber-500" />{{ Number(livreur.rating).toFixed(1) }}</span>
            </div>
            <div v-if="authStore.isSuperAdmin" class="mt-4 flex gap-2">
              <UButton
                @click="toggleStatus(livreur)"
                color="gray"
                variant="outline"
                :icon="livreur.is_active ? 'i-lucide-pause' : 'i-lucide-play'"
                size="sm"
                class="flex-1"
              >
                {{ livreur.is_active ? 'Désactiver' : 'Activer' }}
              </UButton>
              <UButton @click="removeLivreur(livreur)" color="red" variant="ghost" icon="i-lucide-trash-2" size="sm" aria-label="Retirer le livreur" />
            </div>
          </article>
        </div>
      </div>
    </section>

    <UModal v-model="showAddModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-zinc-950">Ajouter un livreur</h3>
        <p class="mb-5 mt-1 text-sm text-zinc-500">Associez un utilisateur existant à l'équipe de livraison.</p>
        <div class="space-y-4">
          <USelectMenu
            v-model="selectedUser"
            :options="availableUsers"
            option-attribute="label"
            value-attribute="value"
            placeholder="Sélectionner un utilisateur"
            searchable
          />
          <UInput v-model="newLivreurPhone" placeholder="Téléphone" icon="i-lucide-phone" />
          <UInput v-model="newLivreurZone" placeholder="Zone de livraison" icon="i-lucide-map-pin" />
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <UButton color="gray" variant="outline" @click="showAddModal = false">Annuler</UButton>
          <UButton color="black" icon="i-lucide-plus" :loading="saving" @click="addLivreur">Ajouter</UButton>
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

const authStore = useAuthStore()
const api = useBackendApi()
const toast = useToast()

// State
const loading = ref(true)
const saving = ref(false)
const livreurs = ref<any[]>([])
const search = ref('')
const activityFilter = ref<string | null>(null)

// Add modal
const showAddModal = ref(false)
const selectedUser = ref<string | null>(null)
const newLivreurPhone = ref('')
const newLivreurZone = ref("N'Djamena")
const availableUsers = ref<{ label: string; value: string }[]>([])
const activityOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Actifs', value: 'active' },
  { label: 'Inactifs', value: 'inactive' }
]

// Computed stats
const activeLivreurs = computed(() => livreurs.value.filter(l => l.is_active).length)
const trackedDeliveries = computed(() => livreurs.value.reduce((sum, l) => sum + (l.total_deliveries || 0), 0))
const averageRating = computed(() => {
  const ratedLivreurs = livreurs.value.filter(l => l.rating !== null && l.rating !== undefined)
  if (ratedLivreurs.length === 0) return '-'
  const total = ratedLivreurs.reduce((sum, l) => sum + Number(l.rating), 0)
  return `${(total / ratedLivreurs.length).toFixed(1)}/5`
})
const livreurStats = computed(() => [
  { label: 'Total livreurs', value: livreurs.value.length, icon: 'lucide:users', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' },
  { label: 'Actifs', value: activeLivreurs.value, icon: 'lucide:user-check', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  { label: 'Livraisons suivies', value: trackedDeliveries.value, icon: 'lucide:truck', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Note moyenne', value: averageRating.value, icon: 'lucide:star', bgColor: 'bg-amber-50', iconColor: 'text-amber-700' }
])
const filteredLivreurs = computed(() => {
  const term = search.value.trim().toLowerCase()
  return livreurs.value.filter((livreur) => {
    const matchesSearch = !term || [
      livreur.first_name,
      livreur.last_name,
      livreur.phone,
      livreur.zone
    ].some(value => String(value || '').toLowerCase().includes(term))
    const matchesActivity =
      !activityFilter.value ||
      (activityFilter.value === 'active' && livreur.is_active) ||
      (activityFilter.value === 'inactive' && !livreur.is_active)
    return matchesSearch && matchesActivity
  })
})

// Fetch livreurs
const fetchLivreurs = async () => {
  loading.value = true
  try {
    const result = await api.adminLivreurs()
    livreurs.value = result?.data || []
  } catch (error) {
    console.error('Error fetching livreurs:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les livreurs', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Fetch available users (clients who can be promoted to livreur)
const fetchAvailableUsers = async () => {
  try {
    const result = await api.adminClients()
    if (result?.data) {
      availableUsers.value = result.data.map((u: any) => ({
        label: `${u.first_name} ${u.last_name} (${u.email})`,
        value: u.id
      }))
    }
  } catch (error) {
    console.error('Error fetching available users:', error)
  }
}

// Add livreur
const addLivreur = async () => {
  if (!selectedUser.value || !newLivreurPhone.value) {
    toast.add({ title: 'Erreur', description: 'Veuillez remplir tous les champs', color: 'red' })
    return
  }

  saving.value = true
  try {
    // Find the selected user info
    const userInfo = availableUsers.value.find(u => u.value === selectedUser.value)
    const nameParts = (userInfo?.label || '').split(' ')
    
    await api.adminLivreurCreate({
      user_id: selectedUser.value,
      first_name: nameParts[0] || '',
      last_name: nameParts[1] || '',
      email: '',
      phone: newLivreurPhone.value,
      zone: newLivreurZone.value || "N'Djamena",
    })

    toast.add({ title: 'Succès', description: 'Livreur ajouté avec succès', color: 'green' })
    showAddModal.value = false
    selectedUser.value = null
    newLivreurPhone.value = ''
    newLivreurZone.value = "N'Djamena"
    fetchLivreurs()
    fetchAvailableUsers()
  } catch (error) {
    console.error('Error adding livreur:', error)
    toast.add({ title: 'Erreur', description: "Impossible d'ajouter le livreur", color: 'red' })
  } finally {
    saving.value = false
  }
}

// Toggle livreur status
const toggleStatus = async (livreur: any) => {
  try {
    await api.adminLivreurUpdate(livreur.id, { is_active: !livreur.is_active })
    toast.add({ title: 'Succès', description: 'Statut mis à jour', color: 'green' })
    fetchLivreurs()
  } catch (error) {
    console.error('Error toggling status:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de modifier le statut', color: 'red' })
  }
}

// Remove livreur
const removeLivreur = async (livreur: any) => {
  if (!confirm('Êtes-vous sûr de vouloir retirer ce livreur ?')) return

  try {
    await api.adminLivreurDelete(livreur.id)
    toast.add({ title: 'Succès', description: 'Livreur retiré', color: 'green' })
    fetchLivreurs()
    fetchAvailableUsers()
  } catch (error) {
    console.error('Error removing livreur:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de retirer le livreur', color: 'red' })
  }
}

// Helpers
const getInitials = (livreur: any) => {
  return ((livreur.first_name?.[0] || '') + (livreur.last_name?.[0] || '')).toUpperCase() || '?'
}

// Fetch on mount
onMounted(() => {
  fetchLivreurs()
  if (authStore.isSuperAdmin) {
    fetchAvailableUsers()
  }
})

useHead({
  title: 'Livreurs - Administration'
})
</script>
