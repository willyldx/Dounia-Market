<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">Suivi</span>
      </nav>

      <section class="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <div class="hero-gradient absolute inset-0 opacity-5"></div>
        <div class="relative z-10">
          <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
            <Truck class="h-8 w-8" :stroke-width="1.5" />
          </div>
          <h1 class="heading-section mb-4 text-3xl sm:text-4xl">
            Où en est votre livraison ?
          </h1>
          <p class="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Saisissez votre référence pour suivre en temps réel l'acheminement de votre colis jusqu'à son destinataire à N'Djamena.
          </p>
        </div>
      </section>

      <div class="mx-auto max-w-2xl pb-20">
        <!-- Formulaire -->
        <div class="mb-8 rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
          <form @submit.prevent="trackOrder">
            <label class="mb-3 block text-sm font-bold text-foreground">Référence de la commande</label>
            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="relative flex-1">
                <Package class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input 
                  v-model="orderNumber" 
                  type="text" 
                  placeholder="Ex: CMD-12345"
                  class="block h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm font-medium text-foreground outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  required 
                />
              </div>
              <button 
                type="submit" 
                :disabled="isSearching" 
                class="btn-primary h-14 w-full sm:w-auto"
              >
                <span class="px-2">
                  <Loader v-if="isSearching" class="h-4 w-4 animate-spin" />
                  <Search v-else class="h-4 w-4" />
                  {{ isSearching ? 'Recherche...' : 'Suivre mon colis' }}
                </span>
              </button>
            </div>
          </form>
          <div class="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800">
            <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>Saisissez uniquement votre numéro de référence. Ne partagez jamais vos coordonnées personnelles ici.</p>
          </div>
        </div>

        <!-- Résultat : Commande trouvée -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="order" class="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
            
            <!-- En-tête de commande -->
            <div class="border-b border-border/50 bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p class="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Commande n°</p>
                <p class="text-2xl font-black tracking-tight text-foreground">{{ order.reference }}</p>
              </div>
              <span 
                class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                :class="order.fulfillment_status === 'delivered' ? 'border-green-200 bg-green-50 text-green-700' : 'border-amber-200 bg-amber-50 text-amber-700'"
              >
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" :class="order.fulfillment_status === 'delivered' ? 'bg-green-400' : 'bg-amber-400'"></span>
                  <span class="relative inline-flex h-2 w-2 rounded-full" :class="order.fulfillment_status === 'delivered' ? 'bg-green-500' : 'bg-amber-500'"></span>
                </span>
                {{ order.fulfillment_status === 'delivered' ? 'Livrée avec succès' : 'En transit' }}
              </span>
            </div>
            
            <!-- Barre de progression -->
            <div class="p-6 sm:p-8">
               <div class="mb-4 flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avancement</span>
                  <span class="text-sm font-black text-amber-700">{{ Math.round(completedPercent) }}%</span>
               </div>
               
               <div class="mb-10 h-2 overflow-hidden rounded-full bg-muted shadow-inner">
                  <div 
                    class="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out"
                    :style="{ width: `${completedPercent}%` }"
                  ></div>
               </div>

              <!-- Timeline -->
              <div class="relative mx-auto max-w-lg">
                <div class="absolute bottom-4 left-6 top-4 w-px bg-border" />
                
                <div v-for="(step, i) in order.timeline" :key="i" class="group relative pb-8 pl-14 last:pb-0">
                  <div 
                    class="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-card transition-all duration-500"
                    :class="step.completed ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'"
                  >
                    <component :is="timelineIcons[step.key] || Package" class="h-5 w-5" :stroke-width="step.completed ? 2.5 : 1.5" />
                  </div>
                  
                  <div class="pt-1">
                    <p class="text-base font-bold tracking-tight" :class="step.completed ? 'text-foreground' : 'text-muted-foreground'">
                      {{ step.title }}
                    </p>
                    <p v-if="step.detail" class="mt-1.5 text-sm font-medium leading-relaxed" :class="step.completed ? 'text-muted-foreground' : 'text-muted-foreground/50'">
                      {{ step.detail }}
                    </p>
                    <p class="mt-2 text-[10px] font-bold uppercase tracking-widest" :class="step.completed ? 'text-amber-700' : 'text-muted-foreground/40'">
                      {{ step.date || 'En attente' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-center border-t border-border bg-muted/20 p-6 sm:p-8">
              <NuxtLink to="/contact" class="btn-outline">
                <MessageCircle class="h-4 w-4 mr-2" />
                Contacter le service client
              </NuxtLink>
            </div>
          </div>
        </Transition>

        <!-- Résultat : Erreur -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="notFound" class="rounded-2xl border border-red-100 bg-card p-8 text-center shadow-sm sm:p-12">
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <SearchX class="h-10 w-10 text-red-500" />
            </div>
             <h3 class="mb-3 text-2xl font-bold text-foreground">Colis introuvable</h3>
             <p class="mx-auto mb-8 max-w-md text-base text-muted-foreground">
               Nous ne trouvons aucune commande avec cette référence. Vérifiez que vous avez bien saisi le code reçu par email.
             </p>
            <NuxtLink to="/contact" class="btn-primary">
              <span>
                <MessageCircle class="h-4 w-4 mr-2" />
                Demander de l'aide
              </span>
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Search, Check, SearchX, Package, MessageCircle, Loader, Clock, ShieldCheck, Truck, ChevronRight } from 'lucide-vue-next'
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
  shipped: Truck,
  delivered: MapPin,
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
  title: 'Suivi de livraison | Dounia Market Tchad',
  description: 'Suivez en temps réel l\'acheminement de votre commande jusqu\'à N\'Djamena.',
  robots: 'noindex, nofollow, noarchive',
})
</script>
