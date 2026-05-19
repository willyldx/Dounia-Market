<template>
  <article
    class="card-product group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-gray-200"
  >
    <!-- Image Section -->
    <NuxtLink :to="`/produit/${product.handle || product.id}`" class="block relative aspect-[4/3] overflow-hidden bg-[#f8f7f4] p-6 flex items-center justify-center">
      <NuxtImg 
        v-if="product.thumbnail || product.images?.[0]"
        :src="product.thumbnail || product.images[0]"
        :alt="product.title"
        class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
        loading="lazy"
        format="webp"
        quality="90"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <component :is="getCategoryIcon" class="w-16 h-16 text-gray-200" />
      </div>
    </NuxtLink>

    <!-- Status Badges -->
    <div class="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
      <span
        v-if="product.category"
        class="pointer-events-auto rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur-md border border-gray-100"
      >
        {{ categoryName }}
      </span>
      <span 
        v-if="product.inStock !== false"
        class="pointer-events-auto rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100 flex items-center gap-1"
      >
        <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
        Disponible
      </span>
      <span 
        v-else
        class="pointer-events-auto rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-100"
      >
        Rupture
      </span>
    </div>

    <!-- Wishlist Button -->
    <button 
      @click.prevent="toggleFavorite"
      class="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white"
      :class="isFavorite ? 'text-red-500 bg-red-50 border-red-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'"
    >
      <Heart class="w-4 h-4" :class="isFavorite ? 'fill-red-500' : ''" />
    </button>

    <!-- Content Section -->
    <div class="flex flex-grow flex-col border-t border-gray-50 p-5 sm:p-6">
      <!-- Title -->
      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="mb-3">
        <h3 class="min-h-[2.5rem] line-clamp-2 text-base font-bold leading-snug tracking-tight text-gray-900 group-hover:text-[var(--color-accent-dark)] transition-colors sm:text-lg">
          {{ product.title }}
        </h3>
      </NuxtLink>

      <!-- Price & Action -->
      <div class="mt-auto flex items-end justify-between gap-3">
        <div class="flex flex-col">
          <span class="text-xl font-black leading-none tracking-tight text-gray-900 sm:text-2xl">
            {{ cartStore.formatPrice(product.price) }}
          </span>
          <span v-if="cartStore.currency !== 'XAF'" class="mt-1.5 text-[10px] font-semibold text-gray-400">
            ≈ {{ priceFCFA }} FCFA
          </span>
        </div>

        <!-- Add to Cart -->
        <button 
          @click="addToCart"
          :disabled="product.inStock === false"
          class="group/btn flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white transition-all duration-300 hover:bg-[var(--color-accent-hover)] active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          title="Ajouter au panier"
        >
          <ShoppingBag class="h-4.5 w-4.5 transition-transform group-hover/btn:-translate-y-0.5" />
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
    id: `cart-${props.product.id}-${Date.now()}`,
    productId: props.product.id,
    title: props.product.title,
    price: props.product.price,
    thumbnail: props.product.thumbnail || props.product.images?.[0],
    category: categoryName.value
  })
  toast.add({ title: 'Ajouté au panier', description: props.product.title, icon: 'i-heroicons-check-circle', color: 'black', timeout: 2500 })
}
</script>
