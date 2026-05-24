<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6 py-24">
    <div class="max-w-lg w-full">
      <!-- Premium Success / Waiting Animation -->
      <div class="text-center mb-10">
        <div class="relative inline-block group">
           <div class="absolute inset-0 rounded-full scale-150 opacity-40 blur-2xl transition-all duration-1000"
                :class="isPaid ? 'bg-[var(--color-accent)]' : (isMobileMoney ? 'bg-orange-500' : 'bg-[var(--color-accent)]')"></div>
           
          <!-- Paid State -->
          <div v-if="isPaid" class="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto shadow-md relative z-10 border-4 border-background animate-bounce-once">
            <CheckIcon class="w-12 h-12 text-primary-foreground" />
          </div>
          <!-- Awaiting State (Mobile Money) -->
          <div v-else-if="isMobileMoney" class="w-28 h-28 bg-brand rounded-full flex items-center justify-center mx-auto shadow-2xl relative z-10 border-4 border-card">
             <div class="absolute inset-0 rounded-full border-2 border-orange-500/50 animate-ping"></div>
             <Smartphone class="w-12 h-12 text-brand-foreground animate-pulse" />
          </div>
          <!-- Default Success -->
          <div v-else class="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto shadow-md relative z-10 border-4 border-background animate-bounce-once">
            <CheckIcon class="w-12 h-12 text-primary-foreground" />
          </div>
          
          <!-- Subtle Sparkles effect instead of tacky confetti -->
          <div v-if="isPaid || !isMobileMoney" class="absolute inset-0 pointer-events-none z-20">
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
            {{ isPaid ? 'Paiement sécurisé !' : (isMobileMoney ? 'Attente du transfert' : 'Commande confirmée !') }}
          </h1>
          <p class="text-muted-foreground font-medium leading-relaxed">
            {{ isPaid ? "La logistique prend le relais. Merci de votre confiance." : (isMobileMoney ? 'Finalisez votre paiement pour valider' : "Votre commande a bien été enregistrée.") }}
          </p>
        </div>

        <div class="p-10 space-y-8 bg-muted/20">
          <!-- Order Number -->
          <div class="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Référence Commande</p>
            <p class="text-3xl font-black text-foreground font-mono tracking-wider">{{ orderId }}</p>
          </div>

          <!-- Mobile Money Instructions (Pending) -->
          <div v-if="isMobileMoney && !isPaid" class="bg-card border-2 border-orange-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
             <div class="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
            <div class="flex items-center gap-3 text-orange-600 font-black tracking-tight mb-4 text-lg">
               <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                 <Smartphone class="w-4 h-4" />
               </div>
               Action requise
            </div>
            <div class="text-sm font-medium text-muted-foreground space-y-4">
              <p>Veuillez effectuer le transfert exact de <b class="text-foreground bg-orange-500/10 px-1 rounded">{{ amount }}</b> :</p>
              <div class="bg-muted p-4 rounded-xl border border-border">
                 <p class="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">Guichet Airtel Tchad</p>
                 <p class="text-xl font-mono font-black text-foreground tracking-wider">+235 85 96 25 92</p>
              </div>
            </div>
            
            <!-- Polling indicator -->
            <div class="flex items-center justify-center gap-3 pt-6 mt-4 border-t border-border">
              <LoaderIcon class="w-4 h-4 text-orange-500 animate-spin" />
              <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Scrutation en cours ({{ pollCountdown }}s)
              </span>
            </div>
          </div>

          <!-- Payment Confirmed (Mobile Money Success) -->
          <div v-if="isMobileMoney && isPaid" class="bg-primary rounded-xl p-6 text-primary-foreground shadow-sm">
            <div class="flex items-center gap-3 font-black text-lg mb-2">
               <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                 <CheckIcon class="w-5 h-5 text-primary-foreground" />
               </div>
               Transfert Validé
            </div>
            <p class="text-sm text-brand-foreground/80 font-medium">
              Nos systèmes ont bien identifié votre paiement. L'ordre de préparation vient d'être envoyé à l'équipe.
            </p>
          </div>

          <!-- What's Next Tracker -->
          <div class="space-y-6 pt-4">
            <h3 class="font-black text-foreground text-lg">Suivi de l'opération</h3>
            
            <div class="relative pl-4 space-y-8 border-l-2 border-border ml-4">
               <div class="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-card"
                    :class="isPaid || !isMobileMoney ? 'bg-brand' : 'bg-muted-foreground/30'"></div>
               
               <div class="-mt-1.5">
                  <p class="font-bold text-foreground">{{ isMobileMoney && !isPaid ? 'Attente d\'autorisation' : 'Paiement crypté validé' }}</p>
                  <p class="text-sm font-medium text-muted-foreground mt-1">{{ isMobileMoney && !isPaid ? 'Transfert local en cours de vérification par API' : 'Les fonds ont bien été sécurisés.' }}</p>
               </div>

               <div class="absolute -left-[11px] top-[70px] w-5 h-5 rounded-full border-4 border-card"
                    :class="isPaid || !isMobileMoney ? 'bg-accent animate-pulse' : 'bg-muted-foreground/20'"></div>
               
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
import { Check as CheckIcon, Package as PackageIcon, Smartphone, Loader as LoaderIcon, ShieldCheck as ShieldCheckIcon } from 'lucide-vue-next'

definePageMeta({
  layout: false,
  middleware: ['auth']
})

const route = useRoute()
const authStore = useAuthStore()

const orderId = computed(() => {
  return route.query.order as string || 'TCB-XXXXXXX'
})

const isMobileMoney = computed(() => {
  return route.query.method === 'tchad_mobile_money'
})

const amount = computed(() => {
  return route.query.amount as string || '0 FCFA'
})

// Payment status polling for Mobile Money
const isPaid = ref(false)
const pollCountdown = ref(10)
let pollInterval: ReturnType<typeof setInterval> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null

async function checkPaymentStatus() {
  if (!orderId.value || orderId.value === 'TCB-XXXXXXX') return
  
  try {
    const result = await $fetch<{
      reference: string
      payment_status: string
      status: string
    }>(`/api/order-status/${encodeURIComponent(orderId.value)}`)

    if (result.payment_status === 'captured') {
      isPaid.value = true
      stopPolling()
    }
  } catch (error) {
    console.error('Status check failed:', error)
  }
}

function startPolling() {
  if (!isMobileMoney.value) return
  
  checkPaymentStatus()

  pollInterval = setInterval(() => {
    checkPaymentStatus()
    pollCountdown.value = 10
  }, 10000)

  countdownInterval = setInterval(() => {
    if (pollCountdown.value > 0) {
      pollCountdown.value--
    }
  }, 1000)
}

function stopPolling() {
  if (pollInterval) clearInterval(pollInterval)
  if (countdownInterval) clearInterval(countdownInterval)
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
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
