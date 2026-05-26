<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mon profil</h1>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
          <span class="text-2xl font-bold text-amber-800">{{ authStore.initials }}</span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ authStore.fullName }}</h2>
          <p class="text-gray-500">{{ authStore.user?.email }}</p>
          <UBadge color="amber" variant="soft" class="mt-1">🚚 Livreur</UBadge>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ agentStats.totalDeliveries ?? '--' }}</p>
          <p class="text-xs text-gray-500">Livraisons</p>
        </div>
        <div class="text-center">
          <div class="flex items-center justify-center gap-1">
            <Icon name="lucide:star" class="w-5 h-5 text-amber-500 fill-current" />
            <p class="text-2xl font-bold text-gray-900">{{ agentStats.rating ?? '--' }}</p>
          </div>
          <p class="text-xs text-gray-500">Note</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ agentStats.zone || '--' }}</p>
          <p class="text-xs text-gray-500">Zone</p>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
      <h3 class="font-semibold text-gray-900 mb-4">Informations de contact</h3>
      
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="lucide:phone" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Téléphone</p>
            <p class="font-medium text-gray-900">{{ agentStats.phone || authStore.user?.phone || '-' }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="lucide:mail" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Email</p>
            <p class="font-medium text-gray-900">{{ authStore.user?.email }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="lucide:map-pin" class="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Zone de livraison</p>
            <p class="font-medium text-gray-900">{{ agentStats.zone || 'Non renseignée' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="space-y-3">
      <button 
        @click="showEditModal = true"
        class="w-full flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <Icon name="lucide:edit" class="w-5 h-5 text-dounia-500" />
        </div>
        <span class="flex-1 text-left font-medium text-gray-900">Modifier mon profil</span>
        <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
      </button>

      <button 
        @click="authStore.logout()"
        class="w-full flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <Icon name="lucide:log-out" class="w-5 h-5 text-red-600" />
        </div>
        <span class="flex-1 text-left font-medium text-red-600">Se déconnecter</span>
        <Icon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- Edit Modal -->
    <UModal v-model="showEditModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Modifier mon profil</h3>
        
        <div class="space-y-4">
          <UFormGroup label="Prénom">
            <UInput v-model="editForm.firstName" placeholder="Prénom" />
          </UFormGroup>
          
          <UFormGroup label="Nom">
            <UInput v-model="editForm.lastName" placeholder="Nom" />
          </UFormGroup>
          
          <UFormGroup label="Téléphone">
            <UInput v-model="editForm.phone" placeholder="Téléphone" />
          </UFormGroup>
        </div>

        <div class="flex gap-3 mt-6">
          <UButton color="gray" variant="outline" class="flex-1" @click="showEditModal = false">
            Annuler
          </UButton>
          <UButton color="primary" class="flex-1" :loading="saving" @click="saveProfile">
            Enregistrer
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'livreur',
  middleware: ['livreur']
})

const authStore = useAuthStore()
const toast = useToast()

// State
const showEditModal = ref(false)
const saving = ref(false)
const agentStats = ref({
  totalDeliveries: null as number | null,
  rating: null as string | null,
  zone: null as string | null,
  phone: ''
})

// Edit form
const editForm = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  phone: authStore.user?.phone || ''
})

// Fetch agent stats
const fetchAgentStats = () => {
  if (!authStore.user) return

  // TODO: Populate delivery statistics once a backend source is available.
  agentStats.value.phone = authStore.user.phone || ''
}

// Save profile
const saveProfile = async () => {
  saving.value = true
  
  try {
    const result = await authStore.updateProfile({
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      phone: editForm.value.phone
    })

    if (result.success) {
      toast.add({ title: 'Succès', description: 'Profil mis à jour', color: 'green' })
      showEditModal.value = false
    } else {
      toast.add({ title: 'Erreur', description: result.error, color: 'red' })
    }
  } finally {
    saving.value = false
  }
}

// Watch for modal open to reset form
watch(showEditModal, (open) => {
  if (open) {
    editForm.value = {
      firstName: authStore.user?.firstName || '',
      lastName: authStore.user?.lastName || '',
      phone: authStore.user?.phone || agentStats.value.phone || ''
    }
  }
})

// Fetch on mount
onMounted(() => {
  fetchAgentStats()
})

useHead({
  title: 'Mon profil - Espace livreur'
})
</script>
