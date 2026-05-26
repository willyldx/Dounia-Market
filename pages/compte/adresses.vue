<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-4xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Mon compte</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">Adresses</span>
      </nav>

      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 border-b border-border pb-8">
        <div>
          <h1 class="text-4xl font-black text-foreground tracking-tight">Mes bénéficiaires</h1>
          <p class="text-muted-foreground font-medium mt-2">Gérez les adresses de livraison locale à N'Djamena.</p>
        </div>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 shrink-0"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Nouveau bénéficiaire
        </button>
      </div>

      <!-- Addresses Grid -->
      <div v-if="isLoading" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
          <div class="h-5 bg-muted rounded-md w-32 mb-4"></div>
          <div class="h-4 bg-muted/50 rounded-md w-48 mb-3"></div>
          <div class="h-4 bg-muted/50 rounded-md w-40"></div>
        </div>
      </div>

      <div v-else-if="addresses.length === 0" class="bg-card rounded-lg border border-border p-12 text-center shadow-sm">
        <div class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPinIcon class="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 class="text-2xl font-black text-foreground mb-3 tracking-tight">Aucune adresse enregistrée</h3>
        <p class="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
          Ajoutez le quartier, un repère et un contact local pour votre bénéficiaire.
        </p>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 mt-2"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Ajouter un destinataire
        </button>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-6">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-card rounded-lg border overflow-hidden p-6 relative flex flex-col hover:shadow-md hover:border-border/80 transition-all duration-300 group shadow-sm"
          :class="address.isDefault ? 'border-brand/50' : 'border-border'"
        >
           <div v-if="address.isDefault" class="absolute top-0 left-0 right-0 h-1 bg-brand"></div>

          <!-- Address Content -->
          <div class="flex items-start justify-between mb-2">
             <div class="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border">
               <MapPinIcon class="w-5 h-5 text-foreground" />
             </div>
             <!-- Default Badge -->
             <span
               v-if="address.isDefault"
               class="text-[10px] uppercase font-bold tracking-widest bg-brand/10 text-brand px-2.5 py-1 rounded-md shadow-sm border border-brand/20"
             >
               Principal
             </span>
          </div>

          <div class="mt-4 flex-1">
            <p class="text-xl font-black text-foreground tracking-tight mb-2">
              {{ address.firstName }} {{ address.lastName }}
            </p>
            <p class="text-sm font-medium text-muted-foreground leading-relaxed mb-4">
              {{ address.address1 }}
              <span v-if="address.address2"><br />{{ address.address2 }}</span><br/>
              <span class="text-foreground font-bold mt-1 block">{{ address.city }}, {{ address.country }}</span>
            </p>
            <p v-if="address.phone" class="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-lg border border-border mt-2">
              <PhoneIcon class="w-4 h-4 text-muted-foreground/60" />
              <span class="text-xs font-bold font-mono tracking-widest text-foreground">{{ address.phone }}</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-6 pt-6 border-t border-border flex-wrap">
            <button
              @click="editAddress(address)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <EditIcon class="w-4 h-4 mr-2" /> Éditer
            </button>
            <button
              v-if="!address.isDefault"
              @click="setAsDefault(address.id)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <StarIcon class="w-4 h-4 mr-2" /> Principal
            </button>
            <button
              @click="confirmDelete(address)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-destructive hover:bg-destructive/10 h-9 px-3 ml-auto"
            >
               Supprimer
            </button>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-brand/5 rounded-lg border border-brand/20 p-6 flex items-start gap-4">
        <div class="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
          <InfoIcon class="w-5 h-5 text-brand" />
        </div>
        <div>
          <p class="text-sm font-bold text-foreground mb-2">Zone de livraison</p>
          <p class="text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
            La livraison est proposée localement à <b class="text-foreground">N'Djamena</b>, selon les zones couvertes. Zones et frais seront confirmés avant l'ouverture publique du service.
          </p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 backdrop-blur-none"
        enter-to-class="opacity-100 backdrop-blur-md"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 backdrop-blur-md"
        leave-to-class="opacity-0 backdrop-blur-none"
      >
        <div v-if="showModal" class="fixed inset-0 bg-background/80 z-[100] flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-400 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="showModal" class="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-sm border border-border relative">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 sm:p-8 border-b border-border bg-muted/30">
                <h3 class="text-xl font-bold text-foreground tracking-tight">
                  {{ editingAddress ? 'Modifier le bénéficiaire' : 'Nouveau bénéficiaire' }}
                </h3>
                <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                  <XIcon class="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-6">
                <div class="grid sm:grid-cols-2 gap-8">
                  <div class="relative">
                    <input
                      id="mFirstName"
                      v-model="form.firstName"
                      type="text"
                      required
                      class="peer checkout-input"
                      placeholder=" "
                    />
                    <label for="mFirstName" class="checkout-label">Prénom</label>
                  </div>
                  <div class="relative">
                    <input
                      id="mLastName"
                      v-model="form.lastName"
                      type="text"
                      required
                      class="peer checkout-input"
                      placeholder=" "
                    />
                    <label for="mLastName" class="checkout-label">Nom de famille</label>
                  </div>
                </div>

                <div class="relative">
                  <input
                    id="mAddress1"
                    v-model="form.address1"
                    type="text"
                    required
                    placeholder=" "
                    class="peer checkout-input"
                  />
                  <label for="mAddress1" class="checkout-label">Quartier, rue ou repère</label>
                </div>

                <div class="relative">
                  <input
                    id="mAddress2"
                    v-model="form.address2"
                    type="text"
                    placeholder=" "
                    class="peer checkout-input"
                  />
                  <label for="mAddress2" class="checkout-label">Complément (Optionnel)</label>
                </div>

                <div class="grid sm:grid-cols-2 gap-8">
                  <div class="relative">
                    <select
                      id="mCity"
                      v-model="form.city"
                      required
                      class="peer checkout-input appearance-none"
                    >
                      <option value="N'Djamena">N'Djamena</option>
                    </select>
                    <label for="mCity" class="checkout-label">Ville de livraison</label>
                  </div>
                  <div class="relative">
                    <input
                      id="mCountry"
                      v-model="form.country"
                      type="text"
                      disabled
                      placeholder=" "
                      class="peer checkout-input bg-muted border-transparent text-muted-foreground/50 cursor-not-allowed"
                    />
                    <label for="mCountry" class="checkout-label bg-transparent">Pays</label>
                  </div>
                </div>

                <div class="relative">
                  <input
                    id="mPhone"
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder=" "
                    class="peer checkout-input"
                  />
                  <label for="mPhone" class="checkout-label">Téléphone du bénéficiaire</label>
                </div>

                <div class="pt-4 border-t border-border flex items-center gap-3 cursor-pointer group" @click="form.isDefault = !form.isDefault">
                  <div class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                       :class="form.isDefault ? 'bg-brand border-brand text-brand-foreground' : 'border-input bg-background'">
                     <CheckIcon v-if="form.isDefault" class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Définir comme adresse principale
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <button
                    type="button"
                    @click="closeModal"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 w-full sm:w-auto"
                  >
                    <LoaderIcon v-if="isSaving" class="w-4 h-4 animate-spin mr-2" />
                    {{ isSaving ? 'Enregistrement...' : (editingAddress ? 'Sauvegarder' : 'Ajouter') }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteModal" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div class="bg-card rounded-lg max-w-sm w-full p-8 relative overflow-hidden shadow-sm border border-border">
             <div class="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
            <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrashIcon class="w-8 h-8 text-destructive" />
            </div>
            <h3 class="text-xl font-bold text-foreground text-center mb-2 tracking-tight">Supprimer ?</h3>
            <p class="text-muted-foreground text-sm text-center mb-6">
              Cette adresse sera supprimée de votre carnet.
            </p>
            <div class="flex flex-col gap-2">
              <button
                @click="handleDelete"
                :disabled="isDeleting"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 w-full"
              >
                <LoaderIcon v-if="isDeleting" class="w-4 h-4 animate-spin mr-2" />
                {{ isDeleting ? 'Effacement...' : 'Confirmer' }}
              </button>
              <button
                @click="showDeleteModal = false"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon,
  MapPin as MapPinIcon,
  Plus as PlusIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Trash as TrashIcon,
  Info as InfoIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Check as CheckIcon,
} from 'lucide-vue-next'
import type { Address } from '~/types'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Mes adresses | Dounia Market',
  description: 'Gérez les adresses de livraison de vos bénéficiaires à N\'Djamena.',
})

const authStore = useAuthStore()

// State
const addresses = ref<Address[]>([])
const isLoading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingAddress = ref<Address | null>(null)
const deletingAddress = ref<Address | null>(null)
const isSaving = ref(false)
const isDeleting = ref(false)

// Form
const form = reactive({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: "N'Djamena",
  country: 'Tchad',
  phone: '',
  isDefault: false,
})

watch(() => authStore.user?.addresses, (newAddresses) => {
  if (newAddresses) {
    addresses.value = newAddresses
    isLoading.value = false
  }
}, { immediate: true })

function openAddModal() {
  editingAddress.value = null
  resetForm()
  showModal.value = true
}

function editAddress(address: Address) {
  editingAddress.value = address
  form.firstName = address.firstName
  form.lastName = address.lastName
  form.address1 = address.address1
  form.address2 = address.address2 || ''
  form.city = address.city
  form.country = address.country
  form.phone = address.phone || ''
  form.isDefault = address.isDefault || false
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  setTimeout(() => {
    editingAddress.value = null
    resetForm()
  }, 300) // wait for animation
}

function resetForm() {
  form.firstName = authStore.user?.firstName || ''
  form.lastName = authStore.user?.lastName || ''
  form.address1 = ''
  form.address2 = ''
  form.city = "N'Djamena"
  form.country = 'Tchad'
  form.phone = ''
  form.isDefault = addresses.value.length === 0
}

function confirmDelete(address: Address) {
  deletingAddress.value = address
  showDeleteModal.value = true
}

async function handleSubmit() {
  isSaving.value = true

  try {
    if (editingAddress.value) {
      // Update existing
      await authStore.updateAddress(editingAddress.value.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        address1: form.address1,
        address2: form.address2 || undefined,
        city: form.city,
        country: form.country,
        phone: form.phone,
        isDefault: form.isDefault,
      })
    } else {
      // Add new
      await authStore.addAddress({
        firstName: form.firstName,
        lastName: form.lastName,
        address1: form.address1,
        address2: form.address2 || undefined,
        city: form.city,
        country: form.country,
        phone: form.phone,
        isDefault: form.isDefault,
      })
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save address:', error)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete() {
  if (!deletingAddress.value) return
  isDeleting.value = true

  try {
    await authStore.deleteAddress(deletingAddress.value.id)
    showDeleteModal.value = false
    setTimeout(() => {
       deletingAddress.value = null
    }, 300)
  } catch (error) {
    console.error('Failed to delete address:', error)
  } finally {
    isDeleting.value = false
  }
}

async function setAsDefault(addressId: string) {
  await authStore.updateAddress(addressId, { isDefault: true })
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
