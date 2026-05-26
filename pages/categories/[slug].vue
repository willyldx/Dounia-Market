<template>
  <div class="min-h-screen bg-background pb-14">
    <header class="border-b border-border bg-card">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav class="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <NuxtLink to="/" class="hover:text-foreground">Accueil</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" />
          <NuxtLink to="/catalogue" class="hover:text-foreground">Catalogue</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" />
          <span class="text-foreground">{{ currentCategoryName }}</span>
        </nav>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
        <h1 class="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{{ currentCategoryName }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Sélectionnez un produit pour votre proche à N'Djamena. La disponibilité locale est indiquée; les
          zones couvertes et frais seront confirmés avant l'ouverture publique.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section class="rounded-lg border border-border bg-card p-4 sm:p-5" aria-label="Filtres de catégorie">
        <div class="flex flex-col gap-4">
          <div class="scrollbar-hide flex gap-2 overflow-x-auto">
            <NuxtLink
              to="/catalogue"
              class="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Package class="h-4 w-4" />
              Tous
            </NuxtLink>
            <NuxtLink
              v-for="category in categories"
              :key="category.handle"
              :to="`/categories/${category.handle}`"
              class="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
              :class="currentSlug === category.handle ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
            >
              <component :is="category.icon" class="h-4 w-4" />
              {{ category.name }}
            </NuxtLink>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <label class="relative flex-1">
              <span class="sr-only">Rechercher dans {{ currentCategoryName }}</span>
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="searchQuery"
                type="search"
                :placeholder="`Rechercher dans ${currentCategoryName}`"
                class="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </label>
            <label class="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm">
              <input v-model="inStockOnly" type="checkbox" class="h-4 w-4 accent-amber-700" />
              Disponibles
            </label>
            <label class="relative">
              <span class="sr-only">Filtrer par prix</span>
              <select
                v-model="selectedPrice"
                class="h-11 w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-9 text-sm outline-none focus:border-brand sm:w-auto"
              >
                <option v-for="range in priceRanges" :key="range.value" :value="range.value">{{ range.label }}</option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </label>
            <button
              v-if="hasFilters"
              type="button"
              class="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              @click="resetFilters"
            >
              <RotateCcw class="h-4 w-4" />
              Effacer
            </button>
          </div>
        </div>
      </section>

      <div class="mb-5 mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>
          <strong class="text-foreground">{{ filteredProducts.length }}</strong>
          produit{{ filteredProducts.length > 1 ? 's' : '' }} affiché{{ filteredProducts.length > 1 ? 's' : '' }}
        </p>
        <p>{{ availableCount }} disponible{{ availableCount > 1 ? 's' : '' }} localement</p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <ProductSkeleton v-for="i in 8" :key="i" />
      </div>

      <div v-else-if="error" class="mx-auto max-w-xl rounded-lg border border-red-100 bg-card p-8 text-center">
        <AlertCircle class="mx-auto mb-3 h-8 w-8 text-red-600" />
        <h2 class="text-lg font-semibold text-foreground">Chargement impossible</h2>
        <p class="mt-2 text-sm text-muted-foreground">{{ error }}</p>
        <button type="button" class="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground" @click="fetchProducts">
          Réessayer
        </button>
      </div>

      <div v-else-if="filteredProducts.length" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        <SearchX class="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h2 class="text-lg font-semibold text-foreground">Aucun produit trouvé</h2>
        <p class="mt-2 text-sm text-muted-foreground">Modifiez les filtres ou consultez le catalogue complet.</p>
        <button type="button" class="mt-5 rounded-md border border-border px-4 py-2 text-sm font-semibold" @click="resetFilters">
          Réinitialiser
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpen, ChevronDown, ChevronRight, Gift, Heart, Package, RotateCcw, Search, SearchX, Wheat } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'
import type { Product } from '~/types'

const route = useRoute()
const cartStore = useCartStore()
const currentSlug = computed(() => route.params.slug as string)
const { getProducts } = useProducts()

type CatalogueProduct = Omit<Product, 'price' | 'inStock'> & {
  price?: number
  inStock?: boolean
}

const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

const categories = [
  { name: 'Alimentaire', handle: 'alimentaire', icon: Wheat },
  { name: 'Scolarité', handle: 'scolarite', icon: BookOpen },
  { name: 'Santé & Bébé', handle: 'sante', icon: Heart },
  { name: 'Fêtes', handle: 'fetes', icon: Gift },
]

const currentCategoryName = computed(() => {
  const category = categories.find(item => item.handle === currentSlug.value)
  return category ? category.name : currentSlug.value.replace(/-/g, ' ')
})

useSeoMeta({
  title: () => currentCategoryName.value,
  description: () => `Consultez les produits ${currentCategoryName.value} disponibles chez Dounia Market Tchad pour une livraison locale à N'Djamena selon les zones couvertes.`,
  ogTitle: () => `${currentCategoryName.value} | Dounia Market Tchad`,
  ogDescription: () => `Produits ${currentCategoryName.value} disponibles localement pour une livraison à N'Djamena selon les zones couvertes.`,
})

const allCategoryProducts = ref<CatalogueProduct[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedPrice = ref('')
const searchQuery = ref('')
const inStockOnly = ref(false)

const priceRanges = computed(() => [
  { label: 'Tous les prix', value: '' },
  { label: `Moins de ${cartStore.formatPrice(30)}`, value: '0-30' },
  { label: `${cartStore.formatPrice(30)} à ${cartStore.formatPrice(60)}`, value: '30-60' },
  { label: `Plus de ${cartStore.formatPrice(60)}`, value: '60+' },
])

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getProducts({ category: currentSlug.value, limit: 100 })
    allCategoryProducts.value = response.products.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.slug,
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: normalizePrice(p.price),
      thumbnail: p.thumbnail || '',
      images: p.images || [],
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: normalizeAvailability(p.in_stock),
    }))
  } catch (e) {
    console.error('Error fetching products:', e)
    allCategoryProducts.value = []
    error.value = 'Les produits de cette catégorie ne peuvent pas être chargés.'
  } finally {
    isLoading.value = false
  }
}

const filteredProducts = computed(() => {
  let result = [...allCategoryProducts.value]

  if (searchQuery.value.length >= 2) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => (
      product.title.toLowerCase().includes(query)
      || (product.description || '').toLowerCase().includes(query)
    ))
  }

  if (selectedPrice.value) {
    const [min, max] = selectedPrice.value.split('-').map(Number)
    result = max
      ? result.filter(product => typeof product.price === 'number' && product.price >= min && product.price <= max)
      : result.filter(product => typeof product.price === 'number' && product.price >= min)
  }

  if (inStockOnly.value) result = result.filter(product => product.inStock === true)
  return result
})

const availableCount = computed(() => allCategoryProducts.value.filter(product => product.inStock === true).length)
const hasFilters = computed(() => Boolean(selectedPrice.value || searchQuery.value || inStockOnly.value))

const resetFilters = () => {
  selectedPrice.value = ''
  searchQuery.value = ''
  inStockOnly.value = false
}

watch(() => currentSlug.value, () => {
  resetFilters()
  fetchProducts()
}, { immediate: true })
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
