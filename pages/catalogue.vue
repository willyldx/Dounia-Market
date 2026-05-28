<template>
  <div class="min-h-screen bg-background pb-14">
    <!-- EN-TÊTE DU CATALOGUE -->
    <section class="border-b border-border bg-card" aria-labelledby="catalogue-title">
      <div class="container-main py-10 sm:py-14">
        <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
          <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
          <span class="text-gold-700">Catalogue</span>
        </nav>

        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <div class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">
              <Sparkles class="h-3.5 w-3.5" />
              Le catalogue
            </div>
            <h1 id="catalogue-title" class="heading-hero text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Tout pour vos proches, à <span class="text-gold-700">N'Djamena</span>
            </h1>
            <p class="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Choisissez ce dont votre famille a besoin. Nous préparons la commande et la remettons en main propre.
            </p>
          </div>

          <label class="relative block w-full lg:max-w-sm">
            <span class="sr-only">Rechercher un produit</span>
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-muted-foreground" :stroke-width="1.75" />
            </div>
            <input
              v-model="searchQuery"
              type="search"
              :disabled="Boolean(error) || (!isLoading && !allProducts.length)"
              :placeholder="!isLoading && !allProducts.length ? 'Catalogue en préparation' : 'Que cherchez-vous ?'"
              class="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>
      </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="container-main py-8 sm:py-12">
      <!-- État de chargement -->
      <div v-if="isLoading" aria-live="polite" class="animate-pulse">
        <div class="mb-8 h-16 w-full rounded-xl bg-muted/60"></div>
        <div class="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <ProductSkeleton v-for="i in 8" :key="i" />
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="market-empty mx-auto max-w-2xl px-6 py-12 text-center sm:px-10 shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle class="h-8 w-8" :stroke-width="1.75" />
        </div>
        <h2 class="mt-5 text-2xl font-bold text-foreground">Oups, petit souci technique !</h2>
        <p class="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{{ error }}</p>
        <button
          type="button"
          class="btn-primary mt-8"
          @click="fetchProducts"
        >
          <span><RotateCcw class="h-4 w-4" /> Réessayer</span>
        </button>
      </div>

      <template v-else>
        <!-- Filtres -->
        <section v-if="allProducts.length" class="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5" aria-label="Filtres du catalogue">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <!-- Catégories (Pilules) -->
            <div class="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                class="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
                :class="!selectedCategory ? 'border-gold-500 bg-gold-500 text-white shadow-md' : 'border-border bg-background text-muted-foreground hover:border-gold-500/40 hover:bg-gold-50 hover:text-gold-800'"
                @click="selectedCategory = ''"
              >
                Tous <span class="ml-1.5 opacity-80 text-xs bg-black/10 px-1.5 py-0.5 rounded-full">{{ allProducts.length }}</span>
              </button>
              <button
                v-for="cat in categories"
                :key="cat.handle"
                type="button"
                class="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
                :class="selectedCategory === cat.handle ? 'border-gold-500 bg-gold-500 text-white shadow-md' : 'border-border bg-background text-muted-foreground hover:border-gold-500/40 hover:bg-gold-50 hover:text-gold-800'"
                @click="selectedCategory = cat.handle"
              >
                {{ cat.name }}
                <span class="opacity-80 text-xs bg-black/10 px-1.5 py-0.5 rounded-full">{{ getCount(cat.handle) }}</span>
              </button>
            </div>

            <!-- Autres filtres -->
            <div class="flex flex-wrap items-center gap-3">
              <label class="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-gold-200 hover:bg-gold-50/50">
                <input v-model="inStockOnly" type="checkbox" class="h-4 w-4 rounded text-gold-600 accent-gold-600 focus:ring-gold-500" />
                En stock
              </label>
              <div class="relative">
                <select
                  v-model="selectedPrice"
                  class="h-11 cursor-pointer appearance-none rounded-lg border border-border bg-background py-2 pl-10 pr-10 text-sm font-medium text-foreground outline-none transition-colors hover:border-gold-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  aria-label="Filtrer par prix"
                >
                  <option v-for="range in priceRanges" :key="range.value" :value="range.value">
                    {{ range.label }}
                  </option>
                </select>
                <SlidersHorizontal class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
              </div>
              <div class="relative">
                <select
                  v-model="sortBy"
                  class="h-11 cursor-pointer appearance-none rounded-lg border border-border bg-background py-2 pl-10 pr-10 text-sm font-medium text-foreground outline-none transition-colors hover:border-gold-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  aria-label="Trier les produits"
                >
                  <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <ArrowUpDown class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
                <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
              </div>
              <button
                v-if="hasFilters"
                type="button"
                class="btn-ghost !px-3"
                @click="resetFilters"
                aria-label="Effacer les filtres"
              >
                <RotateCcw class="h-4 w-4" :stroke-width="2" />
              </button>
            </div>
          </div>
        </section>

        <!-- Résultats -->
        <div v-if="allProducts.length" class="mb-6 flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-muted-foreground">
            <strong class="font-bold text-foreground">{{ filteredProducts.length }}</strong>
            produit{{ filteredProducts.length > 1 ? 's' : '' }} trouvé{{ filteredProducts.length > 1 ? 's' : '' }}
          </p>
        </div>

        <template v-if="filteredProducts.length">
          <div class="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
          </div>

          <div v-if="visibleCount < filteredProducts.length" class="mt-10 flex flex-col items-center gap-3">
            <p class="text-xs text-muted-foreground">
              {{ visibleProducts.length }} sur {{ filteredProducts.length }} produits
            </p>
            <button type="button" class="btn-outline" @click="visibleCount += PAGE_SIZE">
              Voir plus de produits
            </button>
          </div>
        </template>

        <!-- Aucun produit publié (Catalogue vide) -->
        <div v-else-if="!allProducts.length" class="market-empty mx-auto max-w-2xl px-6 py-14 text-center sm:px-10 sm:py-20 shadow-sm">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-100 text-gold-700">
            <Package class="h-10 w-10" :stroke-width="1.5" />
          </div>
          <h2 class="heading-section mt-6 text-2xl">Boutique en préparation</h2>
          <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            Nous sommes en train de garnir nos rayons ! Les meilleurs produits pour vos proches à N'Djamena seront très bientôt disponibles ici.
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <NuxtLink to="/" class="btn-outline">
              Retour à l'accueil
            </NuxtLink>
            <NuxtLink to="/comment-ca-marche" class="btn-primary">
              <span>Découvrir le concept</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Aucun résultat (Filtres trop stricts) -->
        <div v-else class="market-empty mx-auto max-w-xl px-6 py-12 text-center shadow-sm">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX class="h-8 w-8" :stroke-width="1.75" />
          </div>
          <h2 class="mt-5 text-xl font-bold text-foreground">Aucun produit ne correspond</h2>
          <p class="mt-3 text-base text-muted-foreground">
            Essayez d'adoucir vos filtres ou de chercher avec d'autres mots-clés.
          </p>
          <button
            type="button"
            class="btn-outline mt-7"
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
import { AlertCircle, ArrowUpDown, ChevronDown, ChevronRight, Package, RotateCcw, Search, SearchX, SlidersHorizontal, Sparkles } from 'lucide-vue-next'
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

const categoryLabels: Record<string, string> = {
  alimentaire: 'Épicerie et essentiels',
  scolarite: 'Scolarité',
  sante: 'Bébé et soins',
  fetes: 'Fêtes',
}

const priceRanges = computed(() => [
  { label: 'Tous les prix', value: '' },
  { label: `Moins de ${cartStore.formatPrice(30)}`, value: '0-30' },
  { label: `${cartStore.formatPrice(30)} à ${cartStore.formatPrice(60)}`, value: '30-60' },
  { label: `Plus de ${cartStore.formatPrice(60)}`, value: '60+' },
])

const selectedCategory = ref((route.query.categorie as string) || '')
const selectedPrice = ref('')
const searchQuery = ref((route.query.q as string) || '')
const inStockOnly = ref(false)
const sortBy = ref('pertinence')

const sortOptions = [
  { label: 'Tri : pertinence', value: 'pertinence' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
  { label: 'Nom (A → Z)', value: 'name-asc' },
]

const PAGE_SIZE = 12
const visibleCount = ref(PAGE_SIZE)

const categories = computed(() => {
  const seen = new Set<string>()
  return allProducts.value.reduce<Array<{ name: string; handle: string }>>((result, product) => {
    const handle = product.categoryHandle
    if (!handle || seen.has(handle)) return result
    seen.add(handle)
    result.push({
      handle,
      name: categoryLabels[handle] || product.category || handle.replace(/-/g, ' '),
    })
    return result
  }, [])
})

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
    allProducts.value = []
    products.value = []
    error.value = 'Oups, nous n\'avons pas pu charger le catalogue. Notre équipe technique est sur le coup !'
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

  const priceOrInfinity = (p?: number, fallback = Number.POSITIVE_INFINITY) => (
    typeof p === 'number' && Number.isFinite(p) ? p : fallback
  )
  if (sortBy.value === 'price-asc') {
    result = [...result].sort((a, b) => priceOrInfinity(a.price) - priceOrInfinity(b.price))
  } else if (sortBy.value === 'price-desc') {
    result = [...result].sort((a, b) => priceOrInfinity(b.price, Number.NEGATIVE_INFINITY) - priceOrInfinity(a.price, Number.NEGATIVE_INFINITY))
  } else if (sortBy.value === 'name-asc') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
  }

  return result
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))

watch([selectedCategory, selectedPrice, searchQuery, inStockOnly, sortBy], () => {
  visibleCount.value = PAGE_SIZE
})

const hasFilters = computed(() => Boolean(selectedCategory.value || selectedPrice.value || searchQuery.value || inStockOnly.value))
const getCount = (handle: string) => allProducts.value.filter(product => product.categoryHandle === handle).length

const resetFilters = () => {
  selectedCategory.value = ''
  selectedPrice.value = ''
  searchQuery.value = ''
  inStockOnly.value = false
  sortBy.value = 'pertinence'
  isSearchMode.value = false
  products.value = [...allProducts.value]
}

watch(() => route.query.categorie, (value) => {
  selectedCategory.value = (value as string) || ''
}, { immediate: true })

watch(() => route.query.q, (value) => {
  searchQuery.value = (value as string) || ''
})

onMounted(() => {
  fetchProducts()
})

useSeoMeta({
  title: 'Catalogue',
  description: 'Découvrez notre sélection de produits disponibles pour une livraison rapide à N\'Djamena.',
  ogTitle: 'Catalogue | Dounia Market Tchad',
  ogDescription: 'Faites plaisir à vos proches au Tchad. Découvrez nos produits et commandez en toute sécurité.',
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
