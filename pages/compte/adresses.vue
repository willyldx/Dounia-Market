<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-4xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Conciergerie</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">Carnet d'Adresses</span>
      </nav>

      <!-- Premium Header -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 border-b border-border pb-8">
        <div>
          <h1 class="text-4xl font-black text-foreground tracking-tight">Destinataires VIP</h1>
          <p class="text-muted-foreground font-medium mt-2">Gérez vos points de livraison privilégiés au Tchad.</p>
        </div>
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-3 px-8 py-4 bg-brand text-brand-foreground font-bold rounded-2xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-95 shrink-0"
        >
          <PlusIcon class="w-5 h-5" />
          Nouveau Contact
        </button>
      </div>

      <!-- Addresses Grid -->
      <div v-if="isLoading" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="bg-card rounded-[2rem] border border-border p-8 shadow-sm animate-pulse glass-strong">
          <div class="h-5 bg-muted rounded-md w-32 mb-4"></div>
          <div class="h-4 bg-muted/50 rounded-md w-48 mb-3"></div>
          <div class="h-4 bg-muted/50 rounded-md w-40"></div>
        </div>
      </div>

      <div v-else-if="addresses.length === 0" class="bg-card rounded-[2rem] border border-border p-16 text-center shadow-premium glass-strong">
        <div class="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPinIcon class="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 class="text-2xl font-black text-foreground mb-3 tracking-tight">Carnet vide</h3>
        <p class="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
          Aucune coordonnée logistique n'a été pré-enregistrée.
        </p>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent"
        >
          <PlusIcon class="w-5 h-5" />
          Ajouter un destinataire
        </button>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-6">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-card rounded-[2rem] border overflow-hidden p-8 relative flex flex-col hover:shadow-premium hover:border-border/80 transition-all duration-300 group glass-strong"
          :class="address.isDefault ? 'border-brand/30 shadow-premium' : 'border-border shadow-sm'"
        >
           <div v-if="address.isDefault" class="absolute top-0 left-0 right-0 h-1.5 bg-brand"></div>

          <!-- Address Content -->
          <div class="flex items-start justify-between mb-2">
             <div class="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-border">
               <MapPinIcon class="w-5 h-5 text-foreground" />
             </div>
             <!-- Default Badge -->
             <span
               v-if="address.isDefault"
               class="text-[10px] uppercase font-black tracking-widest bg-brand text-brand-foreground px-3 py-1.5 rounded-lg shadow-sm"
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
            <p v-if="address.phone" class="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-xl border border-border mt-2">
              <PhoneIcon class="w-4 h-4 text-muted-foreground/60" />
              <span class="text-xs font-bold font-mono tracking-widest text-foreground">{{ address.phone }}</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-8 pt-6 border-t border-border/50 flex-wrap">
            <button
              @click="editAddress(address)"
              class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            >
              <EditIcon class="w-4 h-4" /> Éditer
            </button>
            <button
              v-if="!address.isDefault"
              @click="setAsDefault(address.id)"
              class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            >
              <StarIcon class="w-4 h-4" /> Rendre Principal
            </button>
            <button
              @click="confirmDelete(address)"
              class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl transition-all ml-auto"
            >
               Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Info Note -->
      <div class="mt-12 bg-card rounded-[2rem] border border-border p-8 flex items-start gap-5 shadow-premium relative overflow-hidden glass-strong">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-accent pointer-events-none"></div>
        <div class="w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center shrink-0">
          <InfoIcon class="w-5 h-5 text-accent" />
        </div>
        <div>
          <p class="text-sm font-black uppercase tracking-widest text-foreground mb-2">Notice Logistique Tchad</p>
          <p class="text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
            Toutes nos opérations de livraison VIP se concentrent exclusivement sur la métropole de <b class="text-foreground">N'Djamena</b>. Pour vos expéditions vers d'autres provinces, merci de requérir une assistance spéciale en amont.
          </p>
        </div>
      </div>
    </div>

    <!-- VIP Add/Edit Modal (Glassmorphic Luxury) -->
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
            <div v-if="showModal" class="bg-card rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-premium-lg relative glass-strong">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-8 sm:p-10 border-b border-border/50 bg-muted/30">
                <h3 class="text-2xl font-black text-foreground tracking-tight">
                  {{ editingAddress ? 'Modifier le contact' : 'Nouveau destinataire' }}
                </h3>
                <button @click="closeModal" class="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-full hover:bg-muted hover:scale-105 transition-all shadow-sm">
                  <XIcon class="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <!-- Premium Checkout-Style Form -->
              <form @submit.prevent="handleSubmit" class="p-8 sm:p-10 space-y-8">
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
                    <label for="mFirstName" class="checkout-label">Prénom civil</label>
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
                  <label for="mAddress1" class="checkout-label">Rue, Quartier, Repère exact</label>
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
                      <option value="Moundou">Moundou</option>
                      <option value="Sarh">Sarh</option>
                      <option value="Abéché">Abéché</option>
                    </select>
                    <label for="mCity" class="checkout-label">Ville d'atterrissage</label>
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
                    <label for="mCountry" class="checkout-label bg-transparent">Zone / Pays</label>
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
                  <label for="mPhone" class="checkout-label">Téléphone (obligatoire pour le livreur)</label>
                </div>

                <div class="pt-4 border-t border-border/50 flex items-center gap-4 cursor-pointer group" @click="form.isDefault = !form.isDefault">
                  <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors"
                       :class="form.isDefault ? 'bg-brand border-brand' : 'border-border bg-card group-hover:border-border/80'">
                     <CheckIcon v-if="form.isDefault" class="w-4 h-4 text-brand-foreground" />
                  </div>
                  <span class="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    Imposer comme point de logistique prioritaire
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-4 pt-8">
                  <button
                    type="button"
                    @click="closeModal"
                    class="flex-1 py-4 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted hover:border-foreground transition-colors shadow-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="flex-1 py-4 bg-brand text-brand-foreground font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-brand/90 transition-colors shadow-premium glow-accent active:scale-95"
                  >
                    <LoaderIcon v-if="isSaving" class="w-5 h-5 animate-spin text-brand-foreground/60" />
                    {{ isSaving ? 'Synchronisation...' : (editingAddress ? 'Sauvegarder' : 'Approuver la création') }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- VIP Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteModal" class="fixed inset-0 bg-background/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div class="bg-card rounded-[2rem] max-w-sm w-full p-10 relative overflow-hidden shadow-premium-lg border border-border glass-strong">
             <div class="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrashIcon class="w-10 h-10 text-red-500" />
            </div>
            <h3 class="text-2xl font-black text-foreground text-center mb-3 tracking-tight">Supprimer ?</h3>
            <p class="text-muted-foreground font-medium text-center mb-8">
              Ce contact sera rayé définitivement de votre carnet d'adresses.
            </p>
            <div class="flex flex-col gap-3">
              <button
                @click="handleDelete"
                :disabled="isDeleting"
                class="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg active:scale-95"
              >
                <LoaderIcon v-if="isDeleting" class="w-5 h-5 animate-spin" />
                {{ isDeleting ? 'Effacement...' : 'Confirmer la suppression' }}
              </button>
              <button
                @click="showDeleteModal = false"
                class="w-full py-4 border-2 border-transparent text-muted-foreground font-bold hover:text-foreground hover:bg-muted rounded-xl transition-all"
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
  title: 'Destinataires | Conciergerie Dounia Market',
  description: 'Gérez vos points de livraisons officiels sur Dounia Market.',
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
/* Ultra Premium Stripe-like Inputs for Modals */
.checkout-input {
  @apply block w-full px-5 pt-8 pb-3 text-sm font-bold text-foreground bg-card border border-border rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm;
}

.checkout-label {
  @apply absolute text-muted-foreground/80 font-bold uppercase tracking-widest text-xs duration-200 transform -translate-y-3 scale-[0.8] top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:normal-case peer-placeholder-shown:font-medium peer-focus:scale-[0.8] peer-focus:-translate-y-3 peer-focus:text-foreground peer-focus:uppercase peer-focus:font-bold pointer-events-none;
}
</style>
