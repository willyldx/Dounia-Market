<template>
  <div v-if="recommendations.length > 0" class="mt-16">
    <div class="flex items-center gap-4 mb-8">
      <h2 class="text-2xl lg:text-3xl font-bold font-display text-[var(--color-primary)]">Vous aimerez aussi</h2>
      <div class="h-px bg-gray-200 flex-1"></div>
    </div>
    
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <ProductCard 
        v-for="product in recommendations" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const recommendations = ref<any[]>([])

const fetchRecommendations = async () => {
  try {
    const config = useRuntimeConfig()
    const aiOrigin = String(config.public.aiApiUrl || 'https://ai.douniamarket.com').replace(/\/+$/, '')
    const apiOrigin = new URL(String(config.public.apiUrl || 'https://api.douniamarket.com/api')).origin
    const aiEngineUrl = `${aiOrigin}/recommend`
    
    const response = await $fetch<any>(aiEngineUrl, {
      method: 'POST',
      body: {
        viewed_product_ids: [props.product.id],
        viewed_categories: [props.product.category_handle || props.product.category],
        limit: 4
      }
    })
    
    if (response && response.recommendations) {
      // Map AI recommendations back to expected ProductCard format
      recommendations.value = response.recommendations.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price || 0,
        handle: p.slug || p.id.toString(),
        // Format thumbnail just like we did in Search!
        thumbnail: p.thumbnail ? 
          (p.thumbnail.startsWith('http') ? p.thumbnail : 
          (p.thumbnail.startsWith('/') ? apiOrigin + p.thumbnail : apiOrigin + '/' + p.thumbnail))
          : '',
        category: p.category || '',
        category_handle: p.category_handle || '',
      }))
    }
  } catch (error) {
    console.error('Failed to fetch AI recommendations:', error)
  }
}

onMounted(() => {
  if (props.product) {
    fetchRecommendations()
  }
})
</script>
