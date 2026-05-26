<template>
  <div class="min-h-screen bg-background pt-24 pb-24">
    <section class="relative py-14 sm:py-16 overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(circle at center, #000 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <div class="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <div 
          v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
          class="w-14 h-14 mx-auto rounded-lg bg-card border border-border shadow-sm flex items-center justify-center mb-6 relative"
        >
          <MapPin class="w-7 h-7 text-foreground relative z-10" />
        </div>
        <h1 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
        >
          Suivi de commande
        </h1>
        <p 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Consultez l'avancement de votre commande livrée localement à N'Djamena.
        </p>
      </div>
    </section>

    <div class="max-w-2xl mx-auto px-6 pb-20">
      <div class="bg-card rounded-lg border border-border shadow-sm p-6 sm:p-8 mb-6">
        <form @submit.prevent="trackOrder" class="relative">
          <label class="block text-sm font-medium text-foreground mb-3">Référence de commande</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-grow">
              <Package class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
              <input 
                v-model="orderNumber" 
                type="text" 
                placeholder="Saisissez votre référence"
                class="block w-full pl-12 pr-4 h-12 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-brand transition-all shadow-sm"
                required 
              />
            </div>
            <button type="submit" :disabled="isSearching" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-8 sm:w-auto w-full shrink-0">
              <Loader v-if="isSearching" class="w-4 h-4 animate-spin mr-2" />
              <Search v-else class="w-4 h-4 mr-2" />
              <span v-if="!isSearching">Rechercher</span>
              <span v-else>Recherche...</span>
            </button>
          </div>
        </form>
        <div class="mt-5 flex items-start gap-3 rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
          <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
          <p>Saisissez uniquement la référence de commande. Ne partagez pas ici de nom, adresse ou numéro de téléphone.</p>
        </div>
      </div>

      <!-- Order Found Result -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="order" class="bg-card rounded-lg border border-border shadow-sm overflow-hidden relative">
           
          <div class="p-6 sm:p-8 border-b border-border/50 relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6 bg-muted/30">
            <div>
              <p class="text-xs font-medium text-muted-foreground mb-1">Commande</p>
              <p class="text-2xl font-bold text-foreground tracking-tight">{{ order.reference }}</p>
            </div>
            
            <span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border"
              :class="order.fulfillment_status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-brand/10 text-brand border-brand/20'"
            >
              {{ order.fulfillment_status === 'delivered' ? 'Livrée' : 'En cours' }}
            </span>
          </div>
          
          <div class="p-6 sm:p-8">
             <div class="flex items-center justify-between mb-6">
                <span class="text-xs font-medium text-muted-foreground">Avancement</span>
                <span class="text-sm font-bold text-foreground">{{ Math.round(completedPercent) }}%</span>
             </div>
             
             <div class="h-1.5 bg-muted rounded-full mb-10 overflow-hidden shadow-inner border border-border/50">
                <div 
                  class="h-full bg-brand rounded-full transition-all duration-1000 ease-out relative"
                  :style="{ width: `${completedPercent}%` }"
                >
                </div>
             </div>

            <div class="relative max-w-lg mx-auto">
              <div class="absolute left-6 top-4 bottom-4 w-px bg-border" />
              
              <div v-for="(step, i) in order.timeline" :key="i" class="relative pl-14 pb-8 last:pb-0 group">
                <div 
                  class="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border border-background shadow-sm"
                  :class="step.completed 
                    ? 'bg-brand text-brand-foreground'
                    : 'bg-muted text-muted-foreground'"
                >
                  <component :is="timelineIcons[step.key] || Package" class="w-4 h-4" />
                </div>
                
                <div class="pt-1.5">
                  <p class="text-base font-bold tracking-tight" :class="step.completed ? 'text-foreground' : 'text-muted-foreground'">
                    {{ step.title }}
                  </p>
                  <p v-if="step.detail" class="text-sm font-medium leading-relaxed mt-1" :class="step.completed ? 'text-muted-foreground' : 'text-muted-foreground/40'">
                    {{ step.detail }}
                  </p>
                  <p class="text-[10px] font-bold uppercase tracking-widest mt-2" :class="step.completed ? 'text-muted-foreground' : 'text-muted-foreground/40'">
                    {{ step.date || 'En attente' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="p-6 sm:p-8 border-t border-border flex justify-center bg-muted/10">
            <NuxtLink to="/contact" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              <MessageCircle class="w-4 h-4 mr-2" />
              Contacter le support
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Not Found Error State -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
      >
        <div v-if="notFound" class="bg-card rounded-lg border border-destructive/20 p-8 sm:p-12 text-center shadow-sm">
          <div class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <SearchX class="w-8 h-8 text-destructive" />
          </div>
           <h3 class="text-xl font-bold text-foreground mb-2">Référence introuvable</h3>
           <p class="text-muted-foreground mb-8 max-w-sm mx-auto">
             Aucune commande ne correspond à cette référence. Vérifiez la saisie ou contactez l'assistance.
           </p>
          <NuxtLink to="/contact" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-8">
            <MessageCircle class="w-4 h-4 mr-2" />
            Contacter l'assistance
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Search, Check, SearchX, Package, MessageCircle, Loader, Clock, ShieldCheck } from 'lucide-vue-next'
import type { PublicOrderStatus } from '~/types'

const route = useRoute()
const config = useRuntimeConfig()

const orderNumber = ref((route.query.ref as string) || '')
const order = ref<PublicOrderStatus | null>(null)
const notFound = ref(false)
const isSearching = ref(false)
const timelineIcons = {
  payment: Check,
  processing: Package,
  shipped: Clock,
  delivered: Check,
}

const completedPercent = computed(() => {
  if (!order.value?.timeline) return 0
  const completed = order.value.timeline.filter(step => step.completed).length
  return (completed / order.value.timeline.length) * 100
})

const trackOrder = async () => {
  if (!orderNumber.value.trim()) return
  order.value = null
  notFound.value = false
  isSearching.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const data = await $fetch<PublicOrderStatus>(
      `${config.public.apiUrl}/orders/status/${encodeURIComponent(orderNumber.value.trim())}`
    )
    order.value = data
  } catch (e: any) {
    notFound.value = true
    if (e?.status !== 404) console.error('Tracking error:', e)
  } finally {
    isSearching.value = false
  }
}

onMounted(() => {
  if (orderNumber.value) trackOrder()
})

useSeoMeta({
  title: 'Suivi de commande | Dounia Market Tchad',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(200%); }
}
</style>
