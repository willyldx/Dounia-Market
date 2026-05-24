<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-background relative">
    
    <!-- LEFT COLUMN: Form Area -->
    <div class="flex-1 flex flex-col w-full lg:w-[55%] xl:w-[60%] px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-24 lg:py-16 order-2 lg:order-1 border-r border-border z-10 bg-background reveal-up">
      
      <!-- Header (Mobile & Desktop) -->
      <header class="mb-10 lg:mb-14">
        <NuxtLink to="/" class="flex items-center gap-3 w-max">
          <img src="/logo.png" alt="Dounia Market" class="h-10 w-auto" />
        </NuxtLink>
        
        <!-- Breadcrumbs / Steps -->
        <nav class="mt-8 flex items-center text-xs font-bold uppercase tracking-widest">
          <button @click="cartStore.isOpen = true; navigateTo('/')" class="text-muted-foreground hover:text-foreground transition-colors">Panier</button>
          <ChevronRightIcon class="w-3 h-3 mx-3 text-muted-foreground/50" />
          <span :class="currentStep === 0 ? 'text-foreground' : 'text-muted-foreground'">Client</span>
          <ChevronRightIcon class="w-3 h-3 mx-3 text-muted-foreground/50" />
          <span :class="currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'">Paiement</span>
          <ChevronRightIcon class="w-3 h-3 mx-3 text-muted-foreground/50" />
          <span :class="currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'">Confirmation</span>
        </nav>
      </header>

      <!-- Main Form Area -->
      <main class="flex-grow max-w-2xl">
        
        <!-- Step 1: Information -->
        <div v-show="currentStep === 0" class="animate-fade-in">
          <div class="flex items-end justify-between border-b border-border pb-4 mb-8">
            <h2 class="text-2xl font-black text-foreground tracking-tight">Vos coordonnées</h2>
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
              <label for="email" class="checkout-label">Adresse e-mail sécurisée</label>
            </div>
            
            <div class="relative">
              <input v-model="form.phone" type="tel" id="phone" class="peer checkout-input" placeholder=" " required />
              <label for="phone" class="checkout-label">Téléphone (avec indicatif)</label>
            </div>
          </div>

          <h2 class="text-2xl font-black text-foreground tracking-tight mt-16 border-b border-border pb-4 mb-8">Destinataire au Tchad</h2>
          
          <div class="space-y-4">
            <label class="flex items-center gap-4 p-5 bg-card border border-border rounded-[1rem] cursor-pointer hover:bg-muted transition-colors group shadow-sm">
              <input v-model="sameAsCustomer" type="checkbox" class="w-5 h-5 text-brand bg-card border-border rounded focus:ring-brand focus:ring-2" />
              <div class="flex flex-col">
                 <span class="text-sm font-bold text-foreground">Je suis le destinataire</span>
                 <span class="text-xs text-muted-foreground font-medium">Je réceptionnerai le colis à N'Djamena.</span>
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
            </div>

            <div class="relative mt-4">
              <input v-model="form.address.address1" type="text" id="addr" class="peer checkout-input" placeholder=" " required />
              <label for="addr" class="checkout-label">Adresse de livraison détaillée (Quartier, repère...)</label>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="relative">
                <select v-model="form.address.city" id="city" class="peer checkout-input appearance-none bg-none" required>
                  <option value="N'Djamena">N'Djamena</option>
                  <option value="Moundou">Moundou</option>
                  <option value="Sarh">Sarh</option>
                </select>
                <label for="city" class="checkout-label">Ville de logistique</label>
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
          </div>
          
          <button @click="nextStep" :disabled="!canProceed" class="w-full flex items-center justify-center gap-3 py-5 mt-12 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            Passer au mode de paiement <ArrowRightIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Step 2: Payment -->
        <div v-show="currentStep === 1" class="animate-fade-in">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10 cursor-pointer hover:text-foreground transition-colors w-max" @click="currentStep = 0">
            <ArrowLeftIcon class="w-4 h-4" /> Retour aux coordonnées
          </div>
          
          <h2 class="text-2xl font-black text-foreground tracking-tight mb-2">Paiement</h2>
          <p class="text-sm font-medium text-muted-foreground mb-8 flex items-center gap-2">
            <ShieldCheckIcon class="w-4 h-4 text-accent" /> Traitement chiffré de bout en bout.
          </p>

          <div class="border border-border rounded-[1rem] overflow-hidden bg-card shadow-premium">
            <label 
              v-for="(method, index) in paymentMethods" 
              :key="method.id"
              class="flex flex-col border-b last:border-b-0 border-border cursor-pointer transition-colors"
              :class="selectedPayment === method.id ? 'bg-muted/50' : 'hover:bg-muted/30'"
            >
              <div class="flex items-center p-6 gap-5">
                <input v-model="selectedPayment" type="radio" :value="method.id" class="w-5 h-5 text-brand border-border focus:ring-brand focus:ring-2" />
                <div class="flex-1 flex justify-between items-center">
                  <span class="font-bold text-foreground">{{ method.label }}</span>
                  <component v-if="method.id === 'card'" :is="CreditCard" class="w-6 h-6 text-muted-foreground" />
                  <component v-else-if="method.id === 'mobile_money' || method.id === 'tchad_mobile_money'" :is="Smartphone" class="w-6 h-6 text-muted-foreground" />
                  <component v-else :is="Banknote" class="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              
              <!-- Active Method Content -->
              <div v-show="selectedPayment === method.id" class="px-6 pb-6 pt-0 ml-[44px]">
                <p class="text-sm font-medium text-muted-foreground">{{ method.description }}</p>
                
                <!-- Specialized Mobile Money Tchad Panel -->
                <div v-if="method.id === 'tchad_mobile_money'" class="mt-5 bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-1.5 h-full bg-accent"></div>
                  <h4 class="font-black text-foreground text-sm mb-3 tracking-tight">Protocole Manuel (FCFA)</h4>
                  <p class="text-sm font-medium text-muted-foreground mb-4 leading-relaxed">
                    1. Effectuez un transfert exact de <b class="text-foreground bg-accent/10 px-1 rounded">{{ cartStore.totalXAF }} FCFA</b> au numéro :<br/>
                    <span class="inline-block mt-2 font-mono font-bold text-lg bg-muted text-foreground px-3 py-1 rounded-lg tracking-widest">+235 85 96 25 92</span> <span class="text-xs text-muted-foreground ml-2">(Airtel Tchad)</span>
                  </p>
                  <div class="relative mt-2">
                    <input v-model="transferPhone" type="tel" id="tpl" class="peer checkout-input !bg-muted border-transparent focus:border-border" placeholder=" " />
                    <label for="tpl" class="checkout-label bg-transparent">Téléphone ayant émis le transfert</label>
                  </div>
                </div>
                
                <div v-else class="mt-5 bg-muted/50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-border/50">
                  <component :is="method.icon" class="w-8 h-8 text-muted-foreground/50 mb-3" />
                  <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground max-w-sm leading-relaxed">
                    Vous serez redirigé vers l'interface ultra-sécurisée de Paystack pour garantir l'intégrité de vos données bancaires.
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div v-if="paymentError" class="mt-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-start gap-4 text-sm font-medium">
             <div class="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
               <InfoIcon class="w-4 h-4 text-destructive" />
             </div>
             <span class="pt-0.5">{{ paymentError }}</span>
          </div>

          <button @click="nextStep" :disabled="!canProceed" class="w-full flex items-center justify-center gap-3 py-5 mt-10 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            Vérifier avant paiement
          </button>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-show="currentStep === 2" class="animate-fade-in">
           <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10 cursor-pointer hover:text-foreground transition-colors w-max" @click="currentStep = 1">
            <ArrowLeftIcon class="w-4 h-4" /> Retour au paiement
          </div>
          
          <h2 class="text-2xl font-black text-foreground tracking-tight mb-8">Vérification finale</h2>

          <div class="border border-border rounded-[1rem] p-0 overflow-hidden mb-10 text-sm font-medium shadow-sm bg-card">
            <div class="flex justify-between p-5 border-b border-border items-start">
              <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs w-28 pt-0.5">Contact</span>
              <span class="text-foreground flex-1 break-all">{{ form.email }}</span>
              <button @click="currentStep = 0" class="text-muted-foreground hover:text-foreground font-bold underline decoration-2 decoration-muted-foreground hover:decoration-foreground underline-offset-4 transition-all">Éditer</button>
            </div>
             <div class="flex justify-between p-5 border-b border-border items-start">
              <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs w-28 pt-0.5">Destinataire</span>
              <span class="text-foreground flex-1 max-w-[200px] sm:max-w-none">{{ form.address.address1 }}, {{ form.address.city }}, Tchad</span>
              <button @click="currentStep = 0" class="text-muted-foreground hover:text-foreground font-bold underline decoration-2 decoration-muted-foreground hover:decoration-foreground underline-offset-4 transition-all">Éditer</button>
            </div>
             <div class="flex justify-between p-5 items-start">
              <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs w-28 pt-0.5">Méthode</span>
              <span class="text-foreground flex-1">{{ paymentMethods.find(m => m.id === selectedPayment)?.label }}</span>
              <button @click="currentStep = 1" class="text-muted-foreground hover:text-foreground font-bold underline decoration-2 decoration-muted-foreground hover:decoration-foreground underline-offset-4 transition-all">Éditer</button>
            </div>
          </div>

          <!-- Conditions -->
          <label class="flex items-start gap-4 p-5 bg-muted/50 border border-border rounded-[1rem] cursor-pointer hover:bg-muted transition-colors">
            <input v-model="acceptTerms" type="checkbox" required class="w-5 h-5 mt-0.5 text-brand bg-card border-border rounded focus:ring-brand focus:ring-2" />
            <span class="text-sm font-medium text-muted-foreground leading-relaxed">
              J'exige que l'équipe logistique livre cette commande en parfait état, et j'accepte formellement les <NuxtLink to="/conditions" class="text-foreground font-bold underline">conditions générales de vente</NuxtLink>.
            </span>
          </label>

          <button @click="submitOrder" :disabled="!acceptTerms || isSubmitting" class="w-full flex items-center justify-center gap-3 py-5 mt-8 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group">
            <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
            <LoaderIcon v-if="isSubmitting" class="w-5 h-5 animate-spin relative z-10" />
            <LockIcon v-else class="w-5 h-5 text-brand-foreground/70 relative z-10" />
            <span class="text-lg relative z-10">{{ isSubmitting ? 'Chiffrement en cours...' : `Confirmer et Payer ${cartStore.formattedTotal}` }}</span>
          </button>
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
    <div class="w-full lg:w-[45%] xl:w-[40%] bg-brand text-brand-foreground border-b lg:border-b-0 lg:border-l border-brand/20 px-6 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-16 order-1 lg:order-2 shadow-premium-lg">
      <!-- Order Summary -->
      <div class="lg:sticky lg:top-12">
        <h2 class="text-sm font-bold uppercase tracking-widest text-brand-foreground/50 mb-8 border-b border-brand-foreground/10 pb-4">Résumé des achats</h2>
        
        <!-- Products List -->
        <div class="space-y-5 mb-8 max-h-[40vh] lg:max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-5">
            <div class="relative shrink-0">
               <div class="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                  <NuxtImg v-if="item.thumbnail" :src="resolveThumb(item.thumbnail)" :alt="item.title" class="w-full h-full object-cover mix-blend-multiply" />
                  <PackageIcon v-else class="w-6 h-6 text-muted-foreground/30" />
               </div>
               <div class="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground text-[11px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-brand">
                 {{ item.quantity }}
               </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-brand-foreground text-sm truncate">{{ item.title }}</p>
              <p v-if="item.variantTitle" class="text-xs font-bold uppercase tracking-wide text-brand-foreground/50 mt-1">{{ item.variantTitle }}</p>
            </div>
            <div class="text-sm font-black text-brand-foreground shrink-0">
              {{ cartStore.formatPrice(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="space-y-4 pb-8 border-b border-brand-foreground/10">
          <div class="flex justify-between text-sm font-medium">
            <span class="text-brand-foreground/70">Sous-total</span>
            <span class="text-brand-foreground">{{ cartStore.subtotalFormatted }}</span>
          </div>
          <div class="flex justify-between text-sm font-medium">
            <span class="text-brand-foreground/70 flex items-center gap-2"><TruckIcon class="w-4 h-4 text-brand-foreground/40"/>Fret & Douane</span>
            <span class="text-brand-foreground">{{ cartStore.shippingFormatted }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-8">
          <span class="text-sm font-bold uppercase tracking-wider text-brand-foreground/50 mt-1">Net à Payer</span>
          <div class="text-right flex flex-col items-end">
            <span class="text-4xl font-black text-brand-foreground tracking-tight">{{ cartStore.totalFormatted }}</span>
            <span class="text-sm font-bold text-accent mt-2">≈ {{ cartStore.totalFCFA }} FCFA</span>
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
  Check as CheckIcon,
  User as UserIcon,
  CreditCard,
  Smartphone,
  Banknote,
  Info as InfoIcon,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
  Loader as LoaderIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronDown as ChevronDownIcon,
  Truck as TruckIcon,
} from 'lucide-vue-next'

definePageMeta({
  layout: false,
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Passage en caisse sécurisé | Dounia Market',
  description: 'Tunnel de paiement sécurisé Dounia Market.',
})

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { checkout: apiCheckout } = useBackendApi()
const { initializePayment, verifyPayment, eurToXof } = usePaystack()

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.spencerai.tech/${path}`
  if (path.startsWith('/storage/')) return `https://api.spencerai.tech${path}`
  return path
}

const currentStep = ref(0)
const steps = [
  { id: 'info', label: 'Informations' },
  { id: 'payment', label: 'Paiement' },
  { id: 'confirm', label: 'Confirmation' },
]

// Flag pour éviter le retour au catalogue pendant le processus de confirmation
const isOrderCompleted = ref(false)

// Redirect if cart is empty (wait for hydration)
watchEffect(() => {
  if (cartStore.isHydrated && cartStore.isEmpty && !isOrderCompleted.value) {
    navigateTo('/catalogue')
  }
})

// Currency Selection
const currencies = [
  { id: 'EUR', label: 'Euro (€)', icon: '€' },
  { id: 'USD', label: 'Dollar ($)', icon: '$' },
  { id: 'XAF', label: 'FCFA (CFA)', icon: 'FC' },
]

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
const selectedPayment = ref('card')
const acceptTerms = ref(false)
const isSubmitting = ref(false)
const paymentError = ref<string | null>(null)

// Payment methods (Paystack supported channels)
const paymentMethods = [
  {
    id: 'card',
    label: 'Carte de crédit / débit',
    description: 'Visa, Mastercard — passerelle interbancaire cryptée',
    icon: CreditCard,
  },
  {
    id: 'mobile_money',
    label: 'Mobile Money (Côte d\'Ivoire, Sénégal...)',
    description: 'MTN, Orange, Wave...',
    icon: Smartphone,
  },
  {
    id: 'bank_transfer',
    label: 'Virement Institutionnel',
    description: 'Fonds sécurisés par les banques centrales',
    icon: Banknote,
  },
  {
    id: 'tchad_mobile_money',
    label: 'Paiement Tchad (Mobile Money Local)',
    description: 'Procédure spéciale pour Airtel Money & Moov',
    icon: Smartphone,
  },
]

const transferPhone = ref(authStore.user?.phone || '')

// Map selected payment to Paystack channels
const paystackChannels = computed(() => {
  const channelMap: Record<string, string[]> = {
    card: ['card'],
    mobile_money: ['mobile_money'],
    bank_transfer: ['bank_transfer'],
  }
  return channelMap[selectedPayment.value] || ['card', 'mobile_money', 'bank_transfer']
})

// Computed
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
    return selectedPayment.value
  }
  return true
})

async function submitOrder() {
  if (!acceptTerms.value || isSubmitting.value) return

  isSubmitting.value = true
  paymentError.value = null

  try {
    const recipientName = sameAsCustomer.value
      ? `${form.firstName} ${form.lastName}`
      : form.recipientName
    const recipientPhone = sameAsCustomer.value ? form.phone : form.recipientPhone

    const isMobileMoney = selectedPayment.value === 'tchad_mobile_money'
    const paymentAmountFcfa = isMobileMoney ? cartStore.totalXAF : undefined

    const { orderId, reference } = await apiCheckout({
      user_id: authStore.user?.id,
      email: form.email,
      customer_first_name: form.firstName,
      customer_last_name: form.lastName,
      customer_phone: isMobileMoney ? transferPhone.value : form.phone,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      shipping_address_1: form.address.address1,
      shipping_address_2: form.address.address2 || undefined,
      shipping_city: form.address.city,
      shipping_country: form.address.country,
      delivery_instructions: form.deliveryInstructions || undefined,
      subtotal: cartStore.subtotal,
      shipping_total: cartStore.shipping,
      total: cartStore.total,
      payment_method: selectedPayment.value,
      payment_amount_fcfa: paymentAmountFcfa,
      items: cartStore.items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        title: item.variantTitle ? `${item.title} (${item.variantTitle})` : item.title,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
        thumbnail: item.thumbnail,
      })),
    })

    if (selectedPayment.value === 'tchad_mobile_money') {
      const totalFCFA = cartStore.totalFCFA
      isOrderCompleted.value = true
      cartStore.clearCart()
      navigateTo(`/checkout/confirmation?order=${reference}&method=tchad_mobile_money&amount=${totalFCFA}`)
      return
    }

    const amountInXof = eurToXof(cartStore.total)
    await initializePayment({
      email: form.email,
      amount: amountInXof * 100,
      currency: 'XOF',
      reference,
      metadata: {
        order_id: orderId,
        customer_name: `${form.firstName} ${form.lastName}`,
        recipient_name: recipientName,
        custom_fields: [
          { display_name: 'Commande', variable_name: 'order_ref', value: reference },
          { display_name: 'Destinataire', variable_name: 'recipient', value: recipientName },
        ],
      },
      onSuccess: async (response) => {
        try {
          const verification = await verifyPayment(response.reference)
          if (verification.success) {
            isOrderCompleted.value = true
            cartStore.clearCart()
            navigateTo(`/checkout/confirmation?order=${reference}`)
          } else {
            paymentError.value = verification.error || 'La vérification du paiement a échoué. Nos équipes de sécurité ont été alertées.'
          }
        } catch (err) {
          console.error('Payment verification error:', err)
          paymentError.value =
            'Suspicion d\'erreur lors de la validation. Communiquez cette référence au support : ' + reference
        } finally {
          isSubmitting.value = false
        }
      },
      onClose: () => {
        isSubmitting.value = false
        paymentError.value = 'Opération interrompue. Votre session est fermée pour des raisons de sécurité.'
      },
    })
  } catch (error: any) {
    console.error('Order failed:', error)
    paymentError.value = error.data?.message || error.message || 'La connexion à notre chambre forte a échoué. Réessayez.'
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Ultra Premium Stripe-like Inputs */
.checkout-input {
  @apply block w-full px-5 pt-7 pb-2.5 text-sm font-bold text-foreground bg-card border border-border rounded-[1rem] appearance-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all;
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
