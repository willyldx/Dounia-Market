<template>
  <div class="mt-12 bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 ring-1 ring-slate-900/5 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>

    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
      <div>
        <h2 class="text-3xl font-black text-[var(--color-primary)] tracking-tight">Avis Clients certifiés</h2>
        <div class="flex items-center gap-4 mt-3" v-if="totalReviews > 0">
          <div class="flex items-center gap-1 text-amber-400 drop-shadow-sm">
            <template v-for="i in 5" :key="i">
              <Icon :name="i <= Math.round(averageRating) ? 'ph:star-fill' : 'ph:star'" class="w-6 h-6 transition-transform hover:scale-110" />
            </template>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900">{{ averageRating }}</span>
            <span class="text-gray-500 font-medium">/ 5 ({{ totalReviews }} avis)</span>
          </div>
        </div>
        <div v-else class="text-gray-500 font-medium mt-3 flex items-center gap-2">
          <Icon name="ph:star-duotone" class="w-5 h-5 text-amber-400" />
          Aucun avis pour le moment. Soyez le premier !
        </div>
      </div>
      <div>
        <button @click="showReviewModal = true" class="px-6 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold rounded-2xl transition-all shadow-[0_8px_24px_-8px_rgba(245,158,11,0.5)] active:scale-95 flex items-center gap-2 group hover:-translate-y-0.5">
          <Icon name="ph:pencil-simple-line-bold" class="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Laisser un avis
        </button>
      </div>
    </div>

    <div class="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 my-8"></div>

    <!-- Review Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md" @click.self="showReviewModal = false">
          <div class="bg-white rounded-3xl p-8 w-full max-w-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden ring-1 ring-black/5">
            <button @click="showReviewModal = false" class="absolute top-6 right-6 w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition-colors">
              <Icon name="ph:x-bold" class="w-5 h-5" />
            </button>
            
            <div class="text-center mb-8 relative z-10">
              <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-inner">
                <Icon name="ph:star-fill" class="w-8 h-8 text-amber-500" />
              </div>
              <h3 class="text-2xl font-black text-gray-900">Noter ce produit</h3>
              <p class="text-gray-500 font-medium mt-1">Votre avis compte pour la communauté TchadBox.</p>
            </div>
            
            <!-- Stars Selection -->
            <div class="flex items-center justify-center gap-3 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <button v-for="i in 5" :key="i" @click="form.rating = i" @mouseenter="hoverRating = i" @mouseleave="hoverRating = 0" class="focus:outline-none transition-all hover:scale-125 active:scale-95 origin-center">
                <Icon :name="(hoverRating || form.rating) >= i ? 'ph:star-fill' : 'ph:star'" 
                      class="w-12 h-12 transition-colors duration-200"
                      :class="(hoverRating || form.rating) >= i ? 'text-amber-400 drop-shadow-md' : 'text-gray-300'" />
              </button>
            </div>

            <div class="space-y-5 relative z-10">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Votre Prénom <span class="text-gray-400 font-normal ml-1">(facultatif)</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="ph:user-duotone" class="h-5 w-5 text-gray-400" />
                  </div>
                  <input v-model="form.author_name" type="text" class="w-full bg-white border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 font-medium transition-all outline-none shadow-sm" placeholder="Ex: Hassane" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Votre Commentaire <span class="text-gray-400 font-normal ml-1">(facultatif)</span></label>
                <div class="relative">
                  <div class="absolute top-3.5 left-0 pl-4 pointer-events-none">
                    <Icon name="ph:chat-text-duotone" class="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea v-model="form.comment" rows="3" class="w-full bg-white border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 font-medium transition-all outline-none shadow-sm resize-none" placeholder="Racontez votre expérience..."></textarea>
                </div>
              </div>
              <button @click="submitReview" :disabled="form.rating === 0 || isSubmitting" class="w-full mt-4 h-14 bg-[var(--color-primary)] hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-95 text-lg">
                <Icon v-if="isSubmitting" name="ph:spinner-bold" class="w-6 h-6 animate-spin" />
                <template v-else>
                  Valider ma note <Icon name="ph:check-circle-bold" class="w-5 h-5" />
                </template>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Content (Restricted) -->
    <div v-if="totalReviews > 0" class="relative z-10">
      <div v-if="!isAuthenticated" class="mt-8 relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-inner">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md opacity-[0.03] pointer-events-none">
          <Icon name="ph:lock-key-fill" class="w-full h-full" />
        </div>
        
        <div class="relative z-10">
          <div class="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-5 border border-gray-100">
            <Icon name="ph:lock-key-duotone" class="w-8 h-8 text-slate-700" />
          </div>
          <h4 class="text-2xl font-black text-gray-900 mb-3">Commentaires privés</h4>
          <p class="text-gray-600 font-medium mb-8 max-w-md mx-auto leading-relaxed">
            Pour garantir l'authenticité de notre plateforme, seuls nos membres peuvent lire les avis détaillés des autres clients.
          </p>
          <NuxtLink to="/auth/login" class="inline-flex px-8 h-12 items-center bg-white text-gray-900 font-bold border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            Me connecter pour lire
          </NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-6 mt-8">
        <div v-for="(review, index) in reviews" :key="review.id" class="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center">
                <span class="text-amber-700 font-black text-lg">{{ (review.author_name || 'C').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div class="font-bold text-gray-900 flex items-center gap-2">
                  {{ review.author_name || 'Client de TchadBox' }}
                  <Icon name="ph:seal-check-fill" class="w-4 h-4 text-blue-500" />
                </div>
                <div class="text-sm text-gray-400 font-medium mt-0.5">{{ new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
              </div>
            </div>
            <div class="flex gap-0.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Icon v-for="i in 5" :key="i" :name="i <= review.rating ? 'ph:star-fill' : 'ph:star'" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-300'" />
            </div>
          </div>
          <p v-if="review.comment" class="text-gray-600 font-medium leading-relaxed bg-white/50 p-4 rounded-xl border border-gray-100 prose prose-stone max-w-none">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  }
})

const config = useRuntimeConfig()
const authCookie = useCookie('tchadbox_auth_token')

const averageRating = ref(0)
const totalReviews = ref(0)
const isAuthenticated = ref(false)
const reviews = ref<any[]>([])

const showReviewModal = ref(false)
const hoverRating = ref(0)
const isSubmitting = ref(false)

const form = ref({
  rating: 0,
  author_name: '',
  comment: ''
})

const fetchReviews = async () => {
  try {
    const headers: any = {}
    if (authCookie.value) {
      headers.Authorization = `Bearer ${authCookie.value}`
    }

    const { data } = await useFetch<any>(`${config.public.apiUrl}/products/${props.productId}/reviews`, {
      headers,
    })
    
    if (data.value) {
      averageRating.value = data.value.average_rating
      totalReviews.value = data.value.total_reviews
      isAuthenticated.value = data.value.is_authenticated
      reviews.value = data.value.reviews
    }
  } catch (e) {
    console.error('Failed to load reviews', e)
  }
}

const submitReview = async () => {
  if (form.value.rating === 0) return
  isSubmitting.value = true
  
  try {
    const headers: any = { 'Content-Type': 'application/json' }
    if (authCookie.value) {
      headers.Authorization = `Bearer ${authCookie.value}`
    }

    await $fetch(`${config.public.apiUrl}/products/${props.productId}/reviews`, {
      method: 'POST',
      headers,
      body: {
        rating: form.value.rating,
        author_name: form.value.author_name,
        comment: form.value.comment
      }
    })
    
    showReviewModal.value = false
    await fetchReviews()
    form.value.rating = 0
    form.value.comment = ''
  } catch (error) {
    console.error('Error submitting review:', error)
    alert("Une erreur est survenue lors de l'envoi de l'avis.")
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchReviews()
})
</script>
