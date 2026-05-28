<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6 py-24">
    <div class="max-w-lg w-full">
      <div class="text-center mb-10">
        <div class="relative inline-block group">
           <div class="absolute inset-0 rounded-full scale-150 opacity-40 blur-2xl transition-all duration-1000"
                :class="confirmationState === 'captured' ? 'bg-[var(--color-accent)]' : 'bg-muted-foreground/30'"></div>
           
          <div class="w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-md relative z-10 border-4 border-background"
               :class="confirmationState === 'captured' ? 'bg-brand animate-bounce-once' : 'bg-muted'">
            <CheckIcon v-if="confirmationState === 'captured'" class="w-12 h-12 text-brand-foreground" />
            <LoaderIcon v-else-if="confirmationState === 'checking' || confirmationState === 'awaiting'" class="w-12 h-12 text-muted-foreground animate-spin" />
            <InfoIcon v-else-if="confirmationState === 'disabled'" class="w-12 h-12 text-muted-foreground" />
            <AlertIcon v-else class="w-12 h-12 text-destructive" />
          </div>
          
          <div v-if="confirmationState === 'captured'" class="absolute inset-0 pointer-events-none z-20">
            <div class="absolute top-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-confetti-1 shadow-sm"></div>
            <div class="absolute top-0 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-confetti-2 shadow-sm"></div>
            <div class="absolute top-1/4 left-0 w-1.5 h-1.5 bg-white rounded-full animate-confetti-3 shadow-sm"></div>
            <div class="absolute top-1/4 right-0 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-confetti-4 shadow-sm"></div>
          </div>
        </div>
      </div>

      <div class="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <div class="p-6 sm:p-10 text-center pb-8 border-b border-border/50">
          <h1 class="text-3xl font-bold text-foreground mb-3 tracking-tight">
            {{ confirmationTitle }}
          </h1>
          <p class="text-muted-foreground font-medium leading-relaxed">
            {{ confirmationDetail }}
          </p>
        </div>

        <div class="p-6 sm:p-10 space-y-8 bg-muted/20">
          <!-- Order Number -->
          <div class="bg-card border border-border rounded-lg p-5 sm:p-6 text-center shadow-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Référence de commande</p>
            <p class="text-xl sm:text-3xl font-bold text-foreground font-mono tracking-wider break-all">{{ orderId }}</p>
          </div>

          <div v-if="confirmationState !== 'captured'" class="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            <p v-if="confirmationState === 'disabled'">
              La validation en ligne n'est pas ouverte actuellement. Contactez l'équipe si vous avez besoin d'informations sur une commande.
            </p>
            <p v-else-if="confirmationState === 'awaiting' || confirmationState === 'checking'">
              Cette page se met à jour automatiquement lorsque Dounia Market Tchad reçoit la confirmation associée à votre référence.
            </p>
            <p v-else>
              Aucune validation ne peut être rattachée à cette commande. Contactez le support avec votre référence si nécessaire.
            </p>
          </div>

          <div v-else class="space-y-6 pt-4">
            <h3 class="font-bold text-foreground text-lg">Prochaines étapes</h3>
            
            <div class="relative pl-4 space-y-8 border-l-2 border-border ml-4">
               <div class="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-card bg-brand"></div>
               
               <div class="-mt-1.5">
                  <p class="font-bold text-foreground">Commande confirmée</p>
                  <p class="text-sm font-medium text-muted-foreground mt-1">Votre référence est enregistrée pour le suivi.</p>
               </div>

               <div class="absolute -left-[11px] top-[70px] w-5 h-5 rounded-full border-4 border-card bg-accent animate-pulse"></div>
               
               <div class="pt-2">
                  <p class="font-bold text-foreground">Préparation locale à N'Djamena</p>
                  <p class="text-sm font-medium text-muted-foreground mt-1">Livraison selon les zones couvertes et les informations fournies.</p>
               </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-4 pt-8 border-t border-border mt-8">
            <NuxtLink
              v-if="authStore.isAuthenticated"
              :to="`/compte/commandes`"
              class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-12"
            >
              <PackageIcon class="w-4 h-4 text-brand-foreground/70 mr-2" /> Mes commandes
            </NuxtLink>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink
                to="/suivi"
                class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12"
              >
                Suivre en ligne
              </NuxtLink>
              <NuxtLink
                to="/"
                class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground h-12"
              >
                Accueil
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
         <p class="text-sm font-bold text-muted-foreground inline-flex items-center gap-2">
           <MapPinIcon class="w-4 h-4" /> Livraison locale Dounia Market Tchad à N'Djamena
         </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle as AlertIcon, Check as CheckIcon, Info as InfoIcon, LoaderCircle as LoaderIcon, MapPin as MapPinIcon, Package as PackageIcon } from 'lucide-vue-next'
import type { PublicOrderStatus } from '~/types'

definePageMeta({
  layout: false,
  middleware: ['auth']
})

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const config = useRuntimeConfig()
const checkoutPaymentEnabled = computed(() => String(config.public.checkoutPaymentEnabled) === 'true')

const orderId = computed(() => {
  return route.query.order as string || 'DM-XXXXXXX'
})

type ConfirmationState = 'checking' | 'awaiting' | 'captured' | 'failed' | 'invalid' | 'disabled'

const confirmationState = ref<ConfirmationState>('checking')
const paymentReference = computed(() => {
  return (route.query.reference || route.query.trxref || '') as string
})

const confirmationTitle = computed(() => {
  if (confirmationState.value === 'captured') return 'Commande confirmée'
  if (confirmationState.value === 'disabled') return 'Validation indisponible'
  if (confirmationState.value === 'failed' || confirmationState.value === 'invalid') return 'Validation non confirmée'
  return 'Validation en cours'
})

const confirmationDetail = computed(() => {
  if (confirmationState.value === 'captured') return 'La préparation locale peut maintenant commencer pour la livraison prévue.'
  if (confirmationState.value === 'disabled') return 'La validation de commande sera proposée lors de l’ouverture du service.'
  if (confirmationState.value === 'failed' || confirmationState.value === 'invalid') return 'Nous ne pouvons pas valider cette commande à partir de la référence reçue.'
  return 'Nous vérifions la référence associée à votre commande.'
})

let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollingAttempts = 0

async function refreshPaymentStatus() {
  try {
    const status = await $fetch<PublicOrderStatus>(`/api/order-status/${encodeURIComponent(orderId.value)}`)

    if (status.payment_status === 'captured') {
      confirmationState.value = 'captured'
      cartStore.clearCart()
      return
    }

    if (status.payment_status === 'failed') {
      confirmationState.value = 'failed'
      return
    }

    confirmationState.value = 'awaiting'
    if (pollingAttempts++ < 30) {
      pollTimer = setTimeout(refreshPaymentStatus, 2000)
    }
  } catch {
    confirmationState.value = 'invalid'
  }
}

onMounted(async () => {
  if (!checkoutPaymentEnabled.value) {
    confirmationState.value = 'disabled'
    return
  }

  if (!orderId.value || orderId.value === 'DM-XXXXXXX') {
    confirmationState.value = 'invalid'
    return
  }

  if (paymentReference.value) {
    try {
      await $fetch('/api/verify-payment', {
        method: 'POST',
        body: {
          orderReference: orderId.value,
          paymentReference: paymentReference.value,
        },
      })
    } catch {
      confirmationState.value = 'invalid'
      return
    }
  }

  await refreshPaymentStatus()
})

onUnmounted(() => {
  if (pollTimer) clearTimeout(pollTimer)
})

useSeoMeta({
  title: `Commande ${orderId.value} | Dounia Market Tchad`,
  description: 'Suivez la confirmation et la preparation locale de votre commande Dounia Market Tchad.',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<style scoped>
@keyframes bounce-once {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes confetti-1 {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(-40px, -80px) rotate(360deg); opacity: 0; }
}

@keyframes confetti-2 {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(40px, -80px) rotate(-360deg); opacity: 0; }
}

@keyframes confetti-3 {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(-60px, -20px) rotate(180deg); opacity: 0; }
}

@keyframes confetti-4 {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(60px, -20px) rotate(-180deg); opacity: 0; }
}

.animate-bounce-once {
  animation: bounce-once 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-confetti-1 {
  animation: confetti-1 1.2s ease-out forwards;
}

.animate-confetti-2 {
  animation: confetti-2 1.2s ease-out 0.1s forwards;
}

.animate-confetti-3 {
  animation: confetti-3 1.2s ease-out 0.2s forwards;
}

.animate-confetti-4 {
  animation: confetti-4 1.2s ease-out 0.3s forwards;
}
</style>
