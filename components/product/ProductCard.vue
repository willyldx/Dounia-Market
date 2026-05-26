<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#c9872b]/25 hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]">
    <div class="relative">
      <NuxtLink
        :to="productUrl"
        class="flex aspect-[4/5] w-full items-center justify-center overflow-hidden border-b border-border bg-white p-4 sm:p-6"
      >
        <NuxtImg
          v-if="productImage"
          :src="productImage"
          :alt="product.title"
          class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          format="webp"
          quality="85"
        />
        <span v-else class="rounded-md bg-muted/45 px-3 py-2 text-xs font-medium text-muted-foreground">Visuel indisponible</span>
      </NuxtLink>

      <button
        type="button"
        :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :aria-pressed="isFavorite"
        :disabled="!canToggleFavorite"
        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white/95 text-muted-foreground shadow-sm transition-colors hover:border-[#c9872b]/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45"
        :class="isFavorite ? 'text-amber-700' : ''"
        @click.prevent="toggleFavorite"
      >
        <Heart class="h-4 w-4" :class="isFavorite ? 'fill-current' : ''" :stroke-width="1.75" />
      </button>
    </div>

    <div class="flex flex-1 flex-col p-3.5 sm:p-4">
      <div class="mb-2.5 flex min-h-5 items-center justify-between gap-2">
        <p v-if="categoryName" class="line-clamp-1 text-xs font-medium text-amber-800">{{ categoryName }}</p>
        <span class="ml-auto inline-flex shrink-0 rounded-sm px-2 py-1 text-[11px] font-medium" :class="availability.classes">
          {{ availability.label }}
        </span>
      </div>
      <NuxtLink :to="productUrl">
        <h3 class="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-amber-800 sm:text-base">
          {{ product.title }}
        </h3>
      </NuxtLink>
      <p v-if="product.subtitle" class="mt-1 line-clamp-1 text-xs text-muted-foreground">
        {{ product.subtitle }}
      </p>
      <div class="mt-auto pt-4">
        <p v-if="hasKnownPrice" class="tabular-nums text-lg font-bold tracking-tight text-foreground">
          {{ cartStore.formatPrice(product.price as number) }}
        </p>
        <p v-else class="text-xs font-medium text-muted-foreground">
          Prix non communiqué
        </p>

        <button
          v-if="canAddToCart"
          type="button"
          :aria-label="`Ajouter ${product.title} au panier`"
          class="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c9872b] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#b97824] active:translate-y-px"
          @click="addToCart"
        >
          <ShoppingBag class="h-4 w-4" :stroke-width="1.75" />
          Ajouter
        </button>
        <NuxtLink
          v-else
          :to="productUrl"
          class="mt-3 inline-flex h-11 w-full items-center justify-center gap-1 rounded-lg border border-border text-sm font-semibold text-foreground transition-colors hover:border-[#c9872b]/35 hover:bg-muted"
        >
          Voir le produit
          <ChevronRight class="h-4 w-4" :stroke-width="1.75" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronRight, Heart, ShoppingBag } from 'lucide-vue-next'
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
}

const props = defineProps<{
  product: ProductProp
  delay?: number
}>()

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const productUrl = computed(() => `/produit/${props.product.handle || props.product.id}`)
const productImage = computed(() => props.product.thumbnail || props.product.images?.[0] || '')
const categoryName = computed(() => {
  if (!props.product.category) return ''
  return typeof props.product.category === 'string' ? props.product.category : props.product.category.name
})
const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))
const hasKnownPrice = computed(() => typeof props.product.price === 'number' && Number.isFinite(props.product.price))
const canAddToCart = computed(() => props.product.inStock === true && hasKnownPrice.value)
const canToggleFavorite = computed(() => isFavorite.value || canAddToCart.value)
const availability = computed(() => {
  if (props.product.inStock === true) {
    return { label: 'Disponible', classes: 'bg-emerald-50 text-emerald-700' }
  }
  if (props.product.inStock === false) {
    return { label: 'Indisponible', classes: 'bg-red-50 text-red-700' }
  }
  return { label: 'À confirmer', classes: 'bg-muted text-muted-foreground' }
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
    thumbnail: productImage.value,
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
    thumbnail: productImage.value,
    category: categoryName.value,
  })
  toast.add({
    title: 'Ajouté au panier',
    description: props.product.title,
    color: 'black',
    timeout: 2500,
  })
}
</script>
