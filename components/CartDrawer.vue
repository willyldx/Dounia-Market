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
      <div v-if="cartStore.isOpen" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">Panier</h2>
            <div v-if="cartStore.itemCount > 0" class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-900 text-xs font-bold">
              {{ cartStore.itemCount }}
            </div>
          </div>
          <button @click="cartStore.closeCart" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors group">
            <X class="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-grow overflow-y-auto">
          <!-- Premium Empty State -->
          <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full p-10 text-center">
            <div class="relative mb-8 group">
               <div class="absolute inset-0 bg-gray-100 rounded-full scale-150 opacity-50 blur-2xl"></div>
               <div class="w-32 h-32 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center relative z-10">
                 <ShoppingBag class="w-12 h-12 text-gray-200" />
               </div>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-3 tracking-tight">Votre panier est vide</h3>
            <p class="text-gray-500 font-medium mb-10 leading-relaxed max-w-xs">
              Choisissez des produits à livrer localement par Dounia Market Tchad à vos proches à N'Djamena.
            </p>
            <NuxtLink to="/catalogue" class="flex items-center justify-center gap-2 px-8 py-4 bg-brand text-brand-foreground font-bold rounded-lg hover:bg-brand/90 transition-all shadow-md w-full" @click="cartStore.closeCart">
              Découvrir le catalogue
            </NuxtLink>
          </div>

          <!-- Items -->
          <div v-else class="p-4 sm:p-5 space-y-4">
            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors shadow-sm group">
              <!-- Item Image -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                <img
                  v-if="item.thumbnail"
                  :src="resolveThumb(item.thumbnail)"
                  :alt="item.title"
                  class="w-full h-full object-cover mix-blend-multiply"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <Package v-else class="w-6 h-6 text-gray-300" />
              </div>
              
              <!-- Item Details -->
              <div class="flex-grow min-w-0 flex flex-col justify-center">
                <h4 class="font-bold text-gray-900 text-sm truncate mb-1">{{ item.title }}</h4>
                <p v-if="item.variantTitle" class="text-xs text-gray-500 font-medium truncate">{{ item.variantTitle }}</p>
                <div class="mt-auto pt-2 flex items-center justify-between">
                  <p class="font-black text-gray-900">{{ cartStore.formatPrice(item.price) }}</p>
                </div>
              </div>
              
              <!-- Quantity Controls & Remove -->
              <div class="flex flex-col items-end justify-between">
                <button @click="cartStore.removeItem(item.id)" class="p-1.5 text-gray-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg">
                  <Trash2 class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button @click="cartStore.decrementQuantity(item.id)" class="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-4 text-center text-xs font-bold text-gray-900">{{ item.quantity }}</span>
                  <button @click="cartStore.incrementQuantity(item.id)" class="w-6 h-6 rounded flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Checkout Action -->
        <div v-if="!cartStore.isEmpty" class="border-t border-gray-100 p-5 sm:p-6 bg-white shrink-0 z-10">
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-500 text-sm font-medium">
              <span>Sous-total</span>
              <span class="text-gray-900">{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between text-gray-500 text-sm font-medium">
              <span class="flex items-center gap-2"><Truck class="w-4 h-4 text-gray-400" />Livraison locale</span>
              <span class="text-gray-900">À confirmer</span>
            </div>
            <div class="border-t border-gray-100 pt-4 flex justify-between items-end">
              <span class="font-bold text-gray-900 text-xs">Sous-total produits</span>
              <div class="text-right">
                <span class="text-3xl font-black text-gray-900 tracking-tight">{{ cartStore.formattedSubtotal }}</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed">
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
