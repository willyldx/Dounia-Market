<template>
  <div class="bg-background min-h-screen pt-32 pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Minimalist Header -->
      <div class="flex items-center gap-3 text-sm font-medium text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Accueil</NuxtLink>
        <ChevronRight class="w-4 h-4" />
        <span class="text-gray-900">Panier</span>
      </div>
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 reveal-up">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          Mon Panier
          <span v-if="!cartStore.isEmpty" class="px-3 py-1 rounded-lg bg-gray-100 text-gray-900 text-sm font-bold align-middle">
            {{ cartStore.itemCount }}
          </span>
        </h1>
      </div>

      <div v-if="cartStore.isEmpty" class="bg-card rounded-lg border border-border shadow-sm p-8 sm:p-12 text-center max-w-3xl mx-auto mt-10">
        <div class="relative mb-10 group mx-auto w-max">
           <div class="w-24 h-24 rounded-full border border-border bg-background shadow-sm flex items-center justify-center relative z-10">
             <ShoppingBag class="w-10 h-10 text-muted-foreground" />
           </div>
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-4 tracking-tight">Votre panier est vide</h2>
        <p class="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed text-sm">
          Choisissez des produits disponibles localement pour une livraison à vos proches à N'Djamena, selon les zones couvertes.
        </p>
        <NuxtLink to="/catalogue" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-8">
          <ArrowRight class="w-4 h-4 mr-2" /> Sélectionner des produits
        </NuxtLink>
      </div>

      <!-- Cart Content (Layout with Items and Sidebar) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10 reveal-up">
        <!-- Main Cart Items -->
        <div class="lg:col-span-2 space-y-5">
          <TransitionGroup 
            enter-active-class="transition-all duration-300 ease-out" 
            enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition-all duration-200 ease-in" 
            leave-to-class="opacity-0 -translate-x-2"
          >
            <div v-for="item in cartStore.items" :key="item.id" class="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm transition-all">
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <!-- Thumbnail -->
                <div class="w-full h-44 sm:w-28 sm:h-28 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <img 
                    v-if="item.thumbnail" 
                    :src="item.thumbnail" 
                    :alt="item.title"
                    class="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  <Package v-else class="w-10 h-10 text-gray-200" />
                </div>
                
                <!-- Details & Controls -->
                <div class="flex-grow min-w-0 flex flex-col">
                  <div class="flex justify-between items-start gap-3">
                    <div class="min-w-0">
                      <h3 class="text-lg font-bold text-gray-900 mb-1 lg:text-xl">{{ item.title }}</h3>
                      <span v-if="item.variantTitle" class="inline-block text-xs font-bold text-gray-500 tracking-wide uppercase px-2 py-1 bg-gray-50 rounded-md">
                        {{ item.variantTitle }}
                      </span>
                      <span v-else-if="item.category" class="inline-block text-xs font-bold text-gray-500 tracking-wide uppercase px-2 py-1 bg-gray-50 rounded-md">
                        {{ item.category }}
                      </span>
                    </div>
                    <button 
                      @click="removeItem(item.id)" 
                      class="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div class="flex flex-wrap gap-4 items-end justify-between mt-auto pt-4">
                    <!-- Premium Quantity controls -->
                    <div class="flex items-center gap-2 bg-muted border border-border rounded-lg p-1.5">
                      <button 
                        @click="cartStore.decrementQuantity(item.id)" 
                        class="w-8 h-8 rounded-md bg-card hover:shadow-sm text-foreground flex items-center justify-center transition-all disabled:opacity-50"
                        :disabled="item.quantity <= 1"
                      >
                        <Minus class="w-3 h-3" />
                      </button>
                      <span class="w-8 text-center font-bold text-gray-900 text-sm">{{ item.quantity }}</span>
                      <button 
                        @click="cartStore.incrementQuantity(item.id)" 
                        class="w-8 h-8 rounded-md bg-card hover:shadow-sm text-foreground flex items-center justify-center transition-all"
                      >
                        <Plus class="w-3 h-3" />
                      </button>
                    </div>
                    
                    <!-- Price section -->
                    <div class="text-right">
                      <p v-if="item.quantity > 1" class="text-xs text-gray-400 font-medium mb-1">{{ cartStore.formatPrice(item.price) }} unitaire</p>
                      <span class="text-2xl font-black text-gray-900">{{ cartStore.formatPrice(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
          
          <!-- Continue shopping backlink -->
          <NuxtLink 
            to="/catalogue" 
            class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mt-6 px-4"
          >
            <ArrowLeft class="w-4 h-4" /> Continuer mes achats
          </NuxtLink>
        </div>

        <!-- Sticky Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-card rounded-lg p-6 sm:p-8 sticky top-32 text-foreground shadow-sm border border-border flex flex-col">
            <h2 class="text-lg font-bold mb-6 border-b border-border pb-4 tracking-tight">Résumé de la commande</h2>
            
            <!-- Items summary breakdown -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-muted-foreground truncate mr-3 flex-grow">{{ item.title }} <span class="text-muted-foreground/70 ml-1">×{{ item.quantity }}</span></span>
                <span class="font-medium flex-shrink-0">{{ cartStore.formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
            
            <div class="border-t border-border pt-6 mb-6 space-y-4">
              <div class="flex justify-between text-muted-foreground text-sm">
                <span>Sous-total articles</span>
                <span class="text-foreground font-medium">{{ cartStore.subtotalFormatted }}</span>
              </div>
              <div class="flex justify-between text-muted-foreground text-sm">
                <span class="flex items-center gap-2"><Truck class="w-4 h-4" />Livraison locale</span>
                <span class="text-foreground font-medium">À confirmer</span>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Zones couvertes et frais de livraison confirmés avant l'ouverture publique du service.
              </p>
            </div>
            
            <!-- Product subtotal until delivery pricing is confirmed -->
            <div class="border-t border-border pt-6 mb-8 flex justify-between items-end">
              <span class="font-bold text-muted-foreground text-sm">Sous-total produits</span>
              <div class="text-right">
                <span class="text-3xl font-bold tracking-tight">{{ cartStore.subtotalFormatted }}</span>
              </div>
            </div>
            
            <!-- Checkout Action -->
            <NuxtLink v-if="checkoutPaymentEnabled" to="/checkout" class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-8 mb-6">
              Vérifier la livraison <ArrowRight class="w-4 h-4 ml-2" />
            </NuxtLink>
            <NuxtLink v-else to="/contact" class="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-8 mb-6">
              Contacter Dounia Market <ArrowRight class="w-4 h-4 ml-2" />
            </NuxtLink>
            
            <!-- Logistics Badges -->
            <div class="space-y-3 pt-6 border-t border-border">
              <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <component :is="badge.icon" class="w-4 h-4 text-muted-foreground" />
                </div>
                <span class="text-xs font-medium text-foreground tracking-wide">{{ badge.label }}</span>
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
  ChevronRight, ArrowRight, ArrowLeft
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const toast = useToast()
const config = useRuntimeConfig()
const checkoutPaymentEnabled = computed(() => String(config.public.checkoutPaymentEnabled) === 'true')

onMounted(() => cartStore.loadFromStorage())

const removeItem = (itemId: string) => {
  cartStore.removeItem(itemId)
  // Use generic style for toaster
  toast.add({ title: 'Produit retiré', description: "L'article a été enlevé de votre panier.", icon: 'i-heroicons-trash', color: 'gray', timeout: 2000 })
}

const trustBadges = [
  { icon: MapPin, label: 'Livraison locale à N\'Djamena selon les zones couvertes' },
  { icon: ClipboardCheck, label: 'Bénéficiaire et adresse à confirmer à l\'étape suivante' },
  { icon: Truck, label: 'Zones et frais confirmés avant ouverture publique' },
]

useHead({ title: 'Mon Panier | Dounia Market' })
</script>
