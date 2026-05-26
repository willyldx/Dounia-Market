<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    <div class="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-white">
      <div class="absolute left-2 right-12 top-2 z-10 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
        <span
          v-if="categoryName"
          class="rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm"
        >
          {{ categoryName }}
        </span>
        <span
          class="rounded-md px-2 py-1 text-[10px] font-semibold"
          :class="stockDisplay.classes"
        >
          {{ stockDisplay.label }}
        </span>
      </div>

      <button
        type="button"
        :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :aria-pressed="isFavorite"
        :disabled="!canToggleFavorite"
        class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white/95 text-muted-foreground transition-colors hover:text-red-600"
        :class="isFavorite ? 'text-red-600' : 'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-muted-foreground'"
        @click.prevent="toggleFavorite"
      >
        <Heart class="h-4 w-4" :class="isFavorite ? 'fill-current' : ''" />
      </button>

      <NuxtLink
        :to="`/produit/${product.handle || product.id}`"
        class="flex h-full w-full items-center justify-center p-4 sm:p-5"
      >
        <NuxtImg
          v-if="product.thumbnail || product.images?.[0]"
          :src="product.thumbnail || product.images?.[0]"
          :alt="product.title"
          class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          format="webp"
          quality="85"
        />
        <component v-else :is="getCategoryIcon" class="h-12 w-12 text-muted-foreground/30" />
      </NuxtLink>
    </div>

    <div class="flex flex-1 flex-col p-3 sm:p-4">
      <NuxtLink :to="`/produit/${product.handle || product.id}`">
        <h3 class="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-brand sm:text-base">
          {{ product.title }}
        </h3>
      </NuxtLink>
      <p v-if="product.subtitle" class="mt-1 line-clamp-1 text-xs text-muted-foreground">
        {{ product.subtitle }}
      </p>

      <div class="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span class="text-base font-bold text-foreground sm:text-lg">
          {{ displayedPrice }}
        </span>
        <button
          type="button"
          :disabled="!canAddToCart"
          :aria-label="canAddToCart ? `Ajouter ${product.title} au panier` : purchaseLabel"
          class="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand px-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground sm:w-auto"
          @click="addToCart"
        >
          <ShoppingBag class="h-4 w-4" />
          <span>{{ canAddToCart ? 'Ajouter' : purchaseLabel }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { BookOpen, Gift, Heart, Package, ShoppingBag, Wheat } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

interface ProductProp {
  id: string
  title: string
  handle?: string
  subtitle?: string
  price?: number
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
  delay: 0,
})

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const categoryName = computed(() => {
  if (!props.product.category) return ''
  return typeof props.product.category === 'string' ? props.product.category : props.product.category.name
})

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))
const hasKnownPrice = computed(() => typeof props.product.price === 'number' && Number.isFinite(props.product.price))
const canAddToCart = computed(() => props.product.inStock === true && hasKnownPrice.value)
const canToggleFavorite = computed(() => isFavorite.value || canAddToCart.value)
const displayedPrice = computed(() => (
  hasKnownPrice.value ? cartStore.formatPrice(props.product.price as number) : 'Prix à confirmer'
))
const stockDisplay = computed(() => {
  if (props.product.inStock === true) {
    return { label: 'Disponible', classes: 'bg-emerald-50 text-emerald-700' }
  }
  if (props.product.inStock === false) {
    return { label: 'Indisponible', classes: 'bg-red-50 text-red-700' }
  }
  return { label: 'Stock à confirmer', classes: 'bg-amber-50 text-amber-800' }
})
const purchaseLabel = computed(() => {
  if (!hasKnownPrice.value) return 'Prix à confirmer'
  if (props.product.inStock === false) return 'Indisponible'
  return 'Stock à confirmer'
})

const getCategoryIcon = computed(() => {
  const icons: Record<string, any> = {
    Alimentaire: Wheat,
    Scolarité: BookOpen,
    'Santé & Bébé': Heart,
    Santé: Heart,
    'Fêtes & Occasions': Gift,
    Fêtes: Gift,
  }
  return icons[categoryName.value] || Package
})

async function toggleFavorite() {
  if (isFavorite.value) {
    await favoritesStore.removeFromFavorites(props.product.id)
    return
  }
  if (!canAddToCart.value || !hasKnownPrice.value) return

  await favoritesStore.toggleFavorite({
    id: props.product.id,
    title: props.product.title,
    handle: props.product.handle || props.product.id,
    price: props.product.price as number,
    thumbnail: props.product.thumbnail || props.product.images?.[0],
    images: props.product.images || [],
    category: categoryName.value,
    categoryHandle: '',
    inStock: true,
  })
}

function addToCart() {
  if (!canAddToCart.value || !hasKnownPrice.value) return

  cartStore.addItem({
    productId: props.product.id,
    title: props.product.title,
    price: props.product.price as number,
    thumbnail: props.product.thumbnail || props.product.images?.[0],
    category: categoryName.value,
  })
  toast.add({
    title: 'Ajouté au panier',
    description: props.product.title,
    icon: 'i-lucide-check-circle',
    color: 'black',
    timeout: 2500,
  })
}
</script>
