<template>
  <div class="bg-[var(--color-bg)]">
    <section class="relative min-h-[84vh] overflow-hidden">
      <div class="absolute inset-0">
        <div v-for="(slide, i) in heroSlides" :key="`bg-${i}`" class="absolute inset-0">
          <Transition
            enter-active-class="transition-opacity duration-700 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-700 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <NuxtImg
              v-show="currentSlide === i"
              :src="slide.image"
              :alt="slide.titleText"
              class="h-full w-full object-cover"
              :loading="i === 0 ? 'eager' : 'lazy'"
              :preload="i === 0"
              format="webp"
            />
          </Transition>
        </div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(212,135,44,0.15),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(15,23,42,0.45),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.55),rgba(2,6,23,0.65))]"></div>
      </div>

      <div class="container-main relative z-10 flex min-h-[84vh] items-center">
        <div class="max-w-3xl text-white">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] backdrop-blur-md">
            <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Dounia Market — Diaspora
          </p>
          <h1 class="mt-8 text-5xl font-black leading-[1.1] text-white sm:text-6xl md:text-7xl text-premium">
            {{ heroSlides[currentSlide].titleText }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-white/70 md:text-xl font-medium leading-relaxed">
            Commandez les meilleurs produits pour vos proches au Tchad. Livraison sécurisée, suivi en temps réel, qualité garantie par la diaspora.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <NuxtLink 
              to="/catalogue" 
              v-motion
              :hover="{ scale: 1.02, y: -2 }"
              :tap="{ scale: 0.98 }"
              class="inline-flex items-center rounded-2xl bg-[var(--color-accent)] px-8 py-4 text-base font-black text-white shadow-xl transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-[0_20px_50px_rgba(212,135,44,0.3)]"
            >
              Explorer le catalogue
              <ArrowRight class="ml-2 h-5 w-5" />
            </NuxtLink>
            <NuxtLink to="/comment-ca-marche" class="inline-flex items-center rounded-2xl border border-white/30 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10">
              Voir comment ça marche
            </NuxtLink>
          </div>
          <div class="mt-10 flex items-center gap-3">
            <button
              v-for="(slide, i) in heroSlides"
              :key="`dot-${i}`"
              :aria-label="`Aller au slide ${i + 1}`"
              class="h-1.5 rounded-full transition-all duration-500"
              :class="currentSlide === i ? 'w-12 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'"
              @click="goToSlide(i)"
            />
          </div>
        </div>
      </div>
 
      <div class="relative z-10 -mt-20 px-4 pb-12">
        <div class="container-main grid grid-cols-1 gap-6 rounded-[2.5rem] border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl md:grid-cols-3">
          <div v-for="item in highlightStats" :key="item.label" class="flex flex-col rounded-3xl border border-white/50 bg-white/50 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl group">
            <p class="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[var(--color-accent)] transition-colors">{{ item.value }}</p>
            <p class="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">{{ item.label }}</p>
          </div>
        </div>
      </div></div>
    </section>

    <section class="py-20">
      <div class="container-main">
        <div class="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="label">Univers clés</p>
            <h2 class="heading-section mt-2">Trouver rapidement l’essentiel</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="cat in quickCategories"
            :key="cat.title"
            :to="cat.to"
            class="group rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <component :is="cat.icon" class="h-6 w-6 text-[var(--color-accent-dark)]" />
            <h3 class="mt-4 text-lg font-bold text-slate-900">{{ cat.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ cat.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="recommendedProducts.length > 0" class="py-20 bg-white">
      <div class="container-main">
        <div class="mb-10">
          <p class="label">Sélection intelligente</p>
          <h2 class="heading-section mt-2">Recommandé pour vous</h2>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="(product, i) in recommendedProducts" :key="`rec-${product.id}`" :product="product" :delay="i * 100" />
        </div>
      </div>
    </section>

    <section v-if="loading || featuredProducts.length > 0" class="py-20">
      <div class="container-main">
        <div class="mb-10 flex items-center justify-between">
          <h2 class="heading-section">Top tendances</h2>
          <NuxtLink to="/catalogue" class="hidden items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[var(--color-accent-dark)] md:inline-flex">
            Voir tout
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
        <div v-if="loading" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ProductSkeleton v-for="i in 4" :key="`sk-${i}`" />
        </div>
        <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="(product, i) in featuredProducts" :key="product.id" :product="product" :delay="i * 100" />
        </div>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="container-main">
        <div class="mx-auto mb-16 max-w-3xl text-center">
          <p class="label">Processus</p>
          <h2 class="heading-section mt-2">Simple, transparent, rassurant</h2>
          <p class="mt-4 text-[var(--color-text-muted)]">Chaque étape est pensée pour inspirer confiance à la diaspora et à leurs familles.</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div v-for="step in steps" :key="step.title" class="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <component :is="step.icon" class="h-8 w-8 text-[var(--color-accent-dark)]" />
            <h3 class="mt-4 text-lg font-bold text-slate-900">{{ step.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 py-20">
      <div class="container-main overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white md:p-14">
        <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Prêt à commander</p>
            <h2 class="mt-3 text-3xl font-extrabold leading-tight text-white md:text-4xl">Offrez le meilleur à ceux que vous aimez</h2>
            <p class="mt-3 text-white/70">Passez à une logistique moderne, fiable et chaleureuse avec Dounia Market.</p>
          </div>
          <NuxtLink to="/catalogue" class="btn-primary">
            Découvrir le catalogue
            <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Package,
  CreditCard,
  Truck,
  Camera,
  Wheat,
  HeartPulse,
  GraduationCap,
  Hammer,
} from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'

const heroSlides = [
  {
    image: '/hero-bg.png',
    titleText: 'Le meilleur pour votre famille, sans compromis.',
  },
  {
    image: '/hero-slide2.png',
    titleText: 'Transformez chaque commande en moment de joie.',
  },
  {
    image: '/hero-slide3.png',
    titleText: 'Une livraison premium pensée pour la diaspora.',
  },
]

const currentSlide = ref(0)
const slideDuration = 6000
let slideInterval: ReturnType<typeof setInterval> | null = null

const startAutoPlay = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  }, slideDuration)
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  if (slideInterval) clearInterval(slideInterval)
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()
  fetchFeaturedProducts()
  fetchRecommendedProducts()
})
onUnmounted(() => { if (slideInterval) clearInterval(slideInterval) })

const recommendedProducts = ref<any[]>([])

const fetchRecommendedProducts = async () => {
  const { pulseContext } = usePulse()
  const { viewed_ids, viewed_categories } = pulseContext.value

  if (viewed_ids.length > 0 || viewed_categories.length > 0) {
    try {
      const config = useRuntimeConfig()
      const aiResponse = await $fetch<{ recommendations: number[] }>(`${config.public.aiApiUrl}/recommend`, {
        method: 'POST',
        body: {
          viewed_product_ids: viewed_ids,
          viewed_categories: viewed_categories,
          limit: 4
        }
      }).catch(() => null)
      
      let idsToFetch = aiResponse?.recommendations

      if (!idsToFetch || idsToFetch.length === 0) {
        return
      }

      const { getProducts } = useProducts()
      const laravelResponse = await getProducts({ ids: idsToFetch.join(',') })
      
      recommendedProducts.value = laravelResponse.products.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        handle: p.slug,
        subtitle: p.subtitle || '',
        price: p.price || 0,
        thumbnail: p.thumbnail || '',
        category: p.category || '',
        categoryHandle: p.category_handle || '',
        inStock: p.in_stock,
      }))
    } catch (e) {
      console.warn("Recommendation AI non disponible", e)
    }
  }
}

const featuredProducts = ref<any[]>([])
const loading = ref(true)

const fetchFeaturedProducts = async () => {
  loading.value = true
  try {
    const { getProducts } = useProducts()
    const response = await getProducts({ limit: 4 })
    featuredProducts.value = response.products.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.slug,
      subtitle: p.subtitle || '',
      price: p.price || 0,
      thumbnail: p.thumbnail || '',
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: p.in_stock,
    }))
  } catch (e) {
    featuredProducts.value = []
  } finally {
    loading.value = false
  }
}

const highlightStats = [
  { value: '3-5 jours', label: 'Livraison moyenne à N’Djamena' },
  { value: '98%', label: 'Clients satisfaits sur le support' },
  { value: '100%', label: 'Commandes avec suivi transparent' },
]

const quickCategories = [
  { title: 'Alimentaire', description: 'Produits du quotidien et courses familiales.', to: '/catalogue?categorie=alimentaire', icon: Wheat },
  { title: 'Santé', description: 'Soins essentiels pour adultes et enfants.', to: '/catalogue?categorie=sante', icon: HeartPulse },
  { title: 'Scolarité', description: 'Kits, fournitures et besoins académiques.', to: '/catalogue?categorie=scolarite', icon: GraduationCap },
  { title: 'Construction', description: 'Matériaux et équipements BTP.', to: '/catalogue?categorie=btp', icon: Hammer },
]

const steps = [
  { title: 'Découverte', description: 'Parcourez un catalogue structuré par besoins.', icon: Package },
  { title: 'Paiement Sécurisé', description: 'Réglez par Carte ou Mobile Money.', icon: CreditCard },
  { title: 'Logistique locale', description: 'Livraison rapide en 3 à 5 jours.', icon: Truck },
  { title: 'Confirmation', description: 'Preuve photo envoyée après réception.', icon: Camera },
]

useHead({ 
  title: 'Dounia Market — Le marché de la diaspora tchadienne',
  meta: [
    { name: 'description', content: 'Dounia Market, le marché de référence pour la diaspora tchadienne. Envoyez des biens de qualité (alimentaire, santé, scolarité) à vos proches au Tchad avec preuve de livraison.' },
    { property: 'og:title', content: 'Dounia Market — Le marché de la diaspora tchadienne' },
    { property: 'og:description', content: 'Envoyez l\'essentiel à votre famille au Tchad. Livraison rapide, paiement sécurisé et preuve de livraison.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.label {
  @apply text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)];
}
</style>
