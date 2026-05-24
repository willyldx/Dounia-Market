<template>
  <div class="min-h-screen bg-background pt-24 pb-24">
    <!-- Hero -->
    <section class="relative py-20 overflow-hidden">
      <!-- Minimalist abstract grid background -->
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(circle at center, #000 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <div class="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <div 
          v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
          class="w-16 h-16 mx-auto rounded-xl bg-card border border-border shadow-sm flex items-center justify-center mb-8 relative"
        >
          <MapPin class="w-8 h-8 text-foreground transition-colors duration-500 relative z-10" />
        </div>
        <h1 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-6"
        >
          Suivi de commande
        </h1>
        <p 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="text-lg font-medium text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          Entrez votre référence pour localiser votre colis en temps réel.
        </p>
      </div>
    </section>

    <div class="max-w-2xl mx-auto px-6 pb-20">
      <!-- Search Form Box -->
      <div class="bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8 mb-8">
        <form @submit.prevent="trackOrder" class="relative">
          <label class="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Référence du Dossier</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-grow">
              <Package class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
              <input 
                v-model="orderNumber" 
                type="text" 
                placeholder="Ex: TCB-2024-001234" 
                class="block w-full pl-12 pr-4 h-12 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary transition-all shadow-sm"
                required 
              />
            </div>
            <button type="submit" :disabled="isSearching" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 sm:w-auto w-full shrink-0">
              <Loader v-if="isSearching" class="w-4 h-4 animate-spin mr-2" />
              <Search v-else class="w-4 h-4 mr-2" />
              <span v-if="!isSearching">Scanner</span>
              <span v-else>Analyse...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Order Found Result -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="order" class="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
           
          <!-- Premium Order Header -->
          <div class="p-6 sm:p-8 border-b border-border/50 relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6 bg-muted/30">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Votre commande</p>
              <p class="text-2xl font-bold text-foreground tracking-tight">{{ order.reference }}</p>
              <div v-if="order.recipient_name" class="mt-4 flex items-center gap-2 bg-background px-3 py-1.5 rounded-md inline-flex border border-border">
                 <User class="w-3.5 h-3.5 text-muted-foreground" />
                 <span class="text-xs font-medium text-foreground">{{ order.recipient_name }} <span class="text-muted-foreground">| {{ order.shipping_city }}</span></span>
              </div>
            </div>
            
            <span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border"
              :class="order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'"
            >
              {{ order.status === 'delivered' ? 'Dossier Clos' : 'En Opération' }}
            </span>
          </div>
          
          <!-- Ultra Sleek Timeline -->
          <div class="p-6 sm:p-8">
             <div class="flex items-center justify-between mb-6">
                <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avancement</span>
                <span class="text-sm font-bold text-foreground">{{ Math.round(completedPercent) }}%</span>
             </div>
             
             <!-- Smooth Progress Bar -->
             <div class="h-1.5 bg-muted rounded-full mb-10 overflow-hidden shadow-inner border border-border/50">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative"
                  :style="{ width: `${completedPercent}%` }"
                >
                </div>
             </div>

            <div class="relative max-w-lg mx-auto">
              <!-- Thin structural line -->
              <div class="absolute left-6 top-4 bottom-4 w-px bg-border" />
              
              <div v-for="(step, i) in order.timeline" :key="i" class="relative pl-14 pb-8 last:pb-0 group">
                <!-- Status Node -->
                <div 
                  class="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border border-background shadow-sm"
                  :class="step.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'"
                >
                  <component :is="step.icon" class="w-4 h-4" />
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
          
          <!-- VIP Delivery Photo Proof -->
          <div v-if="order.delivery_photo" class="p-6 sm:p-8 border-t border-border">
            <div class="bg-muted rounded-xl p-6 relative overflow-hidden">
               <div class="flex items-center gap-3 mb-4 relative z-10">
                  <Camera class="w-4 h-4 text-foreground" />
                  <p class="text-sm font-bold text-foreground">Preuve visuelle de remise</p>
               </div>
              <img
                :src="order.delivery_photo"
                alt="Preuve certifiée de livraison"
                class="w-full rounded-md object-cover border border-border shadow-sm max-h-96 relative z-10"
              />
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
        <div v-if="notFound" class="bg-card rounded-xl border border-destructive/20 p-12 text-center shadow-sm">
          <div class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <SearchX class="w-8 h-8 text-destructive" />
          </div>
           <h3 class="text-xl font-bold text-foreground mb-2">Référence introuvable</h3>
           <p class="text-muted-foreground mb-8 max-w-sm mx-auto">
             Le radar logistique ne détecte aucun bordereau pour "<span class="font-bold text-foreground">{{ orderNumber }}</span>". Vérifiez l'exactitude de la référence.
           </p>
          <NuxtLink to="/contact" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
            <MessageCircle class="w-4 h-4 mr-2" />
            Contacter l'Assistance
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Search, Check, SearchX, Package, Info, MessageCircle, Loader, Clock, User, Camera } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()

const orderNumber = ref((route.query.ref as string) || '')
const order = ref<any>(null)
const notFound = ref(false)
const isSearching = ref(false)

const completedPercent = computed(() => {
  if (!order.value?.timeline) return 0
  const completed = order.value.timeline.filter((s: any) => s.completed).length
  return (completed / order.value.timeline.length) * 100
})

const trackOrder = async () => {
  if (!orderNumber.value.trim()) return
  order.value = null
  notFound.value = false
  isSearching.value = true

  // Artificial delay to feel the radar scanning (luxury feel)
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const data = await $fetch<any>(
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

useHead({ title: 'Suivi de commande | Dounia Market' })
</script>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(200%); }
}
</style>
