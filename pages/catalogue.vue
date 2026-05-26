<template>
  <div class="min-h-screen bg-background pb-14">
    <header class="border-b border-border bg-card">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav class="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <NuxtLink to="/" class="hover:text-foreground">Accueil</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" />
          <span class="text-foreground">Catalogue</span>
        </nav>
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Produits locaux</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Choisissez pour votre famille
            </h1>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Produits préparés localement par Dounia Market et livrés à N'Djamena selon les zones couvertes.
              La disponibilité et le prix sont indiqués sur chaque article.
            </p>
          </div>
          <label class="relative block w-full lg:max-w-sm">
            <span class="sr-only">Rechercher un produit</span>
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Rechercher un produit"
              class="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </label>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section class="mb-7 rounded-lg border border-border bg-card p-4 sm:p-5" aria-label="Filtres du catalogue">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              class="shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
              :class="!selectedCategory ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
              @click="selectedCategory = ''"
            >
              Tous <span class="ml-1 opacity-75">{{ allProducts.length }}</span>
            </button>
            <button
              v-for="cat in categories"
              :key="cat.handle"
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
              :class="selectedCategory === cat.handle ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'"
              @click="selectedCategory = cat.handle"
            >
              <component :is="cat.icon" class="h-4 w-4" />
              {{ cat.name }}
              <span v-if="getCount(cat.handle)" class="opacity-75">{{ getCount(cat.handle) }}</span>
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
              <input v-model="inStockOnly" type="checkbox" class="h-4 w-4 accent-amber-700" />
              Disponibles uniquement
            </label>
            <label class="relative">
              <span class="sr-only">Filtrer par prix</span>
              <select
                v-model="selectedPrice"
                class="h-10 appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-9 text-sm text-foreground outline-none focus:border-brand"
              >
                <option v-for="range in priceRanges" :key="range.value" :value="range.value">
                  {{ range.label }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </label>
            <button
              v-if="hasFilters"
              type="button"
              class="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              @click="resetFilters"
            >
              <RotateCcw class="h-4 w-4" />
              Effacer
            </button>
          </div>
        </div>
      </section>

      <div class="mb-5 flex items-center justify-between gap-3">
        <p class="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutGrid class="h-4 w-4" />
          <strong class="text-foreground">{{ filteredProducts.length }}</strong>
          produit{{ filteredProducts.length > 1 ? 's' : '' }}
        </p>
        <p class="hidden text-xs text-muted-foreground sm:block">Zones et frais à confirmer avant ouverture publique</p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <ProductSkeleton v-for="i in 8" :key="i" />
      </div>

      <div v-else-if="error" class="mx-auto max-w-xl rounded-lg border border-red-100 bg-card p-8 text-center">
        <AlertCircle class="mx-auto mb-3 h-8 w-8 text-red-600" />
        <h2 class="text-lg font-semibold text-foreground">Catalogue indisponible</h2>
        <p class="mt-2 text-sm text-muted-foreground">{{ error }}</p>
        <button
          type="button"
          class="mt-5 inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
          @click="fetchProducts"
        >
          Réessayer
        </button>
      </div>

      <div v-else-if="filteredProducts.length" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
        <SearchX class="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h2 class="text-lg font-semibold text-foreground">Aucun produit trouvé</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Modifiez la recherche ou les filtres pour voir d'autres produits.
        </p>
        <button
          type="button"
          class="mt-5 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-semibold text-foreground"
          @click="resetFilters"
        >
          Réinitialiser
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, BookOpen, ChevronDown, ChevronRight, Gift, Heart, LayoutGrid, RotateCcw, Search, SearchX, Wheat } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'
import type { Product } from '~/types'

const route = useRoute()
const cartStore = useCartStore()
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

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.douniamarket.com/${path}`
  if (path.startsWith('/storage/')) return `https://api.douniamarket.com${path}`
  return path
}

const products = ref<CatalogueProduct[]>([])
const allProducts = ref<CatalogueProduct[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isSearchMode = ref(false)

const categories = [
  { name: 'Alimentaire', handle: 'alimentaire', icon: Wheat },
  { name: 'Scolarité', handle: 'scolarite', icon: BookOpen },
  { name: 'Santé & Bébé', handle: 'sante', icon: Heart },
  { name: 'Fêtes', handle: 'fetes', icon: Gift },
]

const priceRanges = computed(() => [
  { label: 'Tous les prix', value: '' },
  { label: `Moins de ${cartStore.formatPrice(30)}`, value: '0-30' },
  { label: `${cartStore.formatPrice(30)} à ${cartStore.formatPrice(60)}`, value: '30-60' },
  { label: `Plus de ${cartStore.formatPrice(60)}`, value: '60+' },
])

const selectedCategory = ref((route.query.categorie as string) || '')
const selectedPrice = ref('')
const searchQuery = ref('')
const inStockOnly = ref(false)

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getProducts({ limit: 100 })
    const mapped = response.products.map((p: any) => ({
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

    allProducts.value = mapped
    products.value = mapped
  } catch (e: any) {
    console.error('Error fetching products:', e)
    error.value = 'Impossible de charger les produits. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

const buildMeilisearchFilter = (): string[] => {
  const filters: string[] = []
  if (selectedCategory.value) filters.push(`category_handle = "${selectedCategory.value}"`)

  if (selectedPrice.value) {
    const [min, max] = selectedPrice.value.split('-').map(Number)
    filters.push(`price >= ${min}`)
    if (max) filters.push(`price <= ${max}`)
  }

  filters.push('is_active = true')
  return filters
}

const doMeilisearch = async (query: string) => {
  isLoading.value = true
  try {
    const { performSearch } = useMeilisearch()
    const results = await performSearch(query, {
      limit: 50,
      filter: buildMeilisearchFilter(),
    })

    products.value = (results.hits || []).map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.slug || p.id.toString(),
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: normalizePrice(p.price),
      thumbnail: resolveThumb(p.thumbnail),
      images: [],
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: normalizeAvailability(p.in_stock),
    }))
    isSearchMode.value = true
  } catch (e) {
    console.error('Meilisearch error, falling back to frontend filter:', e)
    isSearchMode.value = false
  } finally {
    isLoading.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (query) => {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!query || query.length < 2) {
    isSearchMode.value = false
    products.value = [...allProducts.value]
    return
  }

  searchTimeout = setTimeout(() => doMeilisearch(query), 300)
})

watch([selectedCategory, selectedPrice], () => {
  if (searchQuery.value.length >= 2) {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => doMeilisearch(searchQuery.value), 150)
  }
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (!isSearchMode.value) {
    if (selectedCategory.value) result = result.filter(product => product.categoryHandle === selectedCategory.value)

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
  }

  if (inStockOnly.value) result = result.filter(product => product.inStock === true)
  return result
})

const hasFilters = computed(() => Boolean(selectedCategory.value || selectedPrice.value || searchQuery.value || inStockOnly.value))
const getCount = (handle: string) => allProducts.value.filter(product => product.categoryHandle === handle).length

const resetFilters = () => {
  selectedCategory.value = ''
  selectedPrice.value = ''
  searchQuery.value = ''
  inStockOnly.value = false
  isSearchMode.value = false
  products.value = [...allProducts.value]
}

watch(() => route.query.categorie, (value) => {
  selectedCategory.value = (value as string) || ''
}, { immediate: true })

onMounted(() => {
  fetchProducts()
})

useHead({
  title: 'Catalogue | Dounia Market',
  meta: [
    { name: 'description', content: 'Consultez les produits Dounia Market disponibles pour une livraison locale à N’Djamena selon les zones couvertes.' },
  ],
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
