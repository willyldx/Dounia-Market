<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4" @click.self="close">
        <div 
          class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        >
          <div class="relative border-b border-gray-100">
            <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="Rechercher un produit..."
              class="w-full pl-14 pr-12 py-5 text-lg focus:outline-none"
              @keydown.escape="close"
            />
            <button @click="close" class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <X class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div v-if="query.length >= 2" class="max-h-80 overflow-y-auto">
            <div v-if="isSearching" class="p-8 text-center">
              <div class="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-[currentColor]">Recherche en cours...</p>
            </div>
            <div v-else-if="searchResults.length > 0" class="p-2">
              <NuxtLink 
                v-for="product in searchResults" :key="product.id"
                :to="`/produit/${product.handle}`"
                class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                @click="close"
              >
                <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title" class="w-full h-full object-cover" />
                  <Package v-else class="w-5 h-5 text-gray-400" />
                </div>
                <div class="flex-grow">
                  <h4 class="font-medium text-foreground" v-html="product.title"></h4>
                  <p class="text-sm text-[currentColor]" v-html="product.category"></p>
                </div>
                <span class="font-semibold text-[currentColor]">{{ formatPrice(product.price) }}</span>
              </NuxtLink>
            </div>
            <div v-else class="p-8 text-center">
              <SearchX class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-[currentColor]">Aucun résultat pour "{{ query }}"</p>
            </div>
          </div>

          <div v-else class="p-5">
            <p class="text-sm text-[currentColor] mb-3">Recherches populaires</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="term in ['Riz', 'Kit scolaire', 'Ramadan', 'Huile', 'Bébé']" :key="term" @click="query = term" class="px-4 py-2 rounded-full bg-gray-100 hover:bg-[currentColor] hover:text-white text-sm transition-colors">
                {{ term }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, X, Package, SearchX } from 'lucide-vue-next'
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
      const results = await performSearch(q, { 
        limit: 8,
        attributesToHighlight: ['title', 'category'],
        highlightPreTag: '<em class="bg-amber-100 text-amber-900 not-italic rounded px-0.5">',
        highlightPostTag: '</em>'
      })

      // Ignore results if a newer search has been started
      if (queryId !== currentQueryId) return

      // Map Meilisearch hits to our expected format
      searchResults.value = (results.hits || []).map((p: any) => ({
        id: p.id,
        title: p._highlightResult?.title?.value || p.title,
        handle: p.slug || p.handle || p.id,
        price: p.price,
        thumbnail: p.thumbnail ? (p.thumbnail.startsWith('http') ? p.thumbnail : (p.thumbnail.startsWith('/') ? 'https://api.spencerai.tech' + p.thumbnail : 'https://api.spencerai.tech/' + p.thumbnail)) : '',
        category: p._highlightResult?.category?.value || p.category || '',
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

const formatPrice = (price: number) => cartStore.formatPrice(price)

const close = () => { emit('update:modelValue', false); query.value = ''; searchResults.value = [] }

watch(() => props.modelValue, (open) => { if (open) nextTick(() => searchInput.value?.focus()) })
</script>
