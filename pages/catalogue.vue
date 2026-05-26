<template>
  <div class="min-h-screen bg-background pb-14">
    <section class="border-b border-border bg-card" aria-labelledby="catalogue-title">
      <div class="container-main py-8 sm:py-11">
        <nav class="mb-5 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
          <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
          <span class="text-foreground">Catalogue</span>
        </nav>
        <div class="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
            <h1 id="catalogue-title" class="mt-2 text-balance text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              Produits publiés pour N'Djamena
            </h1>
            <p class="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Consultez les articles présentés par Dounia Market Tchad et leurs informations de disponibilité locale.
            </p>
          </div>
          <label class="relative block w-full lg:max-w-sm">
            <span class="sr-only">Rechercher un produit</span>
            <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
            <input
              v-model="searchQuery"
              type="search"
              :disabled="Boolean(error) || (!isLoading && !allProducts.length)"
              :placeholder="!isLoading && !allProducts.length ? 'Aucun produit publié' : 'Rechercher un produit'"
              class="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#c9872b] focus:ring-1 focus:ring-[#c9872b] disabled:cursor-not-allowed disabled:bg-muted/50"
            />
          </label>
        </div>
      </div>
    </section>

    <div class="container-main py-7 sm:py-8">
      <div v-if="isLoading" aria-live="polite">
        <div class="mb-7 h-16 animate-pulse rounded-lg border border-border bg-card"></div>
        <div class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <ProductSkeleton v-for="i in 8" :key="i" />
        </div>
      </div>

      <div v-else-if="error" class="market-empty mx-auto max-w-2xl px-6 py-12 text-center sm:px-10">
        <AlertCircle class="mx-auto h-9 w-9 text-amber-700" :stroke-width="1.75" />
        <h2 class="mt-4 text-xl font-semibold text-foreground">Catalogue indisponible</h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{{ error }}</p>
        <button
          type="button"
          class="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          @click="fetchProducts"
        >
          Réessayer
        </button>
      </div>

      <template v-else>
        <section v-if="allProducts.length" class="market-panel mb-7 p-4 sm:p-5" aria-label="Filtres du catalogue">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                class="shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors"
                :class="!selectedCategory ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-muted-foreground hover:border-[#c9872b]/35 hover:text-foreground'"
                @click="selectedCategory = ''"
              >
                Tous <span class="ml-1 opacity-75">{{ allProducts.length }}</span>
              </button>
              <button
                v-for="cat in categories"
                :key="cat.handle"
                type="button"
                class="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors"
                :class="selectedCategory === cat.handle ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-muted-foreground hover:border-[#c9872b]/35 hover:text-foreground'"
                @click="selectedCategory = cat.handle"
              >
                {{ cat.name }}
                <span class="opacity-75">{{ getCount(cat.handle) }}</span>
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <label class="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
                <input v-model="inStockOnly" type="checkbox" class="h-4 w-4 accent-amber-700" />
                Disponibles uniquement
              </label>
              <label class="relative">
                <span class="sr-only">Filtrer par prix</span>
                <select
                  v-model="selectedPrice"
                  class="h-11 appearance-none rounded-lg border border-input bg-background py-2 pl-3 pr-9 text-sm text-foreground outline-none focus:border-[#c9872b]"
                >
                  <option v-for="range in priceRanges" :key="range.value" :value="range.value">
                    {{ range.label }}
                  </option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
              </label>
              <button
                v-if="hasFilters"
                type="button"
                class="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                @click="resetFilters"
              >
                <RotateCcw class="h-4 w-4" :stroke-width="1.75" />
                Effacer
              </button>
            </div>
          </div>
        </section>

        <div v-if="allProducts.length" class="mb-5 flex items-center justify-between gap-3">
          <p class="text-sm text-muted-foreground">
            <strong class="font-semibold text-foreground">{{ filteredProducts.length }}</strong>
            produit{{ filteredProducts.length > 1 ? 's' : '' }} affiché{{ filteredProducts.length > 1 ? 's' : '' }}
          </p>
          <p class="hidden text-xs text-muted-foreground sm:block">Disponibilités indiquées produit par produit</p>
        </div>

        <div v-if="filteredProducts.length" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>

        <div v-else-if="!allProducts.length" class="market-empty mx-auto max-w-2xl px-6 py-12 text-center sm:px-10 sm:py-14">
          <Package class="mx-auto h-10 w-10 text-amber-700" :stroke-width="1.5" />
          <h2 class="mt-4 text-xl font-semibold text-foreground sm:text-2xl">Aucun produit publié actuellement</h2>
          <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Les produits disponibles à la consultation apparaîtront ici dès leur publication.
          </p>
          <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <NuxtLink to="/" class="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground">
              Retour à l'accueil
            </NuxtLink>
            <NuxtLink to="/suivi" class="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground">
              Accéder au suivi
            </NuxtLink>
          </div>
        </div>

        <div v-else class="market-empty mx-auto max-w-xl px-6 py-10 text-center">
          <SearchX class="mx-auto h-9 w-9 text-amber-700" :stroke-width="1.75" />
          <h2 class="mt-4 text-xl font-semibold text-foreground">Aucun résultat pour ces filtres</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Modifiez la recherche ou affichez de nouveau tous les produits publiés.
          </p>
          <button
            type="button"
            class="mt-6 inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground"
            @click="resetFilters"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, ChevronDown, ChevronRight, Package, RotateCcw, Search, SearchX } from 'lucide-vue-next'
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

const categories = computed(() => {
  const seen = new Set<string>()
  return allProducts.value.reduce<Array<{ name: string; handle: string }>>((result, product) => {
    const handle = product.categoryHandle
    if (!handle || seen.has(handle)) return result
    seen.add(handle)
    result.push({
      handle,
      name: product.category || handle.replace(/-/g, ' '),
    })
    return result
  }, [])
})

const mapProduct = (product: any): CatalogueProduct => ({
  id: product.id.toString(),
  title: product.title,
  handle: product.slug || product.id.toString(),
  subtitle: product.subtitle || '',
  description: product.description || '',
  price: normalizePrice(product.price),
  thumbnail: resolveThumb(product.thumbnail),
  images: (product.images || []).map((image: string) => resolveThumb(image)),
  category: product.category || '',
  categoryHandle: product.category_handle || '',
  inStock: normalizeAvailability(product.in_stock),
})

async function fetchProducts() {
  isLoading.value = true
  error.value = null

  try {
    const response = await getProducts({ limit: 100 })
    const mapped = response.products.map(mapProduct)
    allProducts.value = mapped
    products.value = mapped
  } catch (e) {
    console.error('Error fetching products:', e)
    allProducts.value = []
    products.value = []
    error.value = 'Impossible de charger les produits publiés pour le moment. Veuillez réessayer.'
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

async function doMeilisearch(query: string) {
  isLoading.value = true
  try {
    const { performSearch } = useMeilisearch()
    const results = await performSearch(query, {
      limit: 50,
      filter: buildMeilisearchFilter(),
    })

    products.value = (results.hits || []).map(mapProduct)
    isSearchMode.value = true
  } catch (e) {
    console.error('Meilisearch error, falling back to frontend filter:', e)
    products.value = [...allProducts.value]
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

function resetFilters() {
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

onMounted(fetchProducts)

useSeoMeta({
  title: 'Catalogue',
  description: 'Consultez les produits disponibles chez Dounia Market Tchad pour une livraison locale à N\'Djamena selon les zones couvertes.',
  ogTitle: 'Catalogue | Dounia Market Tchad',
  ogDescription: 'Consultez les produits disponibles localement pour vos proches à N\'Djamena selon les zones couvertes.',
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
