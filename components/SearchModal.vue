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
        <div 
          class="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl transition-all"
        >
          <div class="relative border-b border-border">
            <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" :stroke-width="1.75" />
            <input 
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Rechercher un produit..."
              class="w-full py-4 pl-12 pr-12 text-base text-foreground focus:outline-none sm:py-5"
              @keydown.escape="close"
            />
            <button @click="close" class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md hover:bg-muted">
              <X class="h-5 w-5 text-muted-foreground" :stroke-width="1.75" />
            </button>
          </div>

          <div v-if="query.length >= 2" class="max-h-80 overflow-y-auto">
            <div v-if="isSearching" class="p-8 text-center">
              <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand"></div>
              <p class="text-sm text-muted-foreground">Recherche en cours...</p>
            </div>
            <div v-else-if="searchResults.length > 0" class="p-2">
              <NuxtLink 
                v-for="product in searchResults" :key="product.id"
                :to="`/produit/${encodeURIComponent(product.handle)}`"
                class="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-muted"
                @click="close"
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
            <div v-else class="p-8 text-center">
              <SearchX class="mx-auto mb-3 h-8 w-8 text-muted-foreground" :stroke-width="1.75" />
              <p class="text-sm text-muted-foreground">Aucun résultat pour "{{ query }}"</p>
            </div>
          </div>

          <div v-else class="p-5">
            <p class="text-sm text-muted-foreground">Saisissez au moins deux caractères pour rechercher dans le catalogue.</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, SearchX, X } from 'lucide-vue-next'
import { useMeilisearch } from '~/composables/useMeilisearch'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const cartStore = useCartStore()

const query = ref('')
const searchInput = ref<HTMLInputElement>()
const searchResults = ref<any[]>([])
const isSearching = ref(false)

// Instantiate Meilisearch once outside the watcher
const { performSearch } = useMeilisearch()

let searchTimeout: ReturnType<typeof setTimeout> | null = null
let currentQueryId = 0

// Debounced Meilisearch query
watch(query, (q) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
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

      // Ignore results if a newer search has been started
      if (queryId !== currentQueryId) return

      // Map Meilisearch hits to our expected format
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
  }, 250) // Slightly faster debounce for snappier feel
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

const close = () => { emit('update:modelValue', false); query.value = ''; searchResults.value = [] }

watch(() => props.modelValue, (open) => { if (open) nextTick(() => searchInput.value?.focus()) })
</script>
