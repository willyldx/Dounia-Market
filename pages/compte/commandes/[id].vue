<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Conciergerie</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <NuxtLink to="/compte/commandes" class="hover:text-foreground transition-colors">Historique</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">{{ order?.displayId || 'Recherche...' }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-8">
        <div class="bg-card rounded-[2rem] border border-border p-10 animate-pulse shadow-sm glass-strong">
          <div class="h-8 bg-muted rounded-md w-64 mb-6"></div>
          <div class="h-4 bg-muted/50 rounded-md w-40"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-card rounded-[2rem] border border-red-500/20 shadow-sm p-16 text-center max-w-2xl mx-auto glass-strong">
        <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircleIcon class="w-10 h-10 text-red-500" />
        </div>
        <h3 class="font-black text-2xl text-foreground mb-3 tracking-tight">Dossier introuvable</h3>
        <p class="text-muted-foreground font-medium mb-8">{{ error }}</p>
        <NuxtLink
          to="/compte/commandes"
          class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent"
        >
          <ArrowLeftIcon class="w-4 h-4 text-brand-foreground/60" />
          Retour au registre
        </NuxtLink>
      </div>

      <!-- Order Content -->
      <div v-else-if="order" class="space-y-8">
        <!-- Premium Header -->
        <div class="bg-card rounded-[2rem] border border-border shadow-premium p-8 sm:p-10 glass-strong">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex flex-wrap items-center gap-4 mb-3">
                <h1 class="text-3xl font-black text-foreground tracking-tight">{{ order.displayId }}</h1>
                <span
                  class="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border"
                  :class="getStatusClass(order.fulfillmentStatus)"
                >
                  {{ getStatusLabel(order.fulfillmentStatus) }}
                </span>
              </div>
              <p class="text-muted-foreground font-medium font-mono text-sm tracking-wide">
                Enregistré le {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="flex gap-4">
              <button
                @click="downloadInvoice"
                class="flex items-center justify-center gap-3 px-6 py-4 border border-border rounded-xl font-bold text-foreground hover:bg-muted hover:border-foreground transition-all shadow-sm active:scale-95 bg-card"
              >
                <DownloadIcon class="w-4 h-4 text-accent" />
                Reçu
              </button>
              <button
                @click="contactSupport"
                class="flex items-center justify-center gap-3 px-6 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-95"
              >
                <MessageCircleIcon class="w-4 h-4 text-brand-foreground/60" />
                Assistance
              </button>
            </div>
          </div>
        </div>

        <!-- Tracking Timeline (Luxury Style) -->
        <div class="bg-card rounded-[2rem] border border-border shadow-premium overflow-hidden glass-strong">
          <div class="p-8 sm:p-10 border-b border-border/50 bg-muted/30">
            <h2 class="text-xl font-black text-foreground tracking-tight">Progression logistique</h2>
          </div>
          
          <div class="p-8 sm:p-10">
            <!-- Progress Bar -->
            <div class="relative mb-16 px-4 sm:px-8">
              <div class="flex items-center justify-between relative z-10">
                <div
                  v-for="(step, index) in trackingSteps"
                  :key="step.id"
                  class="flex flex-col items-center relative group"
                >
                  <div
                    class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-card"
                    :class="step.completed 
                      ? 'bg-brand text-brand-foreground shadow-premium-lg scale-110' 
                      : 'bg-muted text-muted-foreground/60'"
                  >
                    <component :is="step.icon" class="w-6 h-6" :class="{ 'text-accent': step.completed }" />
                  </div>
                  <p class="text-[10px] uppercase tracking-widest font-black mt-4 text-center transition-colors" :class="step.completed ? 'text-foreground' : 'text-muted-foreground/60'">
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="text-xs font-medium text-muted-foreground mt-1">{{ step.date }}</p>
                </div>
              </div>
              
              <!-- Progress Line -->
              <div class="absolute top-7 left-12 right-12 h-1 bg-muted rounded-full z-0">
                <div 
                  class="h-full bg-brand rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  :style="{ width: progressWidth + '%' }"
                >
                   <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Detailed Timeline -->
            <div class="space-y-0 relative pl-4 max-w-2xl mx-auto">
               <div class="absolute left-[35px] top-4 bottom-4 w-0.5 bg-border z-0"></div>
              <div
                v-for="(event, index) in timeline"
                :key="event.id"
                class="flex gap-8 relative z-10"
              >
                <div class="flex flex-col items-center shrink-0">
                  <div
                    class="w-6 h-6 rounded-full border-4 border-card flex items-center justify-center mt-1 outline outline-1 outline-border"
                    :class="event.completed ? 'bg-brand' : 'bg-muted'"
                  >
                     <div v-if="event.completed && index === timeline.length - 1" class="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></div>
                  </div>
                </div>
                <div class="pb-10 pt-1">
                  <p class="font-black text-foreground text-lg tracking-tight">{{ event.title }}</p>
                  <p v-if="event.description" class="text-sm font-medium text-muted-foreground mt-2 leading-relaxed">{{ event.description }}</p>
                  <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mt-3">{{ event.date }}</p>
                </div>
              </div>
            </div>

            <!-- Delivery Photo Proof -->
            <div v-if="order.deliveryPhoto" class="mt-8 p-6 bg-muted/30 rounded-[2rem] border border-border max-w-2xl mx-auto">
              <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-4 flex items-center gap-3">
                <CameraIcon class="w-4 h-4 text-foreground" /> Preuve visuelle de livraison
              </p>
              <div class="rounded-xl overflow-hidden border border-border/80 shadow-sm relative group">
                 <div class="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img 
                   :src="order.deliveryPhoto" 
                   alt="Photo certifiée de livraison" 
                   class="w-full object-cover"
                 />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items Manifest -->
        <div class="bg-card rounded-[2rem] border border-border shadow-premium overflow-hidden glass-strong">
          <div class="p-8 border-b border-border/50 flex items-center justify-between">
            <h2 class="text-xl font-black text-foreground tracking-tight">
              Bordereau ({{ order.items.length }})
            </h2>
          </div>
          
          <div class="divide-y divide-border/50">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex flex-col sm:flex-row sm:items-center gap-6 p-8 hover:bg-muted/30 transition-colors"
            >
              <div class="w-24 h-24 bg-card border border-border shadow-sm rounded-2xl flex items-center justify-center shrink-0 p-2">
                <img
                  v-if="item.thumbnail"
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="w-full h-full object-contain mix-blend-multiply"
                />
                <PackageIcon v-else class="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-black text-foreground text-lg tracking-tight">{{ item.title }}</p>
                <div class="flex items-center gap-3 mt-2">
                   <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 bg-muted px-3 py-1 rounded-lg">Qté : {{ item.quantity }}</span>
                </div>
              </div>
              <div class="text-left sm:text-right">
                 <p class="font-black text-2xl text-foreground tracking-tight">{{ formatPrice(item.total) }}</p>
                 <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mt-1">Net</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary & Addresses (Side by side) -->
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Shipping Address -->
          <div class="bg-card rounded-[2rem] border border-border shadow-premium overflow-hidden flex flex-col glass-strong">
            <div class="p-8 border-b border-border/50">
              <h2 class="text-xl font-black text-foreground tracking-tight">Coordonnées logistiques</h2>
            </div>
            <div class="p-8 flex-1 bg-muted/30">
              <div class="flex items-start gap-5">
                <div class="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center shrink-0">
                  <MapPinIcon class="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p class="font-black text-lg text-foreground mb-2">
                    {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}
                  </p>
                  <p class="text-sm font-medium text-muted-foreground leading-relaxed mb-4">
                    {{ order.shippingAddress.address1 }}<br />
                    <span v-if="order.shippingAddress.address2">{{ order.shippingAddress.address2 }}<br /></span>
                    <span class="text-foreground font-bold">{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</span>
                  </p>
                  <div v-if="order.shippingAddress.phone" class="inline-flex items-center gap-3 bg-card border border-border shadow-sm px-4 py-2.5 rounded-xl">
                    <PhoneIcon class="w-4 h-4 text-muted-foreground/60" />
                    <span class="text-sm font-bold font-mono text-foreground tracking-widest">{{ order.shippingAddress.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Financials -->
          <div class="bg-brand text-brand-foreground rounded-[2rem] shadow-premium-lg overflow-hidden flex flex-col relative glass-strong">
             <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand/50 to-transparent opacity-50 pointer-events-none rounded-bl-full"></div>
            <div class="p-8 border-b border-brand-foreground/10 relative z-10">
              <h2 class="text-xl font-black tracking-tight flex items-center gap-3">
                 <CreditCard class="w-5 h-5 text-accent" /> Bilan financier
              </h2>
            </div>
            <div class="p-8 space-y-4 relative z-10 flex-1 flex flex-col justify-between">
              <div class="space-y-4 font-medium text-brand-foreground/70">
                 <div class="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                   <span>Frais de marchandises</span>
                   <span class="text-brand-foreground">{{ formatPrice(order.subtotal) }}</span>
                 </div>
                 <div class="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                   <span>Logistique N'Djamena</span>
                   <span class="text-brand-foreground">{{ formatPrice(order.shippingTotal) }}</span>
                 </div>
              </div>
              
              <div class="pt-6 mt-4 border-t border-brand-foreground/10 flex justify-between items-end">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white/10" :class="order.paymentStatus === 'captured' ? 'text-accent' : 'text-orange-400'">
                    <CheckCircleIcon v-if="order.paymentStatus === 'captured'" class="w-5 h-5" />
                    <ClockIcon v-else class="w-5 h-5" />
                  </div>
                  <div>
                     <span class="text-xs font-bold uppercase tracking-widest text-brand-foreground/50 block">Statut</span>
                     <span class="text-sm font-bold" :class="order.paymentStatus === 'captured' ? 'text-accent' : 'text-orange-400'">
                       {{ order.paymentStatus === 'captured' ? 'Fonds sécurisés' : 'En attente' }}
                     </span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold uppercase tracking-widest text-brand-foreground/50 mb-1">Montant total</p>
                  <p class="font-black text-4xl tracking-tighter text-brand-foreground">{{ formatPrice(order.total) }}</p>
                  <p class="text-xs font-bold text-accent uppercase tracking-widest mt-2">≈ {{ formatFCFA(order.total) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6">
          <NuxtLink
            to="/catalogue"
            class="flex-1 bg-brand border border-brand text-brand-foreground flex items-center justify-center gap-3 px-8 py-5 font-bold rounded-2xl hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-[0.98]"
          >
            <RefreshCwIcon class="w-5 h-5 text-brand-foreground/60" />
            Nouveau Colis
          </NuxtLink>
          <NuxtLink
            to="/compte/commandes"
            class="flex-1 flex items-center justify-center gap-3 px-8 py-5 border border-border bg-card text-foreground font-bold rounded-2xl hover:bg-muted transition-all shadow-sm active:scale-[0.98]"
          >
            <ArrowLeftIcon class="w-5 h-5 text-muted-foreground/60" />
            Retour à l'historique
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  Download as DownloadIcon,
  MessageCircle as MessageCircleIcon,
  Package as PackageIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  RefreshCw as RefreshCwIcon,
  Camera as CameraIcon,
  ShoppingCart,
  CreditCard,
  Truck,
  Home,
  Check,
} from 'lucide-vue-next'
import type { Order, FulfillmentStatus } from '~/types'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const authStore = useAuthStore()

// State
const order = ref<Order | null>(null)
const isLoading = ref(true)
const error = ref('')

// Tracking steps
const trackingSteps = computed(() => {
  const status = order.value?.fulfillmentStatus || 'not_fulfilled'
  const statusOrder: FulfillmentStatus[] = ['not_fulfilled', 'fulfilled', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(status)
  
  return [
    { 
      id: 'ordered', 
      label: 'Ouverture', 
      icon: ShoppingCart, 
      completed: true,
      date: order.value ? formatShortDate(order.value.createdAt) : '',
    },
    { 
      id: 'paid', 
      label: 'Fonds', 
      icon: CreditCard, 
      completed: order.value?.paymentStatus === 'captured',
      date: order.value?.paymentStatus === 'captured' ? formatShortDate(order.value.createdAt) : '',
    },
    { 
      id: 'shipped', 
      label: 'Logistique', 
      icon: Truck, 
      completed: currentIndex >= 1,
      date: currentIndex >= 1 ? 'Actionnée' : '',
    },
    { 
      id: 'delivered', 
      label: 'Clos', 
      icon: Home, 
      completed: status === 'delivered',
      date: status === 'delivered' ? 'Livré' : '',
    },
  ]
})

const progressWidth = computed(() => {
  const completedSteps = trackingSteps.value.filter(s => s.completed).length
  return ((completedSteps - 1) / (trackingSteps.value.length - 1)) * 100
})

const timeline = computed(() => {
  if (!order.value) return []
  
  const events = [
    {
      id: '1',
      title: 'Création du dossier',
      description: 'Vos instructions d\'expédition ont été réceptionnées.',
      date: formatDateTime(order.value.createdAt),
      completed: true,
    },
  ]
  
  if (order.value.paymentStatus === 'captured') {
    events.push({
      id: '2',
      title: 'Sécurisation financière',
      description: 'L\'encaissement est validé par l\'institution bancaire.',
      date: formatDateTime(order.value.createdAt),
      completed: true,
    })
  }
  
  if (['fulfilled', 'shipped', 'delivered'].includes(order.value.fulfillmentStatus)) {
    events.push({
      id: '3',
      title: 'Traitement au hub de Paris',
      description: 'Les marchandises sont en cours de conditionnement sécurisé.',
      date: 'Étape validée',
      completed: true,
    })
  }
  
  if (order.value.fulfillmentStatus === 'shipped') {
    events.push({
      id: '4',
      title: 'Acheminement aérien',
      description: 'Logistique en transit sécurisé vers la plateforme finale.',
      date: 'En cours...',
      completed: true,
    })
  }
  
  if (order.value.fulfillmentStatus === 'delivered') {
    events.push({
      id: '5',
      title: 'Remise au destinataire',
      description: 'Le protocole de livraison a été complété.',
      date: formatDateTime(order.value.updatedAt),
      completed: true,
    })
  }
  
  return events
})

// SEO
useSeoMeta({
  title: () => order.value ? `Dossier ${order.value.displayId} - Dounia Market` : 'Dossier Logistique - Dounia Market',
})

const { userOrderDetail } = useBackendApi()
const { normalizeOrder } = useOrderNormalizer()

// Fetch order
onMounted(async () => {
  await fetchOrder()
})

async function fetchOrder() {
  if (!authStore.user) {
    error.value = 'Habilitation requise : session expirée'
    isLoading.value = false
    return
  }

  const orderId = route.params.id as string
  if (!orderId) {
    error.value = 'Référence de dossier corrompue'
    isLoading.value = false
    return
  }

  try {
    const result = await userOrderDetail(orderId)
    if (result.order) {
      order.value = normalizeOrder(result.order)
    } else {
      error.value = 'Dossier introuvable dans nos archives'
    }
  } catch (e: any) {
    console.error('Order fetch error:', e)
    if (e.statusCode === 403) {
      error.value = 'Accès au dossier formellement restreint'
    } else if (e.statusCode === 404) {
      error.value = 'Dossier introuvable dans nos archives'
    } else {
      error.value = 'Incident de communication avec le serveur'
    }
  } finally {
    isLoading.value = false
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatFCFA(amount: number): string {
  const fcfa = Math.round(amount * 656)
  return new Intl.NumberFormat('fr-FR').format(fcfa) + ' FCFA'
}

function getStatusLabel(status: FulfillmentStatus): string {
  const labels: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'Ouvert',
    partially_fulfilled: 'Partiel',
    fulfilled: 'Préparé',
    shipped: 'En Logistique',
    delivered: 'Clos',
  }
  return labels[status] || status
}

function getStatusClass(status: FulfillmentStatus): string {
  const classes: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'bg-card text-foreground border-border',
    partially_fulfilled: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    fulfilled: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    shipped: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return classes[status] || 'bg-card text-foreground border-border'
}

function downloadInvoice() {
  alert('La facture cryptée sera téléchargée prochainement.')
}

function contactSupport() {
  navigateTo('/contact')
}
</script>
