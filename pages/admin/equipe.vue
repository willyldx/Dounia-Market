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
        <h1 class="text-2xl font-semibold text-zinc-950 sm:text-3xl">Équipe</h1>
        <p class="mt-1 text-sm text-zinc-500">Gestion des administrateurs et accès opérationnels.</p>
      </div>
      <UButton color="black" icon="i-lucide-user-plus" class="h-10 justify-center font-medium" @click="showAddModal = true">
        Ajouter un admin
      </UButton>
    </header>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <div
        v-for="stat in teamStats"
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

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div class="border-b border-zinc-100 px-4 py-4 sm:px-5">
          <h2 class="font-semibold text-zinc-950">Accès administration</h2>
          <p class="mt-0.5 text-xs text-zinc-500">Comptes autorisés à gérer les opérations.</p>
        </div>

        <div v-if="loading" class="flex min-h-[210px] items-center justify-center">
          <UIcon name="i-lucide-loader-2" class="h-7 w-7 animate-spin text-zinc-400" />
        </div>

        <div v-else class="divide-y divide-zinc-100">
          <div class="bg-amber-50/40 px-4 py-4 sm:px-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <span class="text-sm font-semibold text-amber-800">{{ authStore.initials }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="truncate font-medium text-zinc-950">{{ authStore.fullName }}</p>
                    <UBadge color="amber" variant="soft" size="xs">Direction</UBadge>
                  </div>
                  <p class="truncate text-sm text-zinc-500">{{ authStore.user?.email || '-' }}</p>
                </div>
              </div>
              <span class="text-xs font-medium text-zinc-500">Votre compte</span>
            </div>
          </div>

          <div v-for="admin in admins" :key="admin.id" class="px-4 py-4 hover:bg-zinc-50 sm:px-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                  <span class="text-sm font-semibold text-sky-700">{{ getInitials(admin) }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="truncate font-medium text-zinc-950">{{ getName(admin) }}</p>
                    <UBadge color="sky" variant="soft" size="xs">Administrateur</UBadge>
                  </div>
                  <p class="truncate text-sm text-zinc-500">{{ admin.email || '-' }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between gap-3 sm:justify-end">
                <p class="whitespace-nowrap text-xs text-zinc-500">Ajouté le {{ formatDate(admin.created_at) }}</p>
                <UButton
                  color="red"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-user-minus"
                  class="font-medium"
                  @click="demoteAdmin(admin)"
                >
                  Retirer
                </UButton>
              </div>
            </div>
          </div>

          <div v-if="admins.length === 0" class="flex min-h-[150px] flex-col items-center justify-center p-8 text-center">
            <Icon name="lucide:user-cog" class="mb-3 h-8 w-8 text-zinc-300" />
            <p class="text-sm font-medium text-zinc-700">Aucun autre administrateur</p>
            <p class="mt-1 text-xs text-zinc-500">Ajoutez un compte pour répartir le traitement des commandes.</p>
          </div>
        </div>
      </section>

      <section class="h-fit overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div class="border-b border-zinc-100 px-4 py-4 sm:px-5">
          <h2 class="font-semibold text-zinc-950">Livraison</h2>
          <p class="mt-0.5 text-xs text-zinc-500">Accès à la gestion des livreurs.</p>
        </div>
        <div class="p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
              <Icon name="lucide:truck" class="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p class="text-2xl font-semibold text-zinc-950">{{ livreursCount }}</p>
              <p class="text-xs text-zinc-500">Livreur(s) actif(s)</p>
            </div>
          </div>
          <NuxtLink
            to="/admin/livreurs"
            class="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Icon name="lucide:truck" class="h-4 w-4" />
            Gérer les livreurs
          </NuxtLink>
        </div>
      </section>
    </div>

    <UModal v-model="showAddModal">
      <div class="p-6">
        <div class="mb-5">
          <h3 class="text-lg font-semibold text-zinc-950">Ajouter un administrateur</h3>
          <p class="mt-1 text-sm text-zinc-500">Sélectionnez un utilisateur existant à promouvoir.</p>
        </div>

        <label class="mb-1.5 block text-sm font-medium text-zinc-700">Utilisateur</label>
        <USelectMenu
          v-model="selectedUser"
          :options="availableUsers"
          option-attribute="label"
          value-attribute="value"
          placeholder="Sélectionner un utilisateur"
          searchable
          class="mb-6"
        />

        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="outline" @click="showAddModal = false">Annuler</UButton>
          <UButton color="black" icon="i-lucide-user-plus" :loading="saving" :disabled="!selectedUser" @click="promoteToAdmin">
            Promouvoir
          </UButton>
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
const toast = useToast()
const api = useBackendApi()

if (!authStore.isSuperAdmin) {
  navigateTo('/admin')
}

const loading = ref(true)
const saving = ref(false)
const admins = ref<any[]>([])
const livreursCount = ref(0)
const showAddModal = ref(false)
const selectedUser = ref<string | null>(null)
const availableUsers = ref<{ label: string; value: string }[]>([])

const teamStats = computed(() => [
  { label: 'Administrateurs', value: admins.value.length + 1, icon: 'lucide:user-cog', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Livreurs actifs', value: livreursCount.value, icon: 'lucide:truck', bgColor: 'bg-sky-50', iconColor: 'text-sky-700' },
  { label: 'Utilisateurs éligibles', value: availableUsers.value.length, icon: 'lucide:user-plus', bgColor: 'bg-zinc-100', iconColor: 'text-zinc-700' }
])

const fetchTeam = async () => {
  loading.value = true
  try {
    const data = await api.adminTeam()
    admins.value = data.admins || []
    livreursCount.value = data.livreurs_count || 0
    availableUsers.value = data.available_users || []
  } catch (error) {
    console.error('Error fetching team:', error)
    toast.add({ title: 'Erreur', description: "Impossible de charger l'équipe", color: 'red' })
  } finally {
    loading.value = false
  }
}

const promoteToAdmin = async () => {
  if (!selectedUser.value) return

  saving.value = true
  try {
    await api.adminPromoteTeam(selectedUser.value, 'admin')
    toast.add({ title: 'Succès', description: 'Utilisateur promu administrateur', color: 'green' })
    showAddModal.value = false
    selectedUser.value = null
    await fetchTeam()
  } catch (error) {
    console.error('Error promoting user:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de promouvoir cet utilisateur', color: 'red' })
  } finally {
    saving.value = false
  }
}

const demoteAdmin = async (admin: any) => {
  if (!confirm(`Retirer les droits admin de ${getName(admin)} ?`)) return

  try {
    await api.adminPromoteTeam(admin.id, 'client')
    toast.add({ title: 'Succès', description: 'Droits admin retirés', color: 'green' })
    await fetchTeam()
  } catch (error) {
    console.error('Error demoting admin:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de retirer les droits', color: 'red' })
  }
}

const getInitials = (user: any) => {
  return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || '?'
}

const getName = (user: any) => {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Utilisateur sans nom'
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return '-'
  return parsedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchTeam()
})

useHead({
  title: 'Équipe - Administration'
})
</script>
