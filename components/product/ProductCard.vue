<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-premium border border-transparent hover:border-border/50">
    <!-- Image Section (Clean background, minimalist elements) -->
    <div class="relative aspect-square w-full overflow-hidden bg-background">
      <!-- Minimalist Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
        <span
          v-if="product.category"
          class="pointer-events-auto rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm"
        >
          {{ categoryName }}
        </span>
      </div>

      <!-- Minimalist Stock Status -->
      <div class="absolute bottom-4 left-4 flex items-center gap-1.5 z-10">
        <span 
          v-if="product.inStock !== false"
          class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          title="En stock"
        ></span>
        <span 
          v-else
          class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
          title="Rupture de stock"
        ></span>
      </div>

      <!-- Wishlist Button - Sleek floating -->
      <button 
        @click.prevent="toggleFavorite"
        class="absolute top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:scale-110"
        :class="isFavorite ? 'text-red-500' : 'text-muted-foreground/50 opacity-0 group-hover:opacity-100'"
      >
        <Heart class="w-4 h-4" :class="isFavorite ? 'fill-red-500' : ''" />
      </button>

      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="block w-full h-full flex items-center justify-center p-6">
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
          <component :is="getCategoryIcon" class="w-16 h-16 text-muted-foreground/20 stroke-[1]" />
        </div>
      </NuxtLink>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col p-5 pt-4 flex-grow">
      <!-- Title -->
      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="mb-1">
        <h3 class="line-clamp-2 text-[15px] font-semibold leading-relaxed text-foreground group-hover:text-brand transition-colors">
          {{ product.title }}
        </h3>
      </NuxtLink>

      <!-- Price -->
      <div class="mt-auto flex items-end justify-between pt-4">
        <div class="flex flex-col gap-0.5">
          <span class="text-lg font-bold text-foreground">
            {{ cartStore.formatPrice(product.price) }}
          </span>
          <span v-if="cartStore.currency !== 'XAF'" class="text-xs font-medium text-muted-foreground/70">
            ≈ {{ priceFCFA }} FCFA
          </span>
        </div>

        <!-- Elegant Add Button (Circular icon button instead of big bulky text) -->
        <button 
          @click="addToCart"
          :disabled="product.inStock === false"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all duration-300 hover:bg-brand hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md group-hover:shadow-lg"
          title="Ajouter au panier"
        >
          <ShoppingBag class="h-4 w-4" />
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
