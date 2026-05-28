<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="cartStore.isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity" @click="cartStore.closeCart" />
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="translate-x-full"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="cartStore.isOpen" class="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-[110] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-border">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-foreground tracking-tight">Panier</h2>
            <div v-if="cartStore.itemCount > 0" class="px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-bold">
              {{ cartStore.itemCount }}
            </div>
          </div>
          <button @click="cartStore.closeCart" aria-label="Fermer le panier" class="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-grow overflow-y-auto">
          <!-- Empty State -->
          <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full p-10 text-center">
            <div class="relative mb-8">
               <div class="absolute inset-0 bg-gold-100 rounded-full scale-150 opacity-40 blur-2xl"></div>
               <div class="w-28 h-28 rounded-full border border-border bg-card shadow-sm flex items-center justify-center relative z-10">
                 <ShoppingBag class="w-11 h-11 text-gold-700/40" :stroke-width="1.5" />
               </div>
            </div>
            <h3 class="text-xl font-bold text-foreground mb-2 tracking-tight">Votre panier est vide</h3>
            <p class="text-muted-foreground mb-8 leading-relaxed max-w-xs">
              Choisissez des produits à livrer localement par Dounia Market Tchad à vos proches à N'Djamena.
            </p>
            <NuxtLink to="/catalogue" class="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand text-brand-foreground font-semibold rounded-lg hover:bg-brand/90 transition-all shadow-sm w-full" @click="cartStore.closeCart">
              Découvrir le catalogue
            </NuxtLink>
          </div>

          <!-- Items -->
          <div v-else class="p-4 sm:p-5 space-y-3">
            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-gold-200 transition-colors shadow-sm">
              <!-- Item Image -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                <img
                  v-if="item.thumbnail"
                  :src="resolveThumb(item.thumbnail)"
                  :alt="item.title"
                  class="w-full h-full object-contain p-1"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <Package v-else class="w-6 h-6 text-muted-foreground/40" />
              </div>

              <!-- Item Details -->
              <div class="flex-grow min-w-0 flex flex-col justify-center">
                <h4 class="font-semibold text-foreground text-sm truncate mb-1">{{ item.title }}</h4>
                <p v-if="item.variantTitle" class="text-xs text-muted-foreground font-medium truncate">{{ item.variantTitle }}</p>
                <div class="mt-auto pt-2">
                  <p class="font-bold text-foreground">{{ cartStore.formatPrice(item.price) }}</p>
                </div>
              </div>

              <!-- Quantity Controls & Remove -->
              <div class="flex flex-col items-end justify-between">
                <button @click="cartStore.removeItem(item.id)" aria-label="Retirer l'article" class="p-1.5 text-muted-foreground hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg">
                  <Trash2 class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-2 bg-muted rounded-lg p-1 border border-border">
                  <button @click="cartStore.decrementQuantity(item.id)" aria-label="Diminuer" class="w-6 h-6 rounded flex items-center justify-center hover:bg-card hover:shadow-sm text-muted-foreground transition-all">
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-4 text-center text-xs font-bold text-foreground">{{ item.quantity }}</span>
                  <button @click="cartStore.incrementQuantity(item.id)" aria-label="Augmenter" class="w-6 h-6 rounded flex items-center justify-center hover:bg-card hover:shadow-sm text-muted-foreground transition-all">
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Checkout Action -->
        <div v-if="!cartStore.isEmpty" class="border-t border-border p-5 sm:p-6 bg-card shrink-0 z-10">
          <div class="space-y-3 mb-5">
            <div class="flex justify-between text-muted-foreground text-sm font-medium">
              <span>Sous-total produits</span>
              <span class="text-foreground">{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between text-muted-foreground text-sm font-medium">
              <span class="flex items-center gap-2"><Truck class="w-4 h-4" :stroke-width="1.75" />Livraison locale</span>
              <span class="text-foreground">À confirmer</span>
            </div>
            <div class="border-t border-border pt-3 flex justify-between items-end">
              <span class="font-semibold text-foreground text-sm">À régler (hors livraison)</span>
              <span class="font-display text-2xl font-semibold text-foreground tracking-tight">{{ cartStore.formattedSubtotal }}</span>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Zones couvertes et frais de livraison confirmés avant l'ouverture publique du service.
            </p>
          </div>
          
          <NuxtLink v-if="checkoutPaymentEnabled" to="/checkout" class="w-full flex items-center justify-center gap-3 py-4 bg-brand text-brand-foreground font-bold rounded-lg hover:bg-brand/90 transition-all shadow-sm active:scale-[0.98]" @click="cartStore.closeCart">
            <MapPin class="w-4 h-4 text-brand-foreground/70" /> Indiquer la livraison
          </NuxtLink>
          <NuxtLink v-else to="/contact" class="w-full flex items-center justify-center gap-3 py-4 bg-brand text-brand-foreground font-bold rounded-lg hover:bg-brand/90 transition-all shadow-sm active:scale-[0.98]" @click="cartStore.closeCart">
            Contacter Dounia Market Tchad
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ShoppingBag, X, Package, Trash2, Minus, Plus, Truck, MapPin } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const config = useRuntimeConfig()
const checkoutPaymentEnabled = computed(() => String(config.public.checkoutPaymentEnabled) === 'true')

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.douniamarket.com/${path}`
  if (path.startsWith('/storage/')) return `https://api.douniamarket.com${path}`
  return path
}
</script>

<style scoped>
/* Hidden scrollbar for drawer */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #f3f4f6;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #e5e7eb;
}
</style>
