<template>
  <div class="min-h-screen bg-background pb-14">
    <section class="border-b border-border bg-card" aria-labelledby="category-title">
      <div class="container-main py-8 sm:py-10">
        <nav class="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
          <NuxtLink to="/" class="hover:text-foreground">Accueil</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
          <NuxtLink to="/catalogue" class="hover:text-foreground">Catalogue</NuxtLink>
          <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
          <span class="text-foreground">{{ currentCategoryName }}</span>
        </nav>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
        <h1 id="category-title" class="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">{{ currentCategoryName }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Les produits publiés dans cette catégorie apparaissent ci-dessous avec leurs informations de disponibilité locale.
        </p>
      </div>
    </section>

    <div class="container-main py-7">
      <div v-if="isLoading" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <ProductSkeleton v-for="i in 8" :key="i" />
      </div>

      <div v-else-if="error" class="market-empty mx-auto max-w-xl p-8 text-center sm:p-10">
        <AlertCircle class="mx-auto h-9 w-9 text-amber-700" :stroke-width="1.75" />
        <h2 class="mt-4 text-xl font-semibold text-foreground">Chargement impossible</h2>
        <p class="mt-2 text-sm text-muted-foreground">{{ error }}</p>
        <button type="button" class="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground" @click="fetchProducts">
          Réessayer
        </button>
      </div>

      <template v-else>
        <section v-if="allCategoryProducts.length" class="market-panel mb-7 p-4 sm:p-5" aria-label="Filtres de catégorie">
          <div class="flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/catalogue"
              class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Package class="h-4 w-4" :stroke-width="1.75" />
              Tout le catalogue
            </NuxtLink>
            <label class="relative flex-1">
              <span class="sr-only">Rechercher dans {{ currentCategoryName }}</span>
              <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
              <input
                v-model="searchQuery"
                type="search"
                :placeholder="`Rechercher dans ${currentCategoryName}`"
                class="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none focus:border-[#c9872b] focus:ring-1 focus:ring-[#c9872b]"
              />
            </label>
            <label class="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm">
              <input v-model="inStockOnly" type="checkbox" class="h-4 w-4 accent-amber-700" />
              Disponibles
            </label>
            <label class="relative">
              <span class="sr-only">Filtrer par prix</span>
              <select
                v-model="selectedPrice"
                class="h-11 w-full appearance-none rounded-lg border border-input bg-background py-2 pl-3 pr-9 text-sm outline-none focus:border-[#c9872b] sm:w-auto"
              >
                <option v-for="range in priceRanges" :key="range.value" :value="range.value">{{ range.label }}</option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
            </label>
            <button
              v-if="hasFilters"
              type="button"
              class="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              @click="resetFilters"
            >
              <RotateCcw class="h-4 w-4" :stroke-width="1.75" />
              Effacer
            </button>
          </div>
        </section>

        <div v-if="allCategoryProducts.length" class="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            <strong class="text-foreground">{{ filteredProducts.length }}</strong>
            produit{{ filteredProducts.length > 1 ? 's' : '' }} affiché{{ filteredProducts.length > 1 ? 's' : '' }}
          </p>
          <p>{{ availableCount }} indiqué{{ availableCount > 1 ? 's' : '' }} disponible{{ availableCount > 1 ? 's' : '' }}</p>
        </div>

        <div v-if="filteredProducts.length" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>

        <div v-else-if="!allCategoryProducts.length" class="market-empty mx-auto max-w-xl p-8 text-center sm:p-12">
          <Package class="mx-auto h-10 w-10 text-amber-700" :stroke-width="1.5" />
          <h2 class="mt-4 text-xl font-semibold text-foreground">Aucun produit publié dans cette catégorie</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
            Consultez le catalogue complet pour voir les produits actuellement publiés.
          </p>
          <NuxtLink to="/catalogue" class="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground">
            Retour au catalogue
          </NuxtLink>
        </div>

        <div v-else class="market-empty mx-auto max-w-xl p-8 text-center">
          <SearchX class="mx-auto h-9 w-9 text-amber-700" :stroke-width="1.75" />
          <h2 class="mt-4 text-xl font-semibold text-foreground">Aucun résultat pour ces filtres</h2>
          <p class="mt-2 text-sm text-muted-foreground">Modifiez les filtres ou affichez tous les produits de cette catégorie.</p>
          <button type="button" class="mt-6 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold" @click="resetFilters">
            Réinitialiser
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
const currentSlug = computed(() => route.params.slug as string)
const { getProducts } = useProducts()

type CatalogueProduct = Omit<Product, 'price' | 'inStock'> & {
  price?: number
  inStock?: boolean
}

const allCategoryProducts = ref<CatalogueProduct[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedPrice = ref('')
const searchQuery = ref('')
const inStockOnly = ref(false)

const categoryNameFromSlug = computed(() => {
  let slug = String(currentSlug.value || '')
  try {
    slug = decodeURIComponent(slug)
  } catch {
    // Keep the route value readable if the slug contains malformed encoding.
  }
  const name = slug.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Catégorie'
})
const currentCategoryName = computed(() => (
  allCategoryProducts.value.find(product => product.category)?.category || categoryNameFromSlug.value
))

useSeoMeta({
  title: () => currentCategoryName.value,
  description: () => `Consultez les produits ${currentCategoryName.value} disponibles chez Dounia Market Tchad pour une livraison locale à N'Djamena selon les zones couvertes.`,
  ogTitle: () => `${currentCategoryName.value} | Dounia Market Tchad`,
  ogDescription: () => `Produits ${currentCategoryName.value} disponibles localement pour une livraison à N'Djamena selon les zones couvertes.`,
})

const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

const priceRanges = computed(() => [
  { label: 'Tous les prix', value: '' },
  { label: `Moins de ${cartStore.formatPrice(30)}`, value: '0-30' },
  { label: `${cartStore.formatPrice(30)} à ${cartStore.formatPrice(60)}`, value: '30-60' },
  { label: `Plus de ${cartStore.formatPrice(60)}`, value: '60+' },
])

async function fetchProducts() {
  isLoading.value = true
  error.value = null

  try {
    const response = await getProducts({ category: currentSlug.value, limit: 100 })
    allCategoryProducts.value = response.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.slug || product.id.toString(),
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: normalizePrice(product.price),
      thumbnail: product.thumbnail || '',
      images: product.images || [],
      category: product.category || '',
      categoryHandle: product.category_handle || '',
      inStock: normalizeAvailability(product.in_stock),
    }))
  } catch (e) {
    console.error('Error fetching products:', e)
    allCategoryProducts.value = []
    error.value = 'Les produits de cette catégorie ne peuvent pas être chargés actuellement.'
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

function resetFilters() {
  selectedPrice.value = ''
  searchQuery.value = ''
  inStockOnly.value = false
}

watch(() => currentSlug.value, () => {
  resetFilters()
  fetchProducts()
}, { immediate: true })
</script>
