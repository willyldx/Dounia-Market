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
      <div v-if="cartStore.isOpen" class="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl z-[110] flex flex-col border-l border-white/20">
        <!-- Header -->
        <div class="flex items-center justify-between px-8 py-7 border-b border-gray-100/50">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Panier</h2>
            <div v-if="cartStore.itemCount > 0" class="px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-black animate-scale-in">
              {{ cartStore.itemCount }} ITEMS
            </div>
          </div>
          <button @click="cartStore.closeCart" class="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all active:scale-90 group border border-transparent hover:border-gray-200">
            <X class="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>
 
        <!-- Free Shipping Progress -->
        <div v-if="!cartStore.isEmpty" class="px-8 py-6 bg-slate-50/50 border-b border-gray-100/50">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-black text-gray-900 flex items-center gap-2 tracking-[0.1em] uppercase">
              <template v-if="cartStore.amountToFreeShipping > 0">
                <Truck class="w-4 h-4 text-[var(--color-accent)]" />
                <span class="text-gray-500">Plus que</span> {{ cartStore.formatPrice(cartStore.amountToFreeShipping) }} pour la gratuité
              </template>
              <template v-else>
                <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <Check class="w-3 h-3 text-white" />
                </div>
                Livraison <span class="text-emerald-600">OFFERTE</span>
              </template>
            </span>
            <span v-if="cartStore.amountToFreeShipping > 0" class="text-[10px] font-black text-gray-400">
              {{ Math.round(cartStore.freeShippingProgress) }}%
            </span>
          </div>
          <div class="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden p-[2px]">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative"
              :class="cartStore.amountToFreeShipping <= 0 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gray-900'"
              :style="{ width: `${cartStore.freeShippingProgress}%` }"
            >
              <div v-if="cartStore.amountToFreeShipping > 0" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
 
        <!-- Content -->
        <div class="flex-grow overflow-y-auto custom-scrollbar">
          <!-- Premium Empty State -->
          <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full p-12 text-center animate-fade-in">
            <div class="relative mb-10 group">
               <div class="absolute inset-0 bg-amber-100 rounded-full scale-150 opacity-30 blur-3xl animate-pulse"></div>
               <div class="w-40 h-40 rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl flex items-center justify-center relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                 <ShoppingBag class="w-16 h-16 text-gray-100 group-hover:text-[var(--color-accent)] transition-colors duration-500" />
               </div>
            </div>
            <h3 class="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Votre panier est vide</h3>
            <p class="text-gray-500 font-bold mb-12 leading-relaxed max-w-xs text-sm uppercase tracking-wide">
              Mettez le nécessaire dans le panier, et TchadBox s'occupe du reste.
            </p>
            <NuxtLink 
              to="/catalogue" 
              class="flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 w-full uppercase tracking-widest text-xs" 
              @click="cartStore.closeCart"
            >
              Explorer les pépites
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
 
          <!-- Items -->
          <div v-else class="p-6 space-y-5">
            <div 
              v-for="(item, i) in cartStore.items" 
              :key="item.id" 
              v-motion
              :initial="{ opacity: 0, x: 20 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: i * 50 } }"
              class="flex gap-6 p-5 rounded-[1.5rem] bg-white border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl group relative"
            >
              <!-- Item Image -->
              <div class="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative shadow-inner border border-gray-100">
                <img
                  v-if="item.thumbnail"
                  :src="resolveThumb(item.thumbnail)"
                  :alt="item.title"
                  class="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <Package v-else class="w-8 h-8 text-gray-200" />
              </div>
              
              <!-- Item Details -->
              <div class="flex-grow min-w-0 flex flex-col justify-center">
                <div class="flex justify-between items-start gap-2">
                  <h4 class="font-black text-gray-900 text-sm leading-tight group-hover:text-[var(--color-accent-dark)] transition-colors line-clamp-2 uppercase tracking-tight">{{ item.title }}</h4>
                  <button @click="cartStore.removeItem(item.id)" class="p-1.5 text-gray-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl flex-shrink-0 opacity-0 group-hover:opacity-100">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <p v-if="item.variantTitle" class="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{{ item.variantTitle }}</p>
                
                <div class="mt-4 flex items-center justify-between">
                  <p class="font-black text-gray-900 text-lg tracking-tighter">{{ cartStore.formatPrice(item.price) }}</p>
                  
                  <div class="flex items-center gap-3 bg-gray-100/50 rounded-xl p-1 border border-gray-100">
                    <button @click="cartStore.decrementQuantity(item.id)" class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 transition-all active:scale-75">
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span class="w-5 text-center text-xs font-black text-gray-900">{{ item.quantity }}</span>
                    <button @click="cartStore.incrementQuantity(item.id)" class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-500 transition-all active:scale-75">
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <!-- Footer Checkout Action -->
        <div v-if="!cartStore.isEmpty" class="border-t border-gray-100 p-8 bg-white/80 backdrop-blur-md shrink-0 z-10">
          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-gray-500 text-xs font-bold uppercase tracking-widest">
              <span>Sous-total</span>
              <span class="text-gray-900">{{ cartStore.formattedSubtotal }}</span>
            </div>
            <div class="flex justify-between text-gray-500 text-xs font-bold uppercase tracking-widest">
              <span class="flex items-center gap-2">Fret aérien & Douane</span>
              <span class="text-gray-900">{{ cartStore.formattedShipping }}</span>
            </div>
            <div class="border-t border-gray-100 pt-6 flex justify-between items-end">
              <span class="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-1">Net à payer</span>
              <div class="text-right">
                <span class="text-4xl font-black text-gray-900 tracking-tighter">{{ cartStore.formattedTotal }}</span>
                <p v-if="cartStore.currency !== 'XAF'" class="text-[10px] text-[var(--color-accent)] font-black mt-2 tracking-[0.15em] uppercase">≈ {{ cartStore.totalXAF }} FCFA</p>
              </div>
            </div>
          </div>
          
          <NuxtLink 
            to="/checkout" 
            class="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs relative overflow-hidden group/btn" 
            @click="cartStore.closeCart"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            <Lock class="w-4 h-4 text-gray-500 group-hover/btn:text-white transition-colors" /> 
            <span>Passer à la caisse</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ShoppingBag, X, Package, Trash2, Minus, Plus, Truck, Check, Lock, ArrowRight } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.spencerai.tech/${path}`
  if (path.startsWith('/storage/')) return `https://api.spencerai.tech${path}`
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
