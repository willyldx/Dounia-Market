<template>
  <section class="rounded-lg border border-border bg-card p-4 sm:p-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-foreground">Avis publiés</h2>
        <div v-if="totalReviews > 0" class="mt-2 flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-0.5 text-amber-500">
            <Star
              v-for="value in 5"
              :key="value"
              class="h-4 w-4"
              :class="value <= Math.round(averageRating) ? 'fill-current' : 'text-slate-300'"
            />
          </div>
          <span class="text-sm font-semibold text-foreground">{{ averageRating }} / 5</span>
          <span class="text-sm text-muted-foreground">({{ totalReviews }} avis)</span>
        </div>
        <p v-else class="mt-2 text-sm text-muted-foreground">Aucun avis publié pour le moment.</p>
      </div>
      <button
        type="button"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        @click="showReviewModal = true"
      >
        <PencilLine class="h-4 w-4" />
        Donner un avis
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showReviewModal"
          class="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/50 p-3 sm:items-center sm:p-4"
          @click.self="showReviewModal = false"
        >
          <div class="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6">
            <button
              type="button"
              aria-label="Fermer"
              class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              @click="showReviewModal = false"
            >
              <X class="h-4 w-4" />
            </button>
            <h3 class="pr-12 text-xl font-bold text-foreground">Noter ce produit</h3>
            <p class="mt-2 text-sm text-muted-foreground">Votre avis aide les clients Dounia Market Tchad.</p>

            <div class="my-6 flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-4">
              <button
                v-for="value in 5"
                :key="value"
                type="button"
                :aria-label="`${value} étoile${value > 1 ? 's' : ''}`"
                class="text-slate-300 transition-colors hover:text-amber-500"
                @click="form.rating = value"
                @mouseenter="hoverRating = value"
                @mouseleave="hoverRating = 0"
              >
                <Star
                  class="h-9 w-9"
                  :class="(hoverRating || form.rating) >= value ? 'fill-current text-amber-500' : ''"
                />
              </button>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-foreground">
                Prénom <span class="font-normal text-muted-foreground">(facultatif)</span>
                <span class="relative mt-2 block">
                  <UserRound class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    v-model="form.author_name"
                    type="text"
                    class="h-11 w-full rounded-md border border-input pl-10 pr-3 text-sm outline-none focus:border-brand"
                    placeholder="Votre prénom"
                  />
                </span>
              </label>
              <label class="block text-sm font-medium text-foreground">
                Commentaire <span class="font-normal text-muted-foreground">(facultatif)</span>
                <span class="relative mt-2 block">
                  <MessageSquare class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    v-model="form.comment"
                    rows="3"
                    class="w-full resize-none rounded-md border border-input py-3 pl-10 pr-3 text-sm outline-none focus:border-brand"
                    placeholder="Votre expérience avec ce produit"
                  ></textarea>
                </span>
              </label>
              <button
                type="button"
                :disabled="form.rating === 0 || isSubmitting"
                class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-50"
                @click="submitReview"
              >
                <LoaderCircle v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                <CheckCircle2 v-else class="h-4 w-4" />
                Publier mon avis
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div v-if="totalReviews > 0" class="mt-6 border-t border-border pt-6">
      <div v-if="!isAuthenticated" class="rounded-lg bg-muted/40 p-6 text-center">
        <LockKeyhole class="mx-auto h-6 w-6 text-muted-foreground" />
        <h3 class="mt-3 text-base font-semibold text-foreground">Commentaires réservés aux clients connectés</h3>
        <p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Connectez-vous pour consulter les commentaires associés à ce produit.
        </p>
        <NuxtLink
          to="/auth/login"
          class="mt-5 inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-foreground"
        >
          Se connecter
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <article v-for="review in reviews" :key="review.id" class="rounded-lg border border-border bg-background p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-foreground">{{ review.author_name || 'Auteur non renseigné' }}</p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
              </p>
            </div>
            <div class="flex items-center gap-0.5 text-amber-500">
              <Star
                v-for="value in 5"
                :key="value"
                class="h-3.5 w-3.5"
                :class="value <= review.rating ? 'fill-current' : 'text-slate-300'"
              />
            </div>
          </div>
          <p v-if="review.comment" class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ review.comment }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle2, LoaderCircle, LockKeyhole, MessageSquare, PencilLine, Star, UserRound, X } from 'lucide-vue-next'

const props = defineProps<{
  productId: number | string
}>()

const config = useRuntimeConfig()
const authCookie = useCookie('dounia_market_auth_token')

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
  comment: '',
})

const fetchReviews = async () => {
  try {
    const headers: Record<string, string> = {}
    if (authCookie.value) headers.Authorization = `Bearer ${authCookie.value}`

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
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authCookie.value) headers.Authorization = `Bearer ${authCookie.value}`

    await $fetch(`${config.public.apiUrl}/products/${props.productId}/reviews`, {
      method: 'POST',
      headers,
      body: {
        rating: form.value.rating,
        author_name: form.value.author_name,
        comment: form.value.comment,
      },
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
