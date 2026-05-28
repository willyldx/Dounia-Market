<template>
  <section v-if="recommendations.length" class="mt-12 border-t border-border pt-8 sm:mt-14">
    <div class="mb-5 flex items-end justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">À découvrir</p>
        <h2 class="mt-2 text-xl font-bold text-foreground sm:text-2xl">Autres produits du catalogue</h2>
      </div>
      <NuxtLink to="/catalogue" class="hidden text-sm font-semibold text-brand hover:text-brand/80 sm:inline-flex">
        Voir tout
      </NuxtLink>
    </div>
    <div class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      <ProductCard v-for="item in recommendations" :key="item.id" :product="item" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProductCard from '~/components/product/ProductCard.vue'

const props = defineProps<{
  product: Record<string, any>
}>()

const recommendations = ref<any[]>([])
const { hasConsent } = useAnalyticsConsent()
const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

const fetchRecommendations = async () => {
  if (!hasConsent.value) {
    recommendations.value = []
    return
  }

  try {
    const config = useRuntimeConfig()
    const aiOrigin = String(config.public.aiApiUrl || 'https://ai.douniamarket.com').replace(/\/+$/, '')
    const apiOrigin = new URL(String(config.public.apiUrl || 'https://api.douniamarket.com/api')).origin
    const response = await $fetch<any>(`${aiOrigin}/recommend`, {
      method: 'POST',
      body: {
        viewed_product_ids: [props.product.id],
        viewed_categories: [props.product.categoryHandle || props.product.category_handle || props.product.category],
        limit: 4,
      },
    })

    if (response?.recommendations) {
      recommendations.value = response.recommendations.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        price: normalizePrice(item.price),
        handle: item.slug || item.id.toString(),
        thumbnail: item.thumbnail
          ? (item.thumbnail.startsWith('http')
              ? item.thumbnail
              : `${apiOrigin}${item.thumbnail.startsWith('/') ? '' : '/'}${item.thumbnail}`)
          : '',
        category: item.category || '',
        categoryHandle: item.category_handle || '',
        inStock: normalizeAvailability(item.in_stock),
      }))
    }
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
  }
}

onMounted(() => {
  fetchRecommendations()
})

watch(hasConsent, (accepted) => {
  if (accepted) {
    fetchRecommendations()
    return
  }
  recommendations.value = []
})
</script>
