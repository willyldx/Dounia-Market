<template>
  <div class="min-h-screen bg-background pt-24 pb-24">
    <!-- Hero -->
    <section class="relative py-20 overflow-hidden">
      <!-- Minimalist abstract grid background -->
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(circle at center, #000 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <div class="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <div 
          v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
          class="w-20 h-20 mx-auto rounded-[2rem] bg-card border border-border shadow-premium flex items-center justify-center mb-8 relative group"
        >
           <div class="absolute inset-0 bg-brand opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
          <MapPin class="w-8 h-8 text-foreground group-hover:text-brand-foreground transition-colors duration-500 relative z-10" />
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
      <div class="bg-card rounded-[2rem] border border-border shadow-premium p-8 sm:p-10 mb-10 glass-strong">
        <form @submit.prevent="trackOrder" class="relative">
          <label class="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Référence du Dossier</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-grow">
              <Package class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
              <input 
                v-model="orderNumber" 
                type="text" 
                placeholder="Ex: TCB-2024-001234" 
                class="block w-full pl-14 pr-6 py-5 bg-muted/30 border border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-brand focus:bg-card transition-all shadow-sm"
                required 
              />
            </div>
            <button type="submit" :disabled="isSearching" class="px-10 py-5 bg-brand text-brand-foreground font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-brand/90 transition-all shadow-premium glow-accent active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto w-full shrink-0">
              <Loader v-if="isSearching" class="w-5 h-5 animate-spin text-brand-foreground/60" />
               <Search v-else class="w-5 h-5 text-brand-foreground/60" />
              <span v-if="!isSearching">Scanner</span>
              <span v-else>Analyse...</span>
            </button>
          </div>
           <!-- Optical scan line effect when searching -->
            <div v-if="isSearching" class="absolute -bottom-10 left-0 right-0 h-0.5 bg-brand/10 overflow-hidden rounded-full">
               <div class="w-1/3 h-full bg-brand rounded-full animate-[wiggle_1s_ease-in-out_infinite]"></div>
            </div>
        </form>
      </div>

      <!-- Order Found Result -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="order" class="bg-card rounded-[2rem] border border-border shadow-premium overflow-hidden relative glass-strong">
           <div class="absolute top-0 right-0 w-32 h-32 bg-muted/30 rounded-bl-[100px] pointer-events-none -z-0"></div>
           
          <!-- Premium Order Header -->
          <div class="p-8 sm:p-10 border-b border-border/50 relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-2">Votre commande</p>
              <p class="text-3xl font-black text-foreground tracking-tight">{{ order.reference }}</p>
              <div v-if="order.recipient_name" class="mt-4 flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-xl inline-flex border border-border">
                 <User class="w-4 h-4 text-muted-foreground/60" />
                 <span class="text-sm font-bold text-foreground">{{ order.recipient_name }} <span class="text-muted-foreground/80 font-medium">| {{ order.shipping_city }}</span></span>
              </div>
            </div>
            
            <span class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border"
              :class="order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-sm' : 'bg-brand text-brand-foreground shadow-premium glow-accent border-brand'"
            >
              {{ order.status === 'delivered' ? 'Dossier Clos' : 'En Opération' }}
            </span>
          </div>
          
          <!-- Ultra Sleek Timeline -->
          <div class="p-8 sm:p-10 bg-muted/10">
             <div class="flex items-center justify-between mb-8">
                <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avancement</span>
                <span class="text-lg font-black text-foreground">{{ Math.round(completedPercent) }}%</span>
             </div>
             
             <!-- Smooth Progress Bar -->
             <div class="h-2 bg-muted rounded-full mb-12 overflow-hidden shadow-inner border border-border/50">
                <div 
                  class="h-full bg-brand rounded-full transition-all duration-1000 ease-out relative"
                  :style="{ width: `${completedPercent}%` }"
                >
                   <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
             </div>

            <div class="relative max-w-lg mx-auto">
              <!-- Thin structural line -->
              <div class="absolute left-[27px] top-4 bottom-4 w-px bg-border" />
              
              <div v-for="(step, i) in order.timeline" :key="i" class="relative pl-16 pb-10 last:pb-0 group">
                <!-- Status Node -->
                <div 
                  class="absolute left-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-card shadow-sm"
                  :class="step.completed 
                    ? 'bg-brand text-brand-foreground scale-100 shadow-premium' 
                    : 'bg-muted text-muted-foreground/60 scale-90'"
                >
                  <Check v-if="step.completed && i !== order.timeline.length - 1" class="w-5 h-5" />
                  <component v-else :is="step.icon" class="w-5 h-5 text-accent" />
                  
                  <!-- Radar pulse for current active step -->
                  <div v-if="step.completed && i === order.timeline.filter(s=>s.completed).length - 1 && order.status !== 'delivered'" class="absolute -inset-2 rounded-2xl border-2 border-brand animate-ping opacity-20"></div>
                </div>
                
                <div class="pt-2">
                  <p class="text-xl font-black tracking-tight" :class="step.completed ? 'text-foreground' : 'text-muted-foreground/60'">
                    {{ step.title }}
                  </p>
                  <p v-if="step.detail" class="text-sm font-medium leading-relaxed mt-2" :class="step.completed ? 'text-muted-foreground' : 'text-muted-foreground/40'">
                    {{ step.detail }}
                  </p>
                  <p class="text-xs font-bold uppercase tracking-widest mt-3" :class="step.completed ? 'text-muted-foreground/80' : 'text-muted-foreground/40'">
                    {{ step.date || 'En attente' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- VIP Delivery Photo Proof -->
          <div v-if="order.delivery_photo" class="p-8 sm:p-10 border-t border-border/50">
            <div class="bg-brand rounded-[2rem] p-6 sm:p-8 text-brand-foreground relative overflow-hidden shadow-premium-lg">
               <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               <div class="flex items-center gap-3 mb-6 relative z-10">
                  <Camera class="w-5 h-5 text-brand-foreground/60" />
                  <p class="text-sm font-bold uppercase tracking-widest text-brand-foreground">Preuve visuelle de remise</p>
               </div>
              <img
                :src="order.delivery_photo"
                alt="Preuve certifiée de livraison"
                class="w-full rounded-2xl object-cover border border-brand-foreground/10 shadow-xl max-h-96 relative z-10"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="p-8 sm:p-10 border-t border-border/50 flex justify-center">
            <NuxtLink to="/contact" class="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-muted hover:border-border transition-all shadow-sm active:scale-95 bg-card">
              <MessageCircle class="w-5 h-5 text-muted-foreground/60" />
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
        <div v-if="notFound" class="bg-card rounded-[2rem] border border-red-500/20 p-12 text-center shadow-premium-lg glass-strong">
          <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <SearchX class="w-10 h-10 text-red-500" />
          </div>
           <h3 class="text-2xl font-black text-foreground mb-3 tracking-tight">Référence introuvable</h3>
           <p class="text-muted-foreground font-medium mb-10 max-w-sm mx-auto leading-relaxed">
             Le radar logistique ne détecte aucun bordereau pour "<span class="font-bold text-foreground">{{ orderNumber }}</span>". Vérifiez l'exactitude de la référence.
           </p>
          <NuxtLink to="/contact" class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent">
            <MessageCircle class="w-4 h-4 text-brand-foreground/60" />
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
