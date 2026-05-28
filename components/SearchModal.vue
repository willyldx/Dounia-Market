<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm sm:pt-24" @click.self="close">
        <div class="w-full max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl transition-all">
          <div class="relative border-b border-border">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Rechercher un produit..."
              class="w-full py-4 pl-12 pr-12 text-base text-foreground focus:outline-none sm:py-5"
              @keydown.escape="close"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter.prevent="onEnter"
            />
            <button @click="close" aria-label="Fermer la recherche" class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md hover:bg-muted">
              <X class="h-5 w-5 text-muted-foreground" :stroke-width="1.75" />
            </button>
          </div>

          <div v-if="query.length >= 2" class="max-h-96 overflow-y-auto">
            <div v-if="isSearching" class="p-8 text-center">
              <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand"></div>
              <p class="text-sm text-muted-foreground">Recherche en cours...</p>
            </div>
            <template v-else-if="searchResults.length > 0">
              <div class="p-2">
                <NuxtLink
                  v-for="(product, index) in searchResults"
                  :key="product.id"
                  :to="`/produit/${encodeURIComponent(product.handle)}`"
                  class="flex items-center gap-3 rounded-md p-3 transition-colors"
                  :class="index === activeIndex ? 'bg-muted' : 'hover:bg-muted'"
                  @click="onResultClick"
                  @mouseenter="activeIndex = index"
                >
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                    <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title" class="h-full w-full object-contain p-1" />
                    <span v-else class="text-[10px] text-muted-foreground">Sans visuel</span>
                  </div>
                  <div class="min-w-0 flex-grow">
                    <h4 class="truncate text-sm font-semibold text-foreground">{{ product.title }}</h4>
                    <p v-if="product.category" class="mt-0.5 truncate text-xs text-muted-foreground">{{ product.category }}</p>
                  </div>
                  <span v-if="hasKnownPrice(product.price)" class="shrink-0 text-sm font-semibold text-foreground">{{ formatPrice(product.price) }}</span>
                </NuxtLink>
              </div>
              <button
                type="button"
                class="flex w-full items-center justify-between gap-2 border-t border-border px-5 py-3.5 text-sm font-semibold text-gold-800 transition-colors hover:bg-muted"
                @click="seeAllResults"
              >
                Voir tous les résultats pour « {{ query }} »
                <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
              </button>
            </template>
            <div v-else class="p-8 text-center">
              <SearchX class="mx-auto mb-3 h-8 w-8 text-muted-foreground" :stroke-width="1.75" />
              <p class="text-sm text-muted-foreground">Aucun résultat pour « {{ query }} »</p>
            </div>
          </div>

          <div v-else class="p-5">
            <div v-if="recentSearches.length" class="mb-2">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recherches récentes</p>
                <button type="button" class="text-xs font-medium text-muted-foreground hover:text-foreground" @click="clearRecent">
                  Effacer
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="term in recentSearches"
                  :key="term"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-gold-200 hover:bg-gold-50"
                  @click="query = term"
                >
                  <Clock class="h-3.5 w-3.5 text-muted-foreground" :stroke-width="1.75" />
                  {{ term }}
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground">Saisissez au moins deux caractères pour rechercher dans le catalogue.</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ArrowRight, Clock, Search, SearchX, X } from 'lucide-vue-next'
import { useMeilisearch } from '~/composables/useMeilisearch'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const cartStore = useCartStore()
const router = useRouter()

const query = ref('')
const searchInput = ref<HTMLInputElement>()
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const activeIndex = ref(-1)
const recentSearches = ref<string[]>([])

const RECENT_KEY = 'dounia:recent-searches'

const { performSearch } = useMeilisearch()

let searchTimeout: ReturnType<typeof setTimeout> | null = null
let currentQueryId = 0

watch(query, (q) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  activeIndex.value = -1

  if (!q || q.length < 2) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  const queryId = ++currentQueryId
  isSearching.value = true

  searchTimeout = setTimeout(async () => {
    try {
      const results = await performSearch(q, { limit: 8 })
      if (queryId !== currentQueryId) return

      searchResults.value = (results.hits || []).map((p: any) => ({
        id: p.id,
        title: p.title || '',
        handle: p.slug || p.handle || p.id,
        price: normalizePrice(p.price),
        thumbnail: normalizeThumbnail(p.thumbnail),
        category: p.category || '',
      }))
    } catch (e) {
      console.error('Search failed', e)
    } finally {
      if (queryId === currentQueryId) {
        isSearching.value = false
      }
    }
  }, 250)
})

const normalizePrice = (price: unknown): number | undefined => (
  typeof price === 'number' && Number.isFinite(price) ? price : undefined
)
const hasKnownPrice = (price: unknown): price is number => (
  typeof price === 'number' && Number.isFinite(price)
)
const formatPrice = (price: number) => cartStore.formatPrice(price)

const normalizeThumbnail = (thumbnail?: string) => {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('https://')) return thumbnail
  if (thumbnail.startsWith('/')) return `https://api.douniamarket.com${thumbnail}`
  if (/^[\w./-]+$/.test(thumbnail)) return `https://api.douniamarket.com/${thumbnail}`
  return ''
}

const loadRecent = () => {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    recentSearches.value = raw ? JSON.parse(raw).slice(0, 5) : []
  } catch {
    recentSearches.value = []
  }
}

const rememberSearch = (term: string) => {
  const clean = term.trim()
  if (clean.length < 2 || !import.meta.client) return
  const next = [clean, ...recentSearches.value.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5)
  recentSearches.value = next
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch { /* ignore quota errors */ }
}

const clearRecent = () => {
  recentSearches.value = []
  if (import.meta.client) localStorage.removeItem(RECENT_KEY)
}

const move = (delta: number) => {
  if (!searchResults.value.length) return
  const count = searchResults.value.length
  activeIndex.value = (activeIndex.value + delta + count) % count
}

const onEnter = () => {
  if (activeIndex.value >= 0 && searchResults.value[activeIndex.value]) {
    const product = searchResults.value[activeIndex.value]
    rememberSearch(query.value)
    router.push(`/produit/${encodeURIComponent(product.handle)}`)
    close()
    return
  }
  if (query.value.trim().length >= 2) seeAllResults()
}

const onResultClick = () => {
  rememberSearch(query.value)
  close()
}

const seeAllResults = () => {
  rememberSearch(query.value)
  router.push(`/catalogue?q=${encodeURIComponent(query.value.trim())}`)
  close()
}

const close = () => {
  emit('update:modelValue', false)
  query.value = ''
  searchResults.value = []
  activeIndex.value = -1
}

watch(() => props.modelValue, (open) => {
  if (open) {
    loadRecent()
    nextTick(() => searchInput.value?.focus())
  }
})
</script>
