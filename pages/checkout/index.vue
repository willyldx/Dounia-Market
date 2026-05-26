<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-background relative">
    
    <!-- LEFT COLUMN: Form Area -->
    <div class="flex-1 flex flex-col w-full lg:w-[55%] xl:w-[60%] px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-24 lg:py-16 order-1 border-r border-border z-10 bg-background reveal-up">
      
      <!-- Header (Mobile & Desktop) -->
      <header class="mb-10 lg:mb-14">
        <NuxtLink to="/" class="flex items-center gap-3 w-max">
          <img src="/logo-full.svg" alt="Dounia Market" class="h-10 w-auto" />
        </NuxtLink>
        
        <!-- Breadcrumbs / Steps -->
        <nav class="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest">
          <NuxtLink to="/panier" class="text-muted-foreground hover:text-foreground transition-colors">Panier</NuxtLink>
          <span class="inline-flex items-center gap-2">
            <ChevronRightIcon class="w-3 h-3 shrink-0 text-muted-foreground/50" />
            <span :class="currentStep === 0 ? 'text-foreground' : 'text-muted-foreground'">Livraison</span>
          </span>
          <span class="inline-flex items-center gap-2">
            <ChevronRightIcon class="w-3 h-3 shrink-0 text-muted-foreground/50" />
            <span :class="currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'">Récapitulatif</span>
          </span>
          <span class="inline-flex items-center gap-2">
            <ChevronRightIcon class="w-3 h-3 shrink-0 text-muted-foreground/50" />
            <span :class="currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'">{{ checkoutPaymentEnabled ? 'Validation' : 'Contact' }}</span>
          </span>
        </nav>
      </header>

      <!-- Main Form Area -->
      <main class="flex-grow max-w-2xl">
        
        <!-- Step 1: Information -->
        <div v-show="currentStep === 0" class="animate-fade-in">
          <div class="flex items-end justify-between border-b border-border pb-4 mb-8">
            <h2 class="text-2xl font-black text-foreground tracking-tight">Contact de commande</h2>
            <NuxtLink v-if="!authStore.isAuthenticated" to="/auth/login?redirect=/checkout" class="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wide transition-colors">
              Déjà client ?
            </NuxtLink>
          </div>
          
          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="relative">
                <input v-model="form.firstName" type="text" id="fn" class="peer checkout-input" placeholder=" " required />
                <label for="fn" class="checkout-label">Prénom</label>
              </div>
              <div class="relative">
                <input v-model="form.lastName" type="text" id="ln" class="peer checkout-input" placeholder=" " required />
                <label for="ln" class="checkout-label">Nom</label>
              </div>
            </div>
            
            <div class="relative">
              <input v-model="form.email" type="email" id="email" class="peer checkout-input" placeholder=" " required />
              <label for="email" class="checkout-label">Adresse e-mail</label>
            </div>
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
            
            <div class="relative">
              <input v-model="form.phone" type="tel" id="phone" class="peer checkout-input" placeholder=" " required />
              <label for="phone" class="checkout-label">Téléphone (avec indicatif)</label>
            </div>
            <p v-if="errors.phone" class="text-xs text-destructive">{{ errors.phone }}</p>
          </div>

          <h2 class="text-2xl font-black text-foreground tracking-tight mt-12 border-b border-border pb-4 mb-8">Bénéficiaire et livraison</h2>
          
          <div class="space-y-4">
            <label class="flex items-center gap-4 p-5 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors group shadow-sm">
              <input v-model="sameAsCustomer" type="checkbox" class="w-5 h-5 text-brand bg-card border-border rounded focus:ring-brand focus:ring-2" />
              <div class="flex flex-col">
                 <span class="text-sm font-bold text-foreground">Le bénéficiaire est l'acheteur</span>
                 <span class="text-xs text-muted-foreground font-medium">Utiliser mes coordonnées pour la réception à N'Djamena.</span>
              </div>
            </label>

            <div v-show="!sameAsCustomer" class="grid sm:grid-cols-2 gap-4 animate-fade-in mt-4">
              <div class="relative">
                <input v-model="form.recipientName" type="text" id="rn" class="peer checkout-input bg-muted border-transparent focus:bg-card" placeholder=" " />
                <label for="rn" class="checkout-label bg-transparent">Nom du bénéficiaire</label>
              </div>
              <div class="relative">
                <input v-model="form.recipientPhone" type="tel" id="rp" class="peer checkout-input bg-muted border-transparent focus:bg-card" placeholder=" " />
                <label for="rp" class="checkout-label bg-transparent">Portable du bénéficiaire</label>
              </div>
              <p v-if="errors.recipientPhone" class="sm:col-span-2 text-xs text-destructive">{{ errors.recipientPhone }}</p>
            </div>

            <div class="relative mt-4">
              <input v-model="form.address.address1" type="text" id="addr" class="peer checkout-input" placeholder=" " required />
              <label for="addr" class="checkout-label">Quartier, rue ou point de repère</label>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="relative">
                <select v-model="form.address.city" id="city" class="peer checkout-input appearance-none bg-none" required>
                  <option value="N'Djamena">N'Djamena</option>
                </select>
                <label for="city" class="checkout-label">Ville de livraison</label>
                <ChevronDownIcon class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <div class="relative">
                <input value="Tchad" disabled class="checkout-input bg-muted/50 text-muted-foreground border-transparent font-medium" />
                <label class="checkout-label opacity-0">Pays</label>
              </div>
            </div>
            
            <div class="relative">
              <textarea v-model="form.deliveryInstructions" id="instr" rows="2" class="peer checkout-input resize-none" placeholder=" "></textarea>
              <label for="instr" class="checkout-label">Instructions à nos livreurs (optionnel)</label>
            </div>

            <div class="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Livraison locale à N'Djamena selon les zones couvertes. Les frais seront confirmés avant l'ouverture publique du service.
            </div>
          </div>
          
          <button @click="nextStep" :disabled="!canProceed" class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-12 mt-8">
            Vérifier la livraison <ArrowRightIcon class="w-4 h-4 ml-2" />
          </button>
        </div>

        <!-- Step 2: Delivery and total review -->
        <div v-show="currentStep === 1" class="animate-fade-in">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10 cursor-pointer hover:text-foreground transition-colors w-max" @click="currentStep = 0">
            <ArrowLeftIcon class="w-4 h-4" /> Modifier la livraison
          </div>
          
          <h2 class="text-2xl font-black text-foreground tracking-tight mb-2">Livraison et sous-total</h2>
          <p class="text-sm font-medium text-muted-foreground mb-8">
            Vérifiez le bénéficiaire et le quartier. Les frais de livraison restent à confirmer avant ouverture publique.
          </p>

          <div class="border border-border rounded-lg overflow-hidden bg-card shadow-sm text-sm">
            <div class="p-5 border-b border-border">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Bénéficiaire</p>
              <p class="font-bold text-foreground">{{ recipientDisplayName }}</p>
              <p class="text-muted-foreground mt-1">{{ recipientDisplayPhone }}</p>
            </div>
            <div class="p-5 border-b border-border">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Adresse de livraison</p>
              <p class="font-bold text-foreground">{{ form.address.address1 }}</p>
              <p class="text-muted-foreground mt-1">{{ form.address.city }}, Tchad</p>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Livraison locale</span>
                <span class="font-bold text-foreground">À confirmer</span>
              </div>
              <div class="flex justify-between gap-4 border-t border-border pt-3">
                <span class="font-bold text-foreground">Sous-total produits</span>
                <span class="font-black text-foreground">{{ cartStore.subtotalFormatted }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-lg border border-border bg-muted/40 p-5">
            <p class="text-sm font-bold text-foreground mb-2">Moyen de paiement</p>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Le moyen disponible sera confirmé avant l'ouverture publique du service. Aucun choix de fournisseur n'est annoncé à cette étape.
            </p>
          </div>

          <button @click="nextStep" :disabled="!canProceed" class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-12 mt-8">
            Confirmer les informations <ArrowRightIcon class="w-4 h-4 ml-2" />
          </button>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-show="currentStep === 2" class="animate-fade-in">
           <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10 cursor-pointer hover:text-foreground transition-colors w-max" @click="invalidatePaymentSession(); currentStep = 1">
            <ArrowLeftIcon class="w-4 h-4" /> Retour au récapitulatif
          </div>
          
          <h2 class="text-2xl font-black text-foreground tracking-tight mb-8">{{ checkoutPaymentEnabled ? 'Validation de la commande' : 'Informations de livraison' }}</h2>

          <div class="border border-border rounded-lg p-0 overflow-hidden mb-8 text-sm font-medium shadow-sm bg-card">
            <div class="p-5 border-b border-border">
              <div class="flex justify-between gap-3 mb-2">
                <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs">Contact</span>
                <button @click="invalidatePaymentSession(); currentStep = 0" class="text-muted-foreground hover:text-foreground font-bold underline underline-offset-4 transition-all">Modifier</button>
              </div>
              <p class="text-foreground break-all">{{ form.email }}</p>
              <p class="text-muted-foreground mt-1">{{ form.phone }}</p>
            </div>
            <div class="p-5 border-b border-border">
              <p class="text-muted-foreground font-bold uppercase tracking-wider text-xs mb-2">Bénéficiaire</p>
              <p class="text-foreground">{{ recipientDisplayName }}</p>
              <p class="text-muted-foreground mt-1">{{ recipientDisplayPhone }}</p>
            </div>
            <div class="p-5 border-b border-border">
              <div class="flex justify-between gap-3 mb-2">
                <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs">Livraison locale</span>
                <button @click="invalidatePaymentSession(); currentStep = 0" class="text-muted-foreground hover:text-foreground font-bold underline underline-offset-4 transition-all">Modifier</button>
              </div>
              <p class="text-foreground">{{ form.address.address1 }}, {{ form.address.city }}, Tchad</p>
              <p class="text-muted-foreground mt-1">Zones couvertes et frais à confirmer avant l'ouverture publique.</p>
            </div>
            <div class="p-5 flex items-center justify-between gap-4">
              <span class="font-bold text-foreground">Sous-total produits</span>
              <span class="text-lg font-black text-foreground">{{ cartStore.subtotalFormatted }}</span>
            </div>
          </div>

          <div v-if="checkoutPaymentEnabled && paymentSession" class="mb-6 rounded-lg border border-border bg-card p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Référence générée</p>
            <p class="text-sm text-foreground font-medium">Référence : {{ paymentSession.reference }}</p>
            <p class="mt-3 text-xs text-muted-foreground leading-relaxed">
              Le moyen disponible sera présenté lors de la poursuite de la validation, avant l'ouverture publique du service.
            </p>
          </div>

          <div v-if="checkoutPaymentEnabled && paymentError" class="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-start gap-4 text-sm font-medium">
            <div class="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
              <InfoIcon class="w-4 h-4 text-destructive" />
            </div>
            <span class="pt-0.5">{{ paymentError }}</span>
          </div>

          <template v-if="checkoutPaymentEnabled">
            <!-- Conditions -->
            <label class="flex items-start gap-4 p-5 bg-muted/50 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
              <input v-model="acceptTerms" type="checkbox" required class="w-5 h-5 mt-0.5 text-brand border-input rounded focus:ring-brand focus:ring-2 bg-background shadow-sm" />
              <span class="text-sm font-medium text-muted-foreground leading-relaxed">
                J'ai vérifié le bénéficiaire et l'adresse de livraison, et j'accepte les <NuxtLink to="/conditions" class="text-foreground font-bold underline">conditions générales de vente</NuxtLink>.
              </span>
            </label>

            <button @click="submitOrder" :disabled="!acceptTerms || isSubmitting" class="inline-flex items-center justify-center w-full rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-14 mt-8 relative overflow-hidden group">
              <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
              <LoaderIcon v-if="isSubmitting" class="w-5 h-5 animate-spin relative z-10 mr-2" />
              <ArrowRightIcon v-else class="w-5 h-5 text-brand-foreground/70 relative z-10 mr-2" />
              <span class="text-base sm:text-lg relative z-10">
                {{ isSubmitting ? 'Validation en cours...' : paymentSession ? 'Poursuivre la validation' : 'Valider la commande' }}
              </span>
            </button>
          </template>

          <div v-else class="rounded-lg border border-border bg-muted/40 p-5 sm:p-6">
            <h3 class="text-base font-bold text-foreground">Commandes en préparation</h3>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              La validation de commande n'est pas encore ouverte. Notre équipe peut vous renseigner sur les produits et les zones de livraison locale.
            </p>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row">
              <NuxtLink to="/contact" class="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90">
                Nous contacter
              </NuxtLink>
              <NuxtLink to="/catalogue" class="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted">
                Consulter le catalogue
              </NuxtLink>
            </div>
          </div>
        </div>

      </main>

      <!-- Footer Policy Links -->
      <footer class="mt-20 pt-8 border-t border-border text-xs font-bold uppercase tracking-wider text-muted-foreground flex flex-wrap gap-6 justify-center lg:justify-start">
        <NuxtLink to="/conditions" class="hover:text-foreground transition-colors">CGV</NuxtLink>
        <NuxtLink to="/conditions#remboursement" class="hover:text-foreground transition-colors">Retours</NuxtLink>
        <NuxtLink to="/confidentialite" class="hover:text-foreground transition-colors">Confidentialité</NuxtLink>
        <NuxtLink to="/mentions-legales" class="hover:text-foreground transition-colors">Légal</NuxtLink>
      </footer>
    </div>

    <!-- RIGHT COLUMN: Order Summary (Sticky Sidebar) -->
    <div class="w-full lg:w-[45%] xl:w-[40%] bg-muted text-foreground border-b lg:border-b-0 lg:border-l border-border px-6 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-16 order-2">
      <!-- Order Summary -->
      <div class="lg:sticky lg:top-12">
        <h2 class="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-4">Résumé des achats</h2>
        
        <!-- Products List -->
        <div class="space-y-5 mb-8 max-h-[40vh] lg:max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-5">
            <div class="relative shrink-0">
               <div class="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                  <NuxtImg v-if="item.thumbnail" :src="resolveThumb(item.thumbnail)" :alt="item.title" class="w-full h-full object-cover mix-blend-multiply" />
                  <PackageIcon v-else class="w-6 h-6 text-muted-foreground/30" />
               </div>
               <div class="absolute -top-2 -right-2 w-6 h-6 bg-brand text-brand-foreground text-[11px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-background">
                 {{ item.quantity }}
               </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-foreground text-sm truncate">{{ item.title }}</p>
              <p v-if="item.variantTitle" class="text-xs font-bold uppercase tracking-wide text-muted-foreground mt-1">{{ item.variantTitle }}</p>
            </div>
            <div class="text-sm font-black text-foreground shrink-0">
              {{ cartStore.formatPrice(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="space-y-4 pb-8 border-b border-border">
          <div class="flex justify-between text-sm font-medium">
            <span class="text-muted-foreground">Sous-total</span>
            <span class="text-foreground font-bold">{{ cartStore.subtotalFormatted }}</span>
          </div>
          <div class="flex justify-between text-sm font-medium">
            <span class="text-muted-foreground flex items-center gap-2"><TruckIcon class="w-4 h-4 text-muted-foreground/60"/>Livraison locale</span>
            <span class="text-foreground font-bold">À confirmer</span>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Zones couvertes et frais de livraison confirmés avant l'ouverture publique du service.
          </p>
        </div>

        <div class="flex items-center justify-between pt-8">
          <span class="text-sm font-bold text-muted-foreground mt-1">Sous-total produits</span>
          <div class="text-right flex flex-col items-end">
            <span class="text-4xl font-black text-foreground tracking-tight">{{ cartStore.subtotalFormatted }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Package as PackageIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Info as InfoIcon,
  Loader as LoaderIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  Truck as TruckIcon,
} from 'lucide-vue-next'
import type { CheckoutPaymentInitialization } from '~/types'

definePageMeta({
  layout: false,
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Livraison et validation de commande | Dounia Market',
  description: 'Confirmez le bénéficiaire, la livraison locale et le sous-total produits de votre commande Dounia Market.',
})

const cartStore = useCartStore()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const checkoutPaymentEnabled = computed(() => String(config.public.checkoutPaymentEnabled) === 'true')

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.douniamarket.com/${path}`
  if (path.startsWith('/storage/')) return `https://api.douniamarket.com${path}`
  return path
}

const currentStep = ref(0)

// Redirect if cart is empty (wait for hydration)
watchEffect(() => {
  if (cartStore.isHydrated && cartStore.isEmpty) {
    navigateTo('/catalogue')
  }
})

// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\+?[\d\s-]{8,}$/

const errors = reactive({
  email: '',
  phone: '',
  recipientPhone: '',
})

function validateStep1() {
  let isValid = true
  errors.email = !emailRegex.test(form.email) ? 'Email invalide' : ''
  errors.phone = !phoneRegex.test(form.phone) ? 'Téléphone invalide' : ''
  
  if (!sameAsCustomer.value) {
    errors.recipientPhone = !phoneRegex.test(form.recipientPhone) ? 'Téléphone destinataire invalide' : ''
  } else {
    errors.recipientPhone = ''
  }

  if (errors.email || errors.phone || errors.recipientPhone) isValid = false
  return isValid
}

function nextStep() {
  if (currentStep.value === 0 && !validateStep1()) return
  
  if (canProceed.value && currentStep.value < 2) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Form
const form = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  recipientName: '',
  recipientPhone: '',
  address: {
    address1: '',
    address2: '',
    city: "N'Djamena",
    country: 'Tchad',
  },
  deliveryInstructions: '',
})

const sameAsCustomer = ref(true)
const acceptTerms = ref(false)
const isSubmitting = ref(false)
const paymentError = ref<string | null>(null)
const paymentSession = ref<CheckoutPaymentInitialization | null>(null)

// Computed
const recipientDisplayName = computed(() => sameAsCustomer.value
  ? `${form.firstName} ${form.lastName}`.trim()
  : form.recipientName
)
const recipientDisplayPhone = computed(() => sameAsCustomer.value ? form.phone : form.recipientPhone)

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return (
      form.firstName &&
      form.lastName &&
      form.email &&
      form.phone &&
      form.address.address1 &&
      (sameAsCustomer.value || (form.recipientName && form.recipientPhone))
    )
  }
  if (currentStep.value === 1) {
    return true
  }
  return true
})

async function submitOrder() {
  if (!checkoutPaymentEnabled.value || !acceptTerms.value || isSubmitting.value) return

  isSubmitting.value = true
  paymentError.value = null

  try {
    if (paymentSession.value) {
      const { resumeTransaction } = usePaystack()
      await resumeTransaction(paymentSession.value.access_code)
      return
    }

    const recipientName = sameAsCustomer.value
      ? `${form.firstName} ${form.lastName}`
      : form.recipientName
    const recipientPhone = sameAsCustomer.value ? form.phone : form.recipientPhone

    const { checkout: apiCheckout } = useBackendApi()
    paymentSession.value = await apiCheckout({
      user_id: authStore.user?.id,
      email: form.email,
      customer_first_name: form.firstName,
      customer_last_name: form.lastName,
      customer_phone: form.phone,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      shipping_address_1: form.address.address1,
      shipping_address_2: form.address.address2 || undefined,
      shipping_city: form.address.city,
      shipping_country: form.address.country,
      delivery_instructions: form.deliveryInstructions || undefined,
      payment_method: 'card',
      items: cartStore.items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
    })
  } catch (error: any) {
    console.error('Order failed:', error)
    paymentError.value = 'La validation de la commande a échoué. Réessayez.'
  } finally {
    isSubmitting.value = false
  }
}

function invalidatePaymentSession() {
  paymentSession.value = null
}

watch(
  () => [cartStore.subtotal, cartStore.items],
  () => invalidatePaymentSession(),
  { deep: true }
)
</script>

<style scoped>
/* Floating-label checkout inputs */
.checkout-input {
  @apply block w-full px-5 pt-7 pb-2.5 text-sm font-bold text-foreground bg-background border border-input rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-ring focus:border-brand transition-all shadow-sm;
}

.checkout-label {
  @apply absolute text-muted-foreground font-medium text-sm duration-200 transform -translate-y-3.5 scale-[0.8] top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-muted-foreground peer-focus:scale-[0.8] peer-focus:-translate-y-3.5 peer-focus:text-brand pointer-events-none;
}

/* Custom Scrollbar for Cart sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
