<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6 py-24">
    <div class="max-w-lg w-full">
      <!-- Premium Success / Waiting Animation -->
      <div class="text-center mb-10">
        <div class="relative inline-block group">
           <div class="absolute inset-0 rounded-full scale-150 opacity-40 blur-2xl transition-all duration-1000"
                :class="confirmationState === 'captured' ? 'bg-[var(--color-accent)]' : 'bg-muted-foreground/30'"></div>
           
          <div class="w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-md relative z-10 border-4 border-background"
               :class="confirmationState === 'captured' ? 'bg-primary animate-bounce-once' : 'bg-muted'">
            <CheckIcon v-if="confirmationState === 'captured'" class="w-12 h-12 text-primary-foreground" />
            <LoaderIcon v-else-if="confirmationState === 'checking' || confirmationState === 'awaiting'" class="w-12 h-12 text-muted-foreground animate-spin" />
            <AlertIcon v-else class="w-12 h-12 text-destructive" />
          </div>
          
          <!-- Subtle Sparkles effect instead of tacky confetti -->
          <div v-if="confirmationState === 'captured'" class="absolute inset-0 pointer-events-none z-20">
            <div class="absolute top-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-confetti-1 shadow-sm"></div>
            <div class="absolute top-0 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-confetti-2 shadow-sm"></div>
            <div class="absolute top-1/4 left-0 w-1.5 h-1.5 bg-white rounded-full animate-confetti-3 shadow-sm"></div>
            <div class="absolute top-1/4 right-0 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-confetti-4 shadow-sm"></div>
          </div>
        </div>
      </div>

      <!-- Confirmation Receipt Card -->
      <div class="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
        <div class="p-10 text-center pb-8 border-b border-border/50">
          <h1 class="text-3xl font-black text-foreground mb-3 tracking-tight">
            {{ confirmationTitle }}
          </h1>
          <p class="text-muted-foreground font-medium leading-relaxed">
            {{ confirmationDetail }}
          </p>
        </div>

        <div class="p-10 space-y-8 bg-muted/20">
          <!-- Order Number -->
          <div class="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Référence Commande</p>
            <p class="text-3xl font-black text-foreground font-mono tracking-wider">{{ orderId }}</p>
          </div>

          <div v-if="confirmationState !== 'captured'" class="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p v-if="confirmationState === 'awaiting' || confirmationState === 'checking'">
              Cette page se met à jour automatiquement dès que Paystack et Dounia Market ont rapproché le paiement.
            </p>
            <p v-else>
              Aucun paiement confirmé ne peut être rattaché à cette commande. Contactez le support avec votre référence si vous avez été débité.
            </p>
          </div>

          <!-- What's Next Tracker -->
          <div v-else class="space-y-6 pt-4">
            <h3 class="font-black text-foreground text-lg">Suivi de l'opération</h3>
            
            <div class="relative pl-4 space-y-8 border-l-2 border-border ml-4">
               <div class="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-card bg-brand"></div>
               
               <div class="-mt-1.5">
                  <p class="font-bold text-foreground">Paiement crypté validé</p>
                  <p class="text-sm font-medium text-muted-foreground mt-1">Les fonds ont bien été sécurisés.</p>
               </div>

               <div class="absolute -left-[11px] top-[70px] w-5 h-5 rounded-full border-4 border-card bg-accent animate-pulse"></div>
               
               <div class="pt-2">
                  <p class="font-bold text-foreground">Logistique N'Djamena</p>
                  <p class="text-sm font-medium text-muted-foreground mt-1">Préparation du colis pour la livraison finale.</p>
               </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-4 pt-8 border-t border-border mt-8">
            <NuxtLink
              v-if="authStore.isAuthenticated"
              :to="`/compte/commandes`"
              class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              <PackageIcon class="w-4 h-4 text-primary-foreground/70 mr-2" /> Mon Espace Logistique
            </NuxtLink>
            
            <div class="grid grid-cols-2 gap-4">
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

      <!-- Support -->
      <div class="text-center mt-10">
         <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground inline-flex items-center gap-2">
           <ShieldCheckIcon class="w-4 h-4" /> Plateforme sécurisée Dounia Market
         </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle as AlertIcon, Check as CheckIcon, LoaderCircle as LoaderIcon, Package as PackageIcon, ShieldCheck as ShieldCheckIcon } from 'lucide-vue-next'
import type { PublicOrderStatus } from '~/types'

definePageMeta({
  layout: false,
  middleware: ['auth']
})

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()

const orderId = computed(() => {
  return route.query.order as string || 'TCB-XXXXXXX'
})

type ConfirmationState = 'checking' | 'awaiting' | 'captured' | 'failed' | 'invalid'

const confirmationState = ref<ConfirmationState>('checking')
const paystackReference = computed(() => {
  return (route.query.reference || route.query.trxref || '') as string
})

const confirmationTitle = computed(() => {
  if (confirmationState.value === 'captured') return 'Paiement confirmé !'
  if (confirmationState.value === 'failed' || confirmationState.value === 'invalid') return 'Paiement non confirmé'
  return 'Validation du paiement en cours'
})

const confirmationDetail = computed(() => {
  if (confirmationState.value === 'captured') return 'La logistique prend le relais. Merci de votre confiance.'
  if (confirmationState.value === 'failed' || confirmationState.value === 'invalid') return 'Nous ne pouvons pas valider ce paiement pour cette commande.'
  return 'Nous vérifions la référence, le montant et la devise reçus.'
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
  if (!orderId.value || orderId.value === 'TCB-XXXXXXX') {
    confirmationState.value = 'invalid'
    return
  }

  if (paystackReference.value) {
    try {
      await $fetch('/api/verify-payment', {
        method: 'POST',
        body: {
          orderReference: orderId.value,
          paymentReference: paystackReference.value,
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
  title: `Reçu | Commande ${orderId.value} - Dounia Market`,
  description: 'Votre reçu de commande officiel protégé par Dounia Market.',
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
