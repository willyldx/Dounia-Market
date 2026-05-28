<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">Panier</span>
      </nav>
      
      <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 reveal-up">
        <h1 class="heading-section flex items-center gap-4">
          Votre Panier
          <span v-if="!cartStore.isEmpty" class="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-gold-100 px-3 text-sm font-bold text-gold-700">
            {{ cartStore.itemCount }}
          </span>
        </h1>
      </div>

      <!-- État Vide -->
      <div v-if="cartStore.isEmpty" class="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-center shadow-sm sm:mt-12">
        <div class="hero-gradient px-6 py-12 sm:px-12 sm:py-16 relative">
          <div class="orb orb-amber absolute -right-10 -top-10 h-40 w-40 opacity-20"></div>
          <div class="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-xl">
            <ShoppingBag class="h-10 w-10" :stroke-width="1.5" />
          </div>
          <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl">Votre panier est vide... pour l'instant !</h2>
          <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
            Faites le plein de bonnes choses pour vos proches à N'Djamena. Parcourez notre catalogue et ajoutez ce dont ils ont besoin.
          </p>
          <NuxtLink to="/catalogue" class="btn-primary mt-8">
            <span>
              Remplir mon panier
              <ArrowRight class="h-4 w-4" :stroke-width="2" />
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Contenu du Panier -->
      <div v-else class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px] xl:gap-12 reveal-up">
        
        <!-- Liste des articles -->
        <div class="flex flex-col gap-4 sm:gap-5">
          <TransitionGroup 
            enter-active-class="transition-all duration-300 ease-out" 
            enter-from-class="opacity-0 translate-y-4"
            leave-active-class="transition-all duration-200 ease-in absolute w-full" 
            leave-to-class="opacity-0 scale-95"
            class="relative flex flex-col gap-4 sm:gap-5"
            tag="div"
          >
            <div v-for="item in cartStore.items" :key="item.id" class="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-gold-200 hover:shadow-md sm:flex-row sm:p-5">
              
              <!-- Image -->
              <NuxtLink :to="`/produit/${item.id}`" class="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f8f5ef] sm:h-32 sm:w-32">
                <img 
                  v-if="item.thumbnail" 
                  :src="item.thumbnail" 
                  :alt="item.title"
                  class="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                />
                <Package v-else class="h-8 w-8 text-muted-foreground/30" />
              </NuxtLink>
              
              <!-- Détails -->
              <div class="flex flex-1 flex-col">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <span v-if="item.variantTitle || item.category" class="mb-1.5 inline-block rounded-md bg-gold-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">
                      {{ item.variantTitle || item.category }}
                    </span>
                    <NuxtLink :to="`/produit/${item.id}`">
                      <h3 class="line-clamp-2 text-base font-bold text-foreground transition-colors hover:text-gold-700 sm:text-lg">
                        {{ item.title }}
                      </h3>
                    </NuxtLink>
                  </div>
                  <button 
                    @click="removeItem(item.id)" 
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 class="h-4 w-4" :stroke-width="2" />
                  </button>
                </div>
                
                <div class="mt-auto pt-4 flex flex-wrap items-end justify-between gap-4">
                  <!-- Quantité -->
                  <div class="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-sm">
                    <button 
                      @click="cartStore.decrementQuantity(item.id)" 
                      class="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                      :disabled="item.quantity <= 1"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus class="h-3.5 w-3.5" :stroke-width="2" />
                    </button>
                    <span class="w-8 text-center text-sm font-bold text-foreground">{{ item.quantity }}</span>
                    <button 
                      @click="cartStore.incrementQuantity(item.id)" 
                      class="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-foreground transition-colors hover:bg-muted"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus class="h-3.5 w-3.5" :stroke-width="2" />
                    </button>
                  </div>
                  
                  <!-- Prix -->
                  <div class="text-right">
                    <p v-if="item.quantity > 1" class="mb-0.5 text-xs font-medium text-muted-foreground">{{ cartStore.formatPrice(item.price) }} / unité</p>
                    <span class="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ cartStore.formatPrice(item.price * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
          
          <NuxtLink to="/catalogue" class="mt-4 inline-flex items-center gap-2 self-start text-sm font-bold text-gold-700 transition-colors hover:text-gold-800">
            <ArrowLeft class="h-4 w-4" :stroke-width="2.5" /> 
            Continuer mes achats
          </NuxtLink>
        </div>

        <!-- Résumé de la commande -->
        <div class="sticky top-24 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
          <div class="bg-[#faf8f5] px-6 py-5 border-b border-border">
            <h2 class="text-lg font-bold text-foreground">Résumé de la commande</h2>
          </div>
          
          <div class="p-6">
            <div class="mb-6 space-y-3">
              <div class="flex items-center justify-between text-sm text-muted-foreground">
                <span>Sous-total ({{ cartStore.itemCount }} articles)</span>
                <span class="font-medium text-foreground">{{ cartStore.subtotalFormatted }}</span>
              </div>
              <div class="flex items-start justify-between text-sm text-muted-foreground">
                <span class="flex items-center gap-2 pt-0.5">
                  <Truck class="h-4 w-4 text-gold-600" />
                  Livraison à N'Djamena
                </span>
                <span class="font-medium text-foreground text-right">Calculée à l'étape suivante</span>
              </div>
            </div>
            
            <div class="mb-8 flex items-end justify-between border-t border-border pt-6">
              <span class="text-base font-bold text-foreground">Total estimé</span>
              <span class="font-display text-3xl font-semibold tracking-tight text-foreground">{{ cartStore.subtotalFormatted }}</span>
            </div>
            
            <!-- Actions -->
            <div class="space-y-3">
              <NuxtLink v-if="checkoutPaymentEnabled" to="/checkout" class="btn-primary w-full">
                <span class="w-full justify-between">
                  Valider mon panier
                  <ArrowRight class="h-4 w-4" :stroke-width="2" />
                </span>
              </NuxtLink>
              <NuxtLink v-else to="/contact" class="btn-primary w-full">
                <span class="w-full justify-center">
                  Contacter Dounia Market
                </span>
              </NuxtLink>
              
              <div class="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                <Lock class="h-3.5 w-3.5" />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
          
          <!-- Badges de réassurance -->
          <div class="bg-muted/30 px-6 py-5 border-t border-border">
            <div class="space-y-4">
              <div v-for="badge in trustBadges" :key="badge.label" class="flex items-start gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gold-700 shadow-sm">
                  <component :is="badge.icon" class="h-4 w-4" :stroke-width="2" />
                </div>
                <p class="pt-1.5 text-xs font-medium leading-snug text-muted-foreground">{{ badge.label }}</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ShoppingBag, Package, Trash2, Minus, Plus, Truck, MapPin, ClipboardCheck,
  ChevronRight, ArrowRight, ArrowLeft, Lock, Camera
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const toast = useToast()
const config = useRuntimeConfig()
const checkoutPaymentEnabled = computed(() => String(config.public.checkoutPaymentEnabled) === 'true')

onMounted(() => cartStore.loadFromStorage())

const removeItem = (itemId: string) => {
  cartStore.removeItem(itemId)
  toast.add({ 
    title: 'Produit retiré', 
    description: "L'article a été enlevé de votre panier.", 
    icon: 'i-heroicons-trash', 
    color: 'gray', 
    timeout: 2500 
  })
}

const trustBadges = [
  { icon: MapPin, label: "Livraison locale sécurisée dans les quartiers de N'Djamena." },
  { icon: Camera, label: "Preuve photo envoyée lors de la remise en main propre." },
  { icon: ClipboardCheck, label: "Assistance client dédiée pour suivre votre commande." },
]

useSeoMeta({ title: 'Mon panier | Dounia Market Tchad', robots: 'noindex, nofollow, noarchive' })
</script>
