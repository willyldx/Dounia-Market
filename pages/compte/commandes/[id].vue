<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
        <NuxtLink to="/compte" class="hover:text-foreground transition-colors">Mon compte</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <NuxtLink to="/compte/commandes" class="hover:text-foreground transition-colors">Commandes</NuxtLink>
        <ChevronRightIcon class="w-3 h-3 text-muted-foreground/40" />
        <span class="text-foreground">{{ order?.displayId || 'Recherche...' }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <div class="bg-card rounded-lg border border-border p-8 animate-pulse shadow-sm">
          <div class="h-6 bg-muted rounded-md w-48 mb-4"></div>
          <div class="h-4 bg-muted/50 rounded-md w-32"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-card rounded-lg border border-destructive/20 shadow-sm p-12 text-center max-w-2xl mx-auto">
        <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircleIcon class="w-8 h-8 text-destructive" />
        </div>
        <h3 class="font-black text-2xl text-foreground mb-3 tracking-tight">Commande introuvable</h3>
        <p class="text-muted-foreground font-medium mb-8">{{ error }}</p>
        <NuxtLink
          to="/compte/commandes"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 mt-4"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Retour aux commandes
        </NuxtLink>
      </div>

      <!-- Order Content -->
      <div v-else-if="order" class="space-y-8">
        <div class="bg-card rounded-lg border border-border shadow-sm p-6 sm:p-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex flex-wrap items-center gap-4 mb-2">
                <h1 class="text-2xl font-bold text-foreground tracking-tight">{{ order.displayId }}</h1>
                <span
                class="inline-flex items-center px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                  :class="getStatusClass(order.fulfillmentStatus)"
                >
                  {{ getStatusLabel(order.fulfillmentStatus) }}
                </span>
              </div>
              <p class="text-muted-foreground font-medium text-sm">
                Enregistré le {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                @click="contactSupport"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2"
              >
                <MessageCircleIcon class="w-4 h-4 mr-2" />
                Assistance
              </button>
            </div>
          </div>
        </div>

        <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8 border-b border-border bg-muted/30">
            <h2 class="text-xl font-bold text-foreground tracking-tight">Avancement de la commande</h2>
          </div>
          
          <div class="p-6 sm:p-8">
            <div class="relative mb-16 px-4 sm:px-8">
              <div class="grid grid-cols-4 gap-2 relative z-10">
                <div
                  v-for="(step, index) in trackingSteps"
                  :key="step.id"
                  class="flex flex-col items-center relative group"
                >
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border border-background shadow-sm"
                    :class="step.completed 
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-muted text-muted-foreground/60'"
                  >
                    <component :is="step.icon" class="w-5 h-5" />
                  </div>
                  <p class="text-[10px] uppercase font-bold mt-3 text-center transition-colors" :class="step.completed ? 'text-foreground' : 'text-muted-foreground/60'">
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="hidden text-xs font-medium text-muted-foreground mt-1 sm:block">{{ step.date }}</p>
                </div>
              </div>
              
              <!-- Progress Line -->
              <div class="absolute top-6 left-10 right-10 h-1 bg-muted rounded-full z-0">
                <div 
                  class="h-full bg-brand rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  :style="{ width: progressWidth + '%' }"
                >
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
                    class="w-5 h-5 rounded-full border border-background flex items-center justify-center mt-1 outline outline-1 outline-border"
                    :class="event.completed ? 'bg-brand' : 'bg-muted'"
                  >
                  </div>
                </div>
                <div class="pb-8 pt-0.5">
                  <p class="font-bold text-foreground text-base tracking-tight">{{ event.title }}</p>
                  <p v-if="event.description" class="text-sm font-medium text-muted-foreground mt-2 leading-relaxed">{{ event.description }}</p>
                  <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mt-3">{{ event.date }}</p>
                </div>
              </div>
            </div>

            <div v-if="order.deliveryPhoto" class="mt-8 p-6 bg-muted/30 rounded-lg border border-border max-w-2xl mx-auto">
              <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-4 flex items-center gap-3">
                <CameraIcon class="w-4 h-4 text-foreground" /> Photo de livraison
              </p>
              <div class="rounded-lg overflow-hidden border border-border/80 shadow-sm relative group">
                 <div class="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img 
                   :src="order.deliveryPhoto" 
                   alt="Photo de livraison"
                   class="w-full object-cover"
                 />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
            <h2 class="text-xl font-bold text-foreground tracking-tight">
              Produits ({{ order.items.length }})
            </h2>
          </div>
          
          <div class="divide-y divide-border">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 hover:bg-muted/30 transition-colors"
            >
              <div class="w-20 h-20 bg-background border border-border shadow-sm rounded-lg flex items-center justify-center shrink-0 p-2">
                <img
                  v-if="item.thumbnail"
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="w-full h-full object-contain mix-blend-multiply"
                />
                <PackageIcon v-else class="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-foreground text-base tracking-tight">{{ item.title }}</p>
                <div class="flex items-center gap-3 mt-1">
                   <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 bg-muted px-3 py-1 rounded-lg">Qté : {{ item.quantity }}</span>
                </div>
              </div>
              <div class="text-left sm:text-right">
                 <p class="font-bold text-lg text-foreground tracking-tight">{{ formatAmount(item.total, order.currency) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary & Addresses (Side by side) -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
            <div class="p-6 border-b border-border bg-muted/30">
              <h2 class="text-xl font-bold text-foreground tracking-tight">Bénéficiaire et livraison</h2>
            </div>
            <div class="p-6 flex-1">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <MapPinIcon class="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p class="font-bold text-base text-foreground mb-1">
                    {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}
                  </p>
                  <p class="text-sm text-muted-foreground leading-relaxed mb-4">
                    {{ order.shippingAddress.address1 }}<br />
                    <span v-if="order.shippingAddress.address2">{{ order.shippingAddress.address2 }}<br /></span>
                    <span class="text-foreground font-bold">{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</span>
                  </p>
                  <div v-if="order.shippingAddress.phone" class="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md border border-border">
                    <PhoneIcon class="w-3.5 h-3.5 text-muted-foreground" />
                    <span class="text-xs font-medium font-mono text-foreground">{{ order.shippingAddress.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
            <div class="p-6 border-b border-border bg-muted/30">
              <h2 class="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                 <PackageIcon class="w-4 h-4 text-brand" /> Récapitulatif
              </h2>
            </div>
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div class="space-y-3 text-sm font-medium text-muted-foreground">
                 <div class="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                   <span>Produits</span>
                   <span class="text-foreground">{{ formatAmount(order.subtotal, order.currency) }}</span>
                 </div>
                 <div class="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                   <span>Livraison locale</span>
                   <span class="text-foreground">{{ formatAmount(order.shippingTotal, order.currency) }}</span>
                 </div>
                 <p class="text-xs leading-relaxed">Livraison à N'Djamena selon les zones couvertes et les frais enregistrés lors de la validation de cette commande.</p>
              </div>
              
              <div class="pt-6 mt-4 border-t border-border flex justify-end items-end">
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total enregistré</p>
                  <p class="font-bold text-3xl tracking-tight text-foreground">{{ formatAmount(order.total, order.currency) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6">
          <NuxtLink
            to="/catalogue"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 flex-1"
          >
            <RefreshCwIcon class="w-4 h-4 mr-2" />
            Nouvelle commande
          </NuxtLink>
          <NuxtLink
            to="/compte/commandes"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
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
  MessageCircle as MessageCircleIcon,
  Package as PackageIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  RefreshCw as RefreshCwIcon,
  Camera as CameraIcon,
  ShoppingCart,
  Truck,
  Home,
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
  const progressByStatus: Record<FulfillmentStatus, number> = {
    not_fulfilled: 0,
    partially_fulfilled: 0,
    fulfilled: 1,
    shipped: 2,
    delivered: 3,
  }
  const currentIndex = progressByStatus[status]
  
  return [
    { 
      id: 'ordered', 
      label: 'Commande',
      icon: ShoppingCart, 
      completed: true,
      date: order.value ? formatShortDate(order.value.createdAt) : '',
    },
    { 
      id: 'processing',
      label: 'Préparation',
      icon: PackageIcon,
      completed: currentIndex >= 1,
      date: currentIndex >= 1 ? 'Prête' : '',
    },
    { 
      id: 'shipped', 
      label: 'Livraison',
      icon: Truck, 
      completed: currentIndex >= 2,
      date: currentIndex >= 2 ? 'En cours' : '',
    },
    { 
      id: 'delivered', 
      label: 'Livrée',
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
      title: 'Commande enregistrée',
      description: 'Votre commande est disponible dans votre espace privé.',
      date: formatDateTime(order.value.createdAt),
      completed: true,
    },
  ]
  
  if (['fulfilled', 'shipped', 'delivered'].includes(order.value.fulfillmentStatus)) {
    events.push({
      id: '2',
      title: 'Préparation locale terminée',
      description: 'Les produits de la commande ont été préparés pour la livraison.',
      date: 'Étape validée',
      completed: true,
    })
  }
  
  if (order.value.fulfillmentStatus === 'shipped') {
    events.push({
      id: '3',
      title: 'Livraison locale en cours',
      description: 'La livraison est en cours à N\'Djamena, selon la zone couverte.',
      date: 'En cours',
      completed: true,
    })
  }
  
  if (order.value.fulfillmentStatus === 'delivered') {
    events.push({
      id: '4',
      title: 'Remise au destinataire',
      description: 'La commande est indiquée comme livrée.',
      date: formatDateTime(order.value.updatedAt),
      completed: true,
    })
  }
  
  return events
})

// SEO
useSeoMeta({
  title: () => order.value ? `Commande ${order.value.displayId} - Dounia Market` : 'Commande - Dounia Market',
})

const { userOrderDetail } = useBackendApi()
const { normalizeOrder } = useOrderNormalizer()

// Fetch order
onMounted(async () => {
  await fetchOrder()
})

async function fetchOrder() {
  if (!authStore.user) {
    error.value = 'Votre session a expiré. Reconnectez-vous pour consulter cette commande.'
    isLoading.value = false
    return
  }

  const orderId = route.params.id as string
  if (!orderId) {
    error.value = 'Référence de commande manquante.'
    isLoading.value = false
    return
  }

  try {
    const result = await userOrderDetail(orderId)
    if (result.order) {
      order.value = normalizeOrder(result.order)
    } else {
      error.value = 'Cette commande est introuvable.'
    }
  } catch (e: any) {
    console.error('Order fetch error:', e)
    if (e.statusCode === 403) {
      error.value = 'Vous n\'avez pas accès à cette commande.'
    } else if (e.statusCode === 404) {
      error.value = 'Cette commande est introuvable.'
    } else {
      error.value = 'Impossible de charger la commande pour le moment.'
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

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

function getStatusLabel(status: FulfillmentStatus): string {
  const labels: Record<FulfillmentStatus, string> = {
    not_fulfilled: 'En préparation',
    partially_fulfilled: 'Préparation partielle',
    fulfilled: 'Prête',
    shipped: 'En livraison',
    delivered: 'Livrée',
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

function contactSupport() {
  navigateTo('/contact')
}
</script>
