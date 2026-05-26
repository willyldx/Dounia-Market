<template>
  <div class="min-h-screen bg-background pb-12">
    <div v-if="isLoading" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid animate-pulse gap-7 lg:grid-cols-2">
        <div class="aspect-square rounded-lg border border-border bg-muted"></div>
        <div class="space-y-4">
          <div class="h-5 w-24 rounded bg-muted"></div>
          <div class="h-10 w-3/4 rounded bg-muted"></div>
          <div class="h-20 rounded-lg bg-muted"></div>
          <div class="h-36 rounded-lg bg-muted"></div>
        </div>
      </div>
    </div>

    <main v-else-if="product" class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <nav class="mb-6 flex items-center gap-2 overflow-hidden text-xs font-medium text-muted-foreground sm:text-sm">
        <NuxtLink to="/" class="shrink-0 hover:text-foreground">Accueil</NuxtLink>
        <ChevronRightIcon class="h-3.5 w-3.5 shrink-0" />
        <NuxtLink to="/catalogue" class="shrink-0 hover:text-foreground">Catalogue</NuxtLink>
        <ChevronRightIcon class="h-3.5 w-3.5 shrink-0" />
        <span class="truncate text-foreground">{{ product.title }}</span>
      </nav>

      <div class="grid gap-7 lg:grid-cols-[minmax(360px,0.95fr)_minmax(420px,1.05fr)] lg:gap-10">
        <section aria-label="Images du produit">
          <div class="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-6 sm:p-10">
            <img
              v-if="mainImage"
              :src="mainImage"
              :alt="product.title"
              class="h-full w-full object-contain"
            />
            <PackageIcon v-else class="h-16 w-16 text-muted-foreground/30" />

            <button
              type="button"
              :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              :aria-pressed="isFavorite"
              :disabled="!canToggleFavorite"
              class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:text-red-600"
              :class="isFavorite ? 'text-red-600' : 'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-muted-foreground'"
              @click="toggleFavorite"
            >
              <HeartIcon class="h-5 w-5" :class="isFavorite ? 'fill-current' : ''" />
            </button>
            <button
              v-if="mainImage"
              type="button"
              aria-label="Agrandir l'image"
              class="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:text-foreground"
              @click="showZoom = true"
            >
              <ZoomInIcon class="h-5 w-5" />
            </button>
          </div>

          <div v-if="product.images?.length > 1" class="scrollbar-hide mt-3 flex gap-2 overflow-x-auto">
            <button
              v-for="(image, index) in product.images"
              :key="image"
              type="button"
              class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white p-2 sm:h-24 sm:w-24"
              :class="mainImage === image ? 'border-brand' : 'border-border'"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="`${product.title}, image ${index + 1}`" class="h-full w-full object-contain" />
            </button>
          </div>
        </section>

        <section class="flex flex-col">
          <div class="flex flex-wrap gap-2">
            <span v-if="product.category" class="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              {{ product.category }}
            </span>
            <span
              class="rounded-md px-2.5 py-1 text-xs font-semibold"
              :class="stockDisplay.classes"
            >
              {{ stockDisplay.label }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{{ product.title }}</h1>
          <p v-if="product.subtitle" class="mt-2 text-base leading-relaxed text-muted-foreground">
            {{ product.subtitle }}
          </p>

          <div class="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Prix du produit</p>
            <div class="mt-2 flex flex-wrap items-baseline gap-3">
              <span :class="hasCurrentPrice ? 'text-3xl font-bold text-foreground sm:text-4xl' : 'text-lg font-semibold text-amber-800'">
                {{ displayedCurrentPrice }}
              </span>
              <span v-if="hasCurrentPrice && product.compareAtPrice && !selectedVariant" class="text-lg text-muted-foreground line-through">
                {{ cartStore.formatPrice(product.compareAtPrice) }}
              </span>
              <span v-if="hasCurrentPrice && product.compareAtPrice && !selectedVariant" class="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                -{{ discountPercent }}%
              </span>
            </div>
            <p class="mt-3 text-sm text-muted-foreground">
              Zones couvertes et frais de livraison à confirmer avant l'ouverture publique du service.
            </p>
          </div>

          <div v-if="product.variants?.length" class="mt-6">
            <p class="mb-3 text-sm font-semibold text-foreground">Options disponibles</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="variant in product.variants"
                :key="variant.id"
                type="button"
                class="rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
                :disabled="isVariantUnavailable(variant)"
                :class="[
                  selectedVariant?.id === variant.id ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-card text-foreground',
                  isVariantUnavailable(variant) ? 'cursor-not-allowed opacity-50' : '',
                ]"
                @click="selectedVariant = variant"
              >
                {{ variant.title }}
                <span v-if="isVariantUnavailable(variant)"> - indisponible</span>
              </button>
            </div>
          </div>

          <p v-if="product.description" class="mt-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {{ product.description }}
          </p>

          <div class="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="inline-flex h-12 items-center justify-between rounded-md border border-border bg-background p-1 sm:w-36">
                <button
                  type="button"
                  aria-label="Diminuer la quantité"
                  :disabled="quantity <= 1"
                  class="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40"
                  @click="quantity > 1 && quantity--"
                >
                  <MinusIcon class="h-4 w-4" />
                </button>
                <span class="text-sm font-semibold text-foreground">{{ quantity }}</span>
                <button
                  type="button"
                  aria-label="Augmenter la quantité"
                  :disabled="quantity >= 10"
                  class="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40"
                  @click="quantity++"
                >
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                :disabled="!canAddToCart || isAddingToCart"
                class="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                @click="addToCart"
              >
                <LoaderIcon v-if="isAddingToCart" class="h-4 w-4 animate-spin" />
                <ShoppingCartIcon v-else class="h-4 w-4" />
                {{ cartActionLabel }}
              </button>
            </div>
            <button
              type="button"
              :disabled="isGeneratingLink"
              class="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
              @click="generateShareLink"
            >
              <CheckIcon v-if="linkCopied" class="h-4 w-4 text-emerald-700" />
              <Share2Icon v-else class="h-4 w-4" />
              {{ linkCopied ? 'Lien copié' : isGeneratingLink ? 'Création du lien...' : 'Partager ce produit' }}
            </button>
          </div>

          <div class="mt-4 grid gap-2 sm:grid-cols-3">
            <div class="rounded-lg border border-border bg-card p-3">
              <PackageCheckIcon v-if="purchaseAvailability === true" class="h-5 w-5 text-emerald-700" />
              <PackageIcon v-else :class="purchaseAvailability === false ? 'h-5 w-5 text-red-700' : 'h-5 w-5 text-amber-700'" />
              <p class="mt-2 text-sm font-semibold text-foreground">{{ stockSummaryTitle }}</p>
              <p class="mt-1 text-xs text-muted-foreground">{{ stockSummaryText }}</p>
            </div>
            <div class="rounded-lg border border-border bg-card p-3">
              <MapPinIcon class="h-5 w-5 text-amber-700" />
              <p class="mt-2 text-sm font-semibold text-foreground">N'Djamena</p>
              <p class="mt-1 text-xs text-muted-foreground">Selon zones couvertes</p>
            </div>
            <div class="rounded-lg border border-border bg-card p-3">
              <ReceiptTextIcon class="h-5 w-5 text-slate-700" />
              <p class="mt-2 text-sm font-semibold text-foreground">Frais à confirmer</p>
              <p class="mt-1 text-xs text-muted-foreground">Avant ouverture publique</p>
            </div>
          </div>
        </section>
      </div>

      <section class="mt-10 sm:mt-12">
        <nav class="scrollbar-hide flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1" aria-label="Informations produit">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors"
            :class="activeTab === tab.id ? 'bg-brand text-brand-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>

        <div class="mt-4">
          <div v-if="activeTab === 'description'" class="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 class="text-lg font-bold text-foreground">À propos du produit</h2>
            <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {{ product.description || 'Les informations détaillées de ce produit seront précisées dans le catalogue.' }}
            </p>
            <div class="mt-6 grid gap-3 md:grid-cols-3">
              <div class="rounded-lg bg-muted/40 p-4">
                <h3 class="text-sm font-semibold text-foreground">Choix à distance</h3>
                <p class="mt-2 text-sm text-muted-foreground">Ajoutez les produits souhaités au panier depuis l'étranger.</p>
              </div>
              <div class="rounded-lg bg-muted/40 p-4">
                <h3 class="text-sm font-semibold text-foreground">Préparation locale</h3>
                <p class="mt-2 text-sm text-muted-foreground">Dounia Market Tchad prépare les articles disponibles localement.</p>
              </div>
              <div class="rounded-lg bg-muted/40 p-4">
                <h3 class="text-sm font-semibold text-foreground">Livraison au proche</h3>
                <p class="mt-2 text-sm text-muted-foreground">Livraison à N'Djamena dans les zones actuellement couvertes.</p>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'shipping'" class="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 class="text-lg font-bold text-foreground">Livraison locale</h2>
            <div class="mt-5 grid gap-3 md:grid-cols-3">
              <div class="rounded-lg border border-border p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">1. Bénéficiaire</p>
                <p class="mt-2 text-sm text-muted-foreground">Indiquez le proche qui recevra la commande et son adresse à N'Djamena.</p>
              </div>
              <div class="rounded-lg border border-border p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">2. Zone et frais</p>
                <p class="mt-2 text-sm text-muted-foreground">La zone couverte et les frais seront confirmés avant l'ouverture publique.</p>
              </div>
              <div class="rounded-lg border border-border p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">3. Suivi</p>
                <p class="mt-2 text-sm text-muted-foreground">Consultez ensuite l'avancement de la commande depuis le suivi disponible.</p>
              </div>
            </div>
          </div>

          <ProductReviews v-else-if="activeTab === 'reviews'" :product-id="product.id" />
        </div>
      </section>

      <ProductRecommendations :product="product" />
    </main>

    <div v-else class="mx-auto max-w-xl px-4 py-16 text-center">
      <PackageIcon class="mx-auto h-12 w-12 text-muted-foreground/40" />
      <h1 class="mt-4 text-xl font-semibold text-foreground">Produit introuvable</h1>
      <p class="mt-2 text-sm text-muted-foreground">Ce produit n'est pas disponible dans le catalogue.</p>
      <NuxtLink to="/catalogue" class="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground">
        Retour au catalogue
      </NuxtLink>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showZoom && mainImage"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          @click="showZoom = false"
        >
          <button
            type="button"
            aria-label="Fermer l'image"
            class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white"
            @click="showZoom = false"
          >
            <XIcon class="h-5 w-5" />
          </button>
          <img :src="mainImage" :alt="product?.title" class="max-h-full max-w-full object-contain" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
  Heart as HeartIcon,
  LoaderCircle as LoaderIcon,
  MapPin as MapPinIcon,
  Minus as MinusIcon,
  Package as PackageIcon,
  PackageCheck as PackageCheckIcon,
  Plus as PlusIcon,
  ReceiptText as ReceiptTextIcon,
  Share2 as Share2Icon,
  ShoppingCart as ShoppingCartIcon,
  X as XIcon,
  ZoomIn as ZoomInIcon,
} from 'lucide-vue-next'
import type { Product, ProductVariant } from '~/types'

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://douniamarket.com').replace(/\/+$/, '')
const apiOrigin = new URL(String(config.public.apiUrl || 'https://api.douniamarket.com/api')).origin
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
type DisplayVariant = Omit<ProductVariant, 'price' | 'inventory_quantity'> & {
  price?: number
  inventory_quantity?: number
}
type DisplayProduct = Omit<Product, 'price' | 'inStock' | 'variants'> & {
  price?: number
  inStock?: boolean
  variants?: DisplayVariant[]
}

const product = ref<DisplayProduct | null>(null)
const selectedVariant = ref<DisplayVariant | null>(null)
const relatedProducts = ref<DisplayProduct[]>([])
const isLoading = ref(true)
const isAddingToCart = ref(false)
const selectedImage = ref<string | null>(null)
const quantity = ref(1)
const activeTab = ref('description')
const showZoom = ref(false)
const isGeneratingLink = ref(false)
const linkCopied = ref(false)

const tabs = [
  { id: 'description', label: 'Détails' },
  { id: 'shipping', label: 'Livraison locale' },
  { id: 'reviews', label: 'Avis' },
]

const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)
const normalizeInventory = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)

const isFavorite = computed(() => (product.value ? favoritesStore.isFavorite(product.value.id) : false))
const mainImage = computed(() => selectedImage.value || product.value?.thumbnail || product.value?.images?.[0] || '')
const hasProductPrice = computed(() => typeof product.value?.price === 'number' && Number.isFinite(product.value.price))
const currentPrice = computed<number | undefined>(() => (
  selectedVariant.value ? selectedVariant.value.price : product.value?.price
))
const hasCurrentPrice = computed(() => typeof currentPrice.value === 'number' && Number.isFinite(currentPrice.value))
const displayedCurrentPrice = computed(() => (
  hasCurrentPrice.value ? cartStore.formatPrice(currentPrice.value as number) : 'Prix à confirmer'
))
const purchaseAvailability = computed<boolean | undefined>(() => {
  if (product.value?.inStock !== true) {
    return product.value?.inStock === false ? false : undefined
  }
  if (!selectedVariant.value) return true
  if (typeof selectedVariant.value.inventory_quantity !== 'number') return undefined
  return selectedVariant.value.inventory_quantity > 0
})
const stockDisplay = computed(() => {
  if (purchaseAvailability.value === true) {
    return { label: 'Disponible localement', classes: 'bg-emerald-50 text-emerald-700' }
  }
  if (purchaseAvailability.value === false) {
    return { label: 'Actuellement indisponible', classes: 'bg-red-50 text-red-700' }
  }
  return { label: 'Disponibilité à confirmer', classes: 'bg-amber-50 text-amber-800' }
})
const canAddToCart = computed(() => purchaseAvailability.value === true && hasCurrentPrice.value)
const canFavorite = computed(() => product.value?.inStock === true && hasProductPrice.value)
const canToggleFavorite = computed(() => isFavorite.value || canFavorite.value)
const cartActionLabel = computed(() => {
  if (!hasCurrentPrice.value) return 'Prix à confirmer'
  if (purchaseAvailability.value === false) return 'Produit indisponible'
  if (purchaseAvailability.value !== true) return 'Disponibilité à confirmer'
  return 'Ajouter au panier'
})
const stockSummaryTitle = computed(() => {
  if (purchaseAvailability.value === true) return 'Stock local'
  if (purchaseAvailability.value === false) return 'Stock indisponible'
  return 'Stock à confirmer'
})
const stockSummaryText = computed(() => (
  purchaseAvailability.value === true ? 'Disponibilité confirmée' : 'État indiqué sur la fiche'
))
const isVariantUnavailable = (variant: DisplayVariant): boolean => (
  typeof variant.inventory_quantity === 'number' && variant.inventory_quantity <= 0
)
const discountPercent = computed(() => {
  if (!product.value?.compareAtPrice || !hasProductPrice.value) return 0
  return Math.round((1 - (product.value.price as number) / product.value.compareAtPrice) * 100)
})

const productDescription = computed(() => {
  const source = product.value?.description || product.value?.subtitle || 'Consultez les informations de ce produit disponible localement chez Dounia Market Tchad.'
  const plainText = source.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plainText.length <= 155) return plainText
  const shortened = plainText.slice(0, 152).replace(/\s+\S*$/, '').trim()
  return `${shortened}...`
})
const productCanonical = computed(() => `${siteUrl}/produit/${encodeURIComponent(String(route.params.slug || ''))}`)
const productImageUrl = computed(() => {
  const image = mainImage.value
  if (!image) return `${siteUrl}/og-default.png`
  if (/^https?:\/\//.test(image)) return image
  if (image.startsWith('storage/') || image.startsWith('/storage/')) {
    return `${apiOrigin}/${image.replace(/^\/+/, '')}`
  }
  return `${siteUrl}/${image.replace(/^\/+/, '')}`
})

useSeoMeta({
  title: () => product.value?.title || 'Produit',
  description: () => productDescription.value,
  ogTitle: () => product.value ? `${product.value.title} | Dounia Market Tchad` : 'Produit | Dounia Market Tchad',
  ogDescription: () => productDescription.value,
  ogUrl: () => productCanonical.value,
  ogImage: () => productImageUrl.value,
  twitterTitle: () => product.value ? `${product.value.title} | Dounia Market Tchad` : 'Produit | Dounia Market Tchad',
  twitterDescription: () => productDescription.value,
  twitterImage: () => productImageUrl.value,
})

useHead(() => ({
  link: [{ key: 'canonical', rel: 'canonical', href: productCanonical.value }],
  script: product.value?.title && (product.value.description || product.value.subtitle)
    ? [{
        key: 'dounia-product-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.value.title,
          description: productDescription.value,
          url: productCanonical.value,
          ...(mainImage.value ? { image: [productImageUrl.value] } : {}),
          brand: { '@id': `${siteUrl}/#organization` },
        }),
      }]
    : [],
}))

const { trackProductView } = usePulse()

async function fetchProduct() {
  const slug = route.params.slug as string
  const { getProduct, getProducts } = useProducts()

  try {
    const response = await getProduct(slug)
    const data = response.product
    if (!data) return

    product.value = {
      id: data.id.toString(),
      title: data.title,
      handle: data.slug,
      description: data.description || '',
      subtitle: data.subtitle || '',
      price: normalizePrice(data.price),
      compareAtPrice: undefined,
      images: data.images || [],
      thumbnail: data.thumbnail || (data.images?.[0] ?? ''),
      category: data.category || '',
      categoryHandle: data.category_handle || '',
      inStock: normalizeAvailability(data.in_stock),
      stockQuantity: data.stock_quantity,
      variants: data.variants ? data.variants.map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.title || variant.name,
        price: normalizePrice(variant.price),
        inventory_quantity: normalizeInventory(variant.inventory_quantity),
      })) : [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    selectedImage.value = product.value.thumbnail || product.value.images?.[0] || null
    if (product.value.variants?.length) selectedVariant.value = product.value.variants[0]

    if (data.category_handle) {
      try {
        const relatedResponse = await getProducts({ category: data.category_handle, limit: 4 })
        relatedProducts.value = relatedResponse.products
          .filter((item: any) => item.id !== data.id)
          .slice(0, 4)
          .map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            handle: item.slug,
            price: normalizePrice(item.price),
            thumbnail: item.thumbnail || (item.images?.[0] ?? ''),
            category: item.category || '',
            categoryHandle: item.category_handle || '',
            images: item.images || [],
            inStock: normalizeAvailability(item.in_stock),
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }))
      } catch (e) {
        relatedProducts.value = []
      }
    }
  } catch (e) {
    console.error('Failed to fetch product:', e)
  } finally {
    if (product.value) trackProductView(parseInt(product.value.id), product.value.category || '')
    isLoading.value = false
  }
}

async function toggleFavorite() {
  if (!product.value) return
  if (isFavorite.value) {
    await favoritesStore.removeFromFavorites(product.value.id)
    return
  }
  if (!canFavorite.value || !hasProductPrice.value) return

  await favoritesStore.toggleFavorite({
    ...product.value,
    price: product.value.price as number,
    inStock: true,
    variants: undefined,
  })
}

function addToCart() {
  if (!product.value || !canAddToCart.value || !hasCurrentPrice.value) return
  isAddingToCart.value = true
  cartStore.addItem({
    productId: product.value.id,
    variantId: selectedVariant.value?.id,
    variantTitle: selectedVariant.value?.title,
    title: product.value.title,
    price: currentPrice.value as number,
    thumbnail: product.value.thumbnail,
    category: product.value.category,
  }, quantity.value)
  isAddingToCart.value = false
}

async function generateShareLink() {
  if (!product.value || isGeneratingLink.value) return
  isGeneratingLink.value = true

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ short_url: string }>(`${config.public.apiUrl}/links`, {
      method: 'POST',
      body: { product_id: parseInt(product.value.id) },
    })

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(response.short_url)
    } else {
      const element = document.createElement('textarea')
      element.value = response.short_url
      document.body.appendChild(element)
      element.select()
      document.execCommand('copy')
      document.body.removeChild(element)
    }

    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 3000)
  } catch (e) {
    console.error('Erreur lors de la génération du lien court:', e)
  } finally {
    isGeneratingLink.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
