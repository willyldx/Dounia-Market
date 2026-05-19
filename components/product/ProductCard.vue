<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: delay,
        duration: 800,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }"
    class="card-product group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_rgba(15,23,42,0.12)] hover:border-gray-200"
  >
    <!-- Image Section -->
    <NuxtLink :to="`/produit/${product.handle || product.id}`" class="block relative aspect-[4/3] overflow-hidden bg-[#fcfaf7] p-8 flex items-center justify-center">
      <NuxtImg 
        v-if="product.thumbnail || product.images?.[0]"
        :src="product.thumbnail || product.images[0]"
        :alt="product.title"
        class="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 mix-blend-multiply"
        loading="lazy"
        format="webp"
        quality="90"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <component :is="getCategoryIcon" class="w-20 h-20 text-gray-100" />
      </div>
      
      <!-- Quick View Overlay (Modern SaaS Pattern) -->
      <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
        <span class="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          Détails rapides
        </span>
      </div>
    </NuxtLink>
 
    <!-- Status Badges -->
    <div class="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
      <span
        v-if="product.category"
        class="pointer-events-auto rounded-xl bg-white/80 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm backdrop-blur-md border border-white/50"
      >
        {{ categoryName }}
      </span>
      <span 
        v-if="product.inStock !== false"
        class="pointer-events-auto rounded-xl bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-500/20 flex items-center gap-1.5 backdrop-blur-md"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Disponible
      </span>
      <span 
        v-else
        class="pointer-events-auto rounded-xl bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-500/20 backdrop-blur-md"
      >
        Rupture
      </span>
    </div>
 
    <!-- Wishlist Button -->
    <button 
      @click.prevent="toggleFavorite"
      class="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
      :class="isFavorite ? 'text-red-500 bg-red-50 border-red-100 shadow-md' : 'text-gray-400 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0'"
    >
      <Heart class="w-4.5 h-4.5" :class="isFavorite ? 'fill-red-500' : ''" />
    </button>
 
    <!-- Content Section -->
    <div class="flex flex-grow flex-col border-t border-gray-50 p-6 sm:p-7">
      <!-- Title -->
      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="mb-4">
        <h3 class="min-h-[2.5rem] line-clamp-2 text-lg font-black leading-tight tracking-tight text-gray-900 group-hover:text-[var(--color-accent-dark)] transition-colors text-premium">
          {{ product.title }}
        </h3>
      </NuxtLink>
 
      <!-- Price & Action -->
      <div class="mt-auto flex items-end justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-2xl font-black leading-none tracking-tighter text-gray-900">
            {{ cartStore.formatPrice(product.price) }}
          </span>
          <span v-if="cartStore.currency !== 'XAF'" class="mt-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            ≈ {{ priceFCFA }} FCFA
          </span>
        </div>
 
        <!-- Add to Cart -->
        <button 
          @click="addToCart"
          :disabled="product.inStock === false"
          class="group/btn flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white transition-all duration-500 hover:bg-[var(--color-accent)] active:scale-95 shadow-lg hover:shadow-[0_12px_24px_rgba(212,135,44,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
          title="Ajouter au panier"
        >
          <ShoppingBag class="h-5 w-5 transition-transform group-hover/btn:-translate-y-1" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ShoppingBag, Heart, Wheat, BookOpen, Gift, Package } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

interface ProductProp {
  id: string
  title: string
  handle?: string
  subtitle?: string
  price: number
  thumbnail?: string
  images?: string[]
  category?: string | { name: string; handle: string }
  inStock?: boolean
  isNew?: boolean
}

const props = withDefaults(defineProps<{
  product: ProductProp
  delay?: number
}>(), {
  delay: 0
})

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const priceFCFA = computed(() => {
  const rate = cartStore.rates?.XAF || 655.957
  return new Intl.NumberFormat('fr-FR').format(Math.round(props.product.price * rate))
})

const categoryName = computed(() => {
  if (!props.product.category) return ''
  return typeof props.product.category === 'string' ? props.product.category : props.product.category.name
})

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))

const getCategoryIcon = computed(() => {
  const icons: Record<string, any> = {
    'Alimentaire': Wheat, 'Scolarité': BookOpen, 'Santé & Bébé': Heart, 'Santé': Heart, 'Fêtes & Occasions': Gift, 'Fêtes': Gift,
  }
  return icons[categoryName.value] || Package
})

function toggleFavorite() {
  favoritesStore.toggleFavorite({
    id: props.product.id,
    title: props.product.title,
    handle: props.product.handle,
    price: props.product.price,
    thumbnail: props.product.thumbnail || props.product.images?.[0],
    images: props.product.images || [],
    category: categoryName.value,
    categoryHandle: '',
    inStock: props.product.inStock ?? true,
  })
}

const addToCart = () => {
  if (props.product.inStock === false) return
  cartStore.addItem({
    productId: props.product.id,
    title: props.product.title,
    price: props.product.price,
    thumbnail: props.product.thumbnail || props.product.images?.[0],
    category: categoryName.value
  })
  toast.add({ title: 'Ajouté au panier', description: props.product.title, icon: 'i-heroicons-check-circle', color: 'black', timeout: 2500 })
}
</script>
