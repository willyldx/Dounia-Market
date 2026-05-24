<template>
  <article class="card-product group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-premium transition-all duration-500 hover:-translate-y-1 hover:shadow-premium-lg">
    <!-- Image Section -->
    <div class="relative aspect-square bg-muted overflow-hidden">
      <!-- Status Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
        <span
          v-if="product.category"
          class="pointer-events-auto rounded-lg bg-card/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-md border border-border"
        >
          {{ categoryName }}
        </span>
        <span 
          v-if="product.inStock !== false"
          class="pointer-events-auto rounded-lg bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success border border-success/20 flex items-center gap-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          Disponible
        </span>
        <span 
          v-else
          class="pointer-events-auto rounded-lg bg-destructive/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive border border-destructive/20"
        >
          Rupture
        </span>
      </div>

      <!-- Wishlist Button -->
      <button 
        @click.prevent="toggleFavorite"
        class="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-card hover:text-accent"
        :class="isFavorite ? 'text-destructive bg-destructive/10 border-destructive/20' : 'text-muted-foreground opacity-0 group-hover:opacity-100'"
      >
        <Heart class="w-4 h-4" :class="isFavorite ? 'fill-destructive' : ''" />
      </button>

      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="block w-full h-full flex items-center justify-center p-4">
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
          <component :is="getCategoryIcon" class="w-16 h-16 text-muted-foreground/30" />
        </div>
      </NuxtLink>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col p-5">
      <!-- Title -->
      <p class="text-xs text-muted-foreground mb-1 line-clamp-1">{{ categoryName || 'Dounia Market' }}</p>
      <NuxtLink :to="`/produit/${product.handle || product.id}`" class="mb-3">
        <h3 class="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-brand transition-colors">
          {{ product.title }}
        </h3>
      </NuxtLink>

      <!-- Price & Action -->
      <div class="mt-auto flex items-baseline gap-2 mb-4">
        <span class="text-xl font-bold text-foreground">
          {{ cartStore.formatPrice(product.price) }}
        </span>
        <span v-if="cartStore.currency !== 'XAF'" class="text-sm font-medium text-muted-foreground">
          ≈ {{ priceFCFA }} FCFA
        </span>
      </div>

      <!-- Add to Cart -->
      <button 
        @click="addToCart"
        :disabled="product.inStock === false"
        class="w-full flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand text-brand-foreground font-medium transition-all duration-300 hover:bg-brand/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingBag class="h-4 w-4" />
        Ajouter au panier
      </button>
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
