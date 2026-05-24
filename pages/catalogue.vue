<template>
  <div class="bg-background min-h-screen pb-16">
    <!-- Slim Hero Header -->
    <section class="bg-brand text-brand-foreground pt-24 pb-12 px-4 relative overflow-hidden reveal-up">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSI4NiIgPjxyZWN0IHdpZHRoPSI4NiIgaGVpZ2h0PSI4NiIgZmlsbD0ibm9uZSI+PC9yZWN0PjxjaXJjbGUgY3g9IjQzIiBjeT0iNDMiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSI+PC9jaXJjbGU+PC9zdmc+')] opacity-30 pointer-events-none" />
      <div class="container-main relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 text-white/60 text-xs mb-4 uppercase tracking-widest font-bold">
              <NuxtLink to="/" class="hover:text-[var(--color-accent)] transition-colors">Accueil</NuxtLink>
              <ChevronRight class="w-3 h-3" />
              <span class="text-white">Catalogue</span>
            </div>
            <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Notre Sélection</h1>
            <p class="text-white/70 text-sm md:text-base mt-2 max-w-xl">
              Produits essentiels de haute qualité, livraison express à N'Djamena.
            </p>
          </div>
          <div class="w-full md:w-96 text-right">
             <div class="relative w-full shadow-premium group">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-foreground/50 group-focus-within:text-accent transition-colors" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher (ex: Lait, Sucre)..." class="w-full bg-brand-foreground/10 hover:bg-brand-foreground/15 focus:bg-background backdrop-blur text-brand-foreground focus:text-foreground border border-brand-foreground/20 focus:border-brand-foreground py-3.5 pl-12 pr-4 rounded-xl font-medium placeholder-brand-foreground/50 focus:outline-none transition-all shadow-sm" />
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Horizontal Tools Bar -->
    <div class="sticky top-[72px] z-30 glass border-b transition-all duration-300">
      <div class="container-main py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        <!-- Category Chips -->
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide snap-x">
          <button @click="selectedCategory = ''" class="chip" :class="{ 'active shadow-premium': !selectedCategory }">
            <span class="whitespace-nowrap">Toutes les catégories</span>
            <span class="chip-count">{{ products.length }}</span>
          </button>
          <button v-for="cat in categories" :key="cat.handle" @click="selectedCategory = cat.handle" class="chip snap-start" :class="{ 'active shadow-premium': selectedCategory === cat.handle }">
            <component :is="cat.icon" class="w-4 h-4" />
            <span class="whitespace-nowrap">{{ cat.name }}</span>
            <span class="chip-count" v-if="getCount(cat.handle) > 0">{{ getCount(cat.handle) }}</span>
          </button>
        </div>

        <!-- Price Drops & Reset -->
        <div class="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <div class="relative group">
            <select v-model="selectedPrice" class="appearance-none bg-card border border-border text-foreground font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer hover:bg-muted transition-colors text-sm shadow-sm">
              <optgroup label="Budget">
                <option v-for="r in priceRanges" :key="r.value" :value="r.value">{{ r.label }}</option>
              </optgroup>
            </select>
            <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button v-if="hasFilters" @click="resetFilters" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group relative" title="Effacer les filtres">
            <RotateCcw class="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-main py-8 reveal-up">
      
      <!-- Top info line -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-sm font-bold text-muted-foreground flex items-center gap-2">
           <LayoutGrid class="w-4 h-4" />
           <span class="text-brand">{{ filteredProducts.length }}</span> résultats trouvés
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="i in 8" :key="i" class="card p-4 animate-pulse">
          <div class="aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="flex justify-between items-end mt-4">
             <div class="h-6 bg-gray-200 rounded w-1/3"></div>
             <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="card p-16 text-center max-w-2xl mx-auto mt-10">
        <AlertCircle class="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-[var(--color-text)] mb-2">Chargement impossible</h3>
        <p class="text-[var(--color-text-muted)] mb-6">{{ error }}</p>
        <button @click="fetchProducts" class="btn-primary"><span>Réessayer</span></button>
      </div>

      <!-- Products grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard v-for="(p, i) in filteredProducts" :key="p.id" :product="p" :delay="(i % 12) * 50" />
      </div>

      <!-- Empty state -->
      <div v-else class="card p-16 text-center max-w-2xl mx-auto mt-10">
        <SearchX class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-[var(--color-text)] mb-2">Aucun produit trouvé</h3>
        <p class="text-[var(--color-text-muted)] mb-6">Essayez d'ajuster vos filtres de recherche ou vérifiez l'orthographe.</p>
        <button @click="resetFilters" class="btn-primary"><span>Réinitialiser la recherche</span></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, LayoutGrid, RotateCcw, Search, SearchX, AlertCircle, Wheat, BookOpen, Heart, Gift, ChevronDown } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import type { Product } from '~/types'

const route = useRoute()
const { getProducts } = useProducts()

const resolveThumb = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `https://api.spencerai.tech/${path}`
  if (path.startsWith('/storage/')) return `https://api.spencerai.tech${path}`
  return path
}

// State
const products = ref<Product[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isSearchMode = ref(false) // true when using Meilisearch results

// Categories
const categories = [
  { name: 'Alimentaire', handle: 'alimentaire', icon: Wheat },
  { name: 'Scolarité', handle: 'scolarite', icon: BookOpen },
  { name: 'Santé & Bébé', handle: 'sante', icon: Heart },
  { name: 'Fêtes', handle: 'fetes', icon: Gift },
]

const priceRanges = [
  { label: 'Tous les prix', value: '' },
  { label: 'Moins de 30€', value: '0-30' },
  { label: '30€ - 60€', value: '30-60' },
  { label: 'Plus de 60€', value: '60+' },
]

const selectedCategory = ref(route.query.categorie as string || '')
const selectedPrice = ref('')
const searchQuery = ref('')

// Keep a copy of the full product list from Laravel (for counts + reset)
const allProducts = ref<Product[]>([])

// Fetch products from Laravel API (initial load)
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
      price: p.price || 0,
      thumbnail: p.thumbnail || '',
      images: p.images || [],
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: p.in_stock,
    }))

    allProducts.value = mapped
    products.value = mapped
  } catch (e: any) {
    console.error('Error fetching products:', e)
    error.value = 'Impossible de charger le catalogue. Vérifiez votre connexion internet et réessayez.'
  } finally {
    isLoading.value = false
  }
}

// Build Meilisearch filter string from active filters
const buildMeilisearchFilter = (): string[] => {
  const filters: string[] = []
  
  if (selectedCategory.value) {
    filters.push(`category_handle = "${selectedCategory.value}"`)
  }
  
  if (selectedPrice.value) {
    const [min, max] = selectedPrice.value.split('-').map(Number)
    if (max) {
      filters.push(`price >= ${min}`)
      filters.push(`price <= ${max}`)
    } else {
      // "60+" case
      filters.push(`price >= ${min}`)
    }
  }

  // Always filter active products
  filters.push('is_active = true')

  return filters
}

// Perform Meilisearch search
const doMeilisearch = async (query: string) => {
  isLoading.value = true
  
  try {
    const { performSearch } = useMeilisearch()
    const filter = buildMeilisearchFilter()
    
    const results = await performSearch(query, {
      limit: 50,
      filter,
    })

    products.value = (results.hits || []).map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.slug || p.id.toString(),
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: p.price || 0,
      thumbnail: resolveThumb(p.thumbnail),
      images: [],
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: p.in_stock ?? true,
    }))

    isSearchMode.value = true
  } catch (e) {
    console.error('Meilisearch error, falling back to frontend filter:', e)
    // Fallback: filter from allProducts
    isSearchMode.value = false
  } finally {
    isLoading.value = false
  }
}

// Debounced search watcher
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (q) => {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!q || q.length < 2) {
    // Revert to full list from Laravel
    isSearchMode.value = false
    products.value = [...allProducts.value]
    return
  }

  searchTimeout = setTimeout(() => doMeilisearch(q), 300)
})

// When category or price filters change while searching, re-run Meilisearch
watch([selectedCategory, selectedPrice], () => {
  if (searchQuery.value && searchQuery.value.length >= 2) {
    // Re-run search with new filters
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => doMeilisearch(searchQuery.value), 150)
  }
})

// Filtered products (frontend filtering when NOT in search mode)
const filteredProducts = computed(() => {
  // If Meilisearch handled the query + filters, just return the results as-is
  if (isSearchMode.value) {
    return products.value
  }

  // Frontend filtering for initial load / no search query
  let result = [...products.value]
  
  if (selectedCategory.value) {
    result = result.filter(p => p.categoryHandle === selectedCategory.value)
  }
  
  // Apply fallback text search if there is a query but Meilisearch failed
  if (searchQuery.value && searchQuery.value.length >= 2) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  
  if (selectedPrice.value) {
    const [min, max] = selectedPrice.value.split('-').map(Number)
    result = max 
      ? result.filter(p => p.price >= min && p.price <= max) 
      : result.filter(p => p.price >= min)
  }
  
  return result
})

const hasFilters = computed(() => selectedCategory.value || selectedPrice.value || searchQuery.value)

// Counts always use the full list from Laravel
const getCount = (handle: string) => allProducts.value.filter(p => p.categoryHandle === handle).length

const resetFilters = () => { 
  selectedCategory.value = ''
  selectedPrice.value = ''
  searchQuery.value = ''
  isSearchMode.value = false
  products.value = [...allProducts.value]
}

// Watch route query
watch(() => route.query.categorie, (v) => { 
  selectedCategory.value = v as string || '' 
}, { immediate: true })

// Fetch on mount
onMounted(() => {
  fetchProducts()
})

useHead({ title: 'Catalogue' })
</script>

<style scoped>
.chip {
  @apply flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:border-muted-foreground/30 transition-all shadow-sm;
}
.chip.active {
  @apply bg-brand border-brand text-brand-foreground;
}
.chip-count {
  @apply ml-1 bg-muted text-muted-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full;
}
.chip.active .chip-count {
  @apply bg-brand-foreground/20 text-brand-foreground;
}

/* Hide scrollbar for chips */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
