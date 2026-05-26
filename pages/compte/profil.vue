<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Mon compte</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">Profil</span>
      </nav>

      <div class="mb-12 border-b border-border pb-8">
        <h1 class="text-4xl font-black text-foreground tracking-tight">Mon profil</h1>
        <p class="text-muted-foreground font-medium mt-2">Gérez vos coordonnées utilisées pour votre compte et vos commandes.</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-10">
        <div class="lg:col-span-1">
          <div class="bg-card rounded-lg shadow-sm border border-border overflow-hidden text-center sticky top-32">
             <div class="px-8 pt-10 pb-8 relative z-10">
               <div class="relative w-24 h-24 mx-auto mb-6">
                 <div class="absolute inset-0 bg-muted/50 border border-border rounded-full flex items-center justify-center text-foreground text-3xl font-bold shadow-sm">
                   {{ authStore.initials }}
                 </div>
               </div>
               
               <h2 class="text-xl font-bold text-foreground tracking-tight">{{ authStore.fullName }}</h2>
               <p class="text-muted-foreground text-xs font-medium mt-1">{{ authStore.user?.email }}</p>
             </div>
            
             <div class="px-8 py-5 bg-muted/30 border-t border-border flex justify-between items-center text-left">
               <div>
                  <p class="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Membre depuis</p>
                  <p class="text-sm font-semibold text-foreground">{{ memberSince }}</p>
               </div>
               <div class="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                  <ShieldCheckIcon class="w-5 h-5" />
               </div>
             </div>
          </div>
        </div>

        <!-- Profile Form Controls -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div class="p-8 sm:p-10 border-b border-border/50 bg-muted/30">
              <h3 class="text-xl font-black text-foreground tracking-tight">Coordonnées de base</h3>
              <p class="text-sm font-medium text-muted-foreground mt-1">Utilisées pour identifier votre compte et traiter vos demandes.</p>
            </div>

            <form @submit.prevent="handleUpdateProfile" class="p-8 sm:p-10 space-y-8">
              <!-- Success Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-if="showSuccess" class="p-5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-4">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircleIcon class="w-5 h-5 text-green-600" />
                  </div>
                  <p class="text-sm font-bold text-green-800">Vos coordonnées ont été mises à jour.</p>
                </div>
              </Transition>

               <!-- Error Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-if="error" class="p-5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-4">
                   <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircleIcon class="w-5 h-5 text-red-600" />
                  </div>
                  <p class="text-sm font-bold text-red-800">{{ error }}</p>
                </div>
              </Transition>

              <div class="grid sm:grid-cols-2 gap-8">
                <div class="relative">
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="peer checkout-input"
                    placeholder=" "
                    :disabled="isLoading"
                  />
                  <label for="firstName" class="checkout-label">Prénom</label>
                </div>
                <div class="relative">
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="peer checkout-input"
                    placeholder=" "
                    :disabled="isLoading"
                  />
                  <label for="lastName" class="checkout-label">Nom de famille</label>
                </div>
              </div>

              <div class="relative">
                <input
                  id="email"
                  :value="authStore.user?.email"
                  type="email"
                  disabled
                  placeholder=" "
                  class="peer checkout-input bg-muted border-transparent text-muted-foreground/60 cursor-not-allowed"
                />
                <label for="email" class="checkout-label bg-transparent">Adresse email</label>
                <div class="absolute right-4 top-1/2 -translate-y-1/2">
                   <LockIcon class="w-4 h-4 text-muted-foreground/40" />
                </div>
              </div>

              <div class="relative">
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder=" "
                  class="peer checkout-input"
                  :disabled="isLoading"
                />
                <label for="phone" class="checkout-label">Téléphone de contact</label>
              </div>

              <div class="flex justify-end pt-4 border-t border-border/50 mt-8">
                <button
                  type="submit"
                  :disabled="isLoading || !hasChanges"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-8 w-full sm:w-auto mt-2"
                >
                  <LoaderIcon v-if="isLoading" class="w-5 h-5 animate-spin text-brand-foreground/60 mr-2" />
                  <SaveIcon v-else class="w-5 h-5 text-brand-foreground mr-2" />
                  {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>

          <div class="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div class="p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 class="text-lg font-bold text-foreground tracking-tight flex items-center gap-3">
                   <ShieldCheckIcon class="w-5 h-5" /> Accès au compte
                </h3>
                <p class="text-sm font-medium text-muted-foreground mt-2">La connexion utilise un code reçu par email. Déconnectez-vous après utilisation d'un appareil partagé.</p>
              </div>
              <button
                @click="handleLogout"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent h-10 px-4 py-2 shrink-0"
              >
                <LogOutIcon class="w-4 h-4 mr-2" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Save as SaveIcon,
  Loader as LoaderIcon,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
  LogOut as LogOutIcon,
} from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Mon profil | Dounia Market',
  description: 'Gérez les coordonnées associées à votre compte Dounia Market.',
})

const authStore = useAuthStore()

// Form state
const form = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  phone: authStore.user?.phone || '',
})

const isLoading = ref(false)
const showSuccess = ref(false)
const error = ref('')

// Computed
const memberSince = computed(() => {
  const createdAt = authStore.user?.createdAt
  if (createdAt) {
    return new Date(createdAt).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    })
  }
  return 'Récemment'
})

const hasChanges = computed(() => {
  return (
    form.firstName !== (authStore.user?.firstName || '') ||
    form.lastName !== (authStore.user?.lastName || '') ||
    form.phone !== (authStore.user?.phone || '')
  )
})

watch(() => authStore.user, (user) => {
  if (user) {
    form.firstName = user.firstName || ''
    form.lastName = user.lastName || ''
    form.phone = user.phone || ''
  }
}, { immediate: true })

async function handleUpdateProfile() {
  if (!hasChanges.value) return
  
  isLoading.value = true
  error.value = ''
  showSuccess.value = false
  
  const result = await authStore.updateProfile({
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
  })
  
  isLoading.value = false
  
  if (result.success) {
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } else {
    error.value = result.error || 'Impossible de mettre à jour vos coordonnées.'
  }
}

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
.checkout-input {
  @apply block w-full px-4 pt-6 pb-2 text-sm font-medium text-foreground bg-background border border-input rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all shadow-sm;
}

.checkout-label {
  @apply absolute text-muted-foreground font-medium text-xs duration-200 transform -translate-y-2 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-muted-foreground peer-focus:scale-[0.85] peer-focus:-translate-y-2 peer-focus:text-foreground pointer-events-none;
}
</style>
