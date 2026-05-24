<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div class="aspect-square bg-gray-200 rounded-2xl"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 reveal-up">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8 text-muted-foreground font-medium">
        <NuxtLink to="/" class="hover:text-accent transition-colors">Accueil</NuxtLink>
        <ChevronRightIcon class="w-4 h-4 opacity-50" />
        <NuxtLink to="/catalogue" class="hover:text-accent transition-colors">Catalogue</NuxtLink>
        <ChevronRightIcon class="w-4 h-4 opacity-50" />
        <NuxtLink 
          :to="`/catalogue?categorie=${product.categoryHandle}`" 
          class="hover:text-accent transition-colors"
        >
          {{ product.category }}
        </NuxtLink>
        <ChevronRightIcon class="w-4 h-4 opacity-50" />
        <span class="text-foreground font-bold truncate max-w-[200px] sm:max-w-none">{{ product.title }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-6">
          <!-- Main Image -->
          <div class="relative aspect-[4/3] sm:aspect-square bg-muted rounded-[2rem] overflow-hidden group border border-border">
            <img
              :src="selectedImage || product.thumbnail"
              :alt="product.title"
              class="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
            />
            
            <!-- Favorite Button -->
            <button
              @click="toggleFavorite"
              class="absolute top-6 right-6 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all border border-border"
            >
              <HeartIcon 
                class="w-4 h-4 transition-colors" 
                :class="isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'"
              />
            </button>

            <!-- Zoom Button -->
            <button
              @click="showZoom = true"
              class="absolute bottom-6 right-6 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-all border border-border"
            >
              <ZoomInIcon class="w-4 h-4 text-muted-foreground" />
            </button>

            <!-- Badges -->
            <div class="absolute top-6 left-6 flex flex-col gap-2">
              <span v-if="product.compareAtPrice" class="bg-destructive text-destructive-foreground text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm tracking-wider">
                -{{ discountPercent }}%
              </span>
              <span v-if="!product.inStock" class="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm tracking-wider uppercase">
                Rupture
              </span>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images?.length > 1" class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              class="w-24 h-24 sm:w-28 sm:h-28 bg-muted/50 rounded-xl border-2 overflow-hidden shrink-0 transition-all snap-start"
              :class="selectedImage === image ? 'border-primary shadow-sm scale-105' : 'border-transparent hover:border-border'"
            >
              <img :src="image" :alt="`Vue ${index + 1}`" class="w-full h-full object-contain p-3 mix-blend-multiply" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <div class="space-y-8 flex-grow">
            <!-- Header (Category & Reviews) -->
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  {{ product.category }}
                </span>
                <span v-if="product.inStock" class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En stock
                </span>
              </div>
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-3">
              <h1 class="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">{{ product.title }}</h1>
              <p v-if="product.subtitle" class="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">{{ product.subtitle }}</p>
            </div>

            <!-- Price Block -->
            <div class="p-6 bg-card rounded-xl border border-border shadow-sm">
              <div class="flex flex-col gap-1">
                <div class="flex items-baseline gap-4">
                  <span class="text-4xl sm:text-5xl font-black text-foreground tracking-tighter">{{ cartStore.formatPrice(currentPrice) }}</span>
                  <span v-if="product.compareAtPrice && !selectedVariant" class="text-2xl text-gray-400 font-bold line-through decoration-2">
                    {{ cartStore.formatPrice(product.compareAtPrice) }}
                  </span>
                </div>
                <p v-if="cartStore.currency !== 'XAF'" class="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2 flex items-center gap-2">
                  <span class="w-4 border-t-2 border-gray-300"></span>
                  Soit environ {{ formatFCFA(currentPrice) }}
                </p>
              </div>
            </div>

            <!-- Variants Selector -->
            <div v-if="product.variants && product.variants.length > 0" class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-900 uppercase tracking-wider">Variantes disponibles</span>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  @click="selectedVariant = variant"
                  class="px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                  :class="selectedVariant?.id === variant.id 
                    ? 'border-primary text-primary bg-primary/5 shadow-sm' 
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted'"
                >
                  {{ variant.title }}
                </button>
              </div>
            </div>

            <!-- Short Description -->
            <div v-if="product.description" class="prose prose-stone max-w-none prose-p:leading-relaxed prose-p:text-gray-600 prose-p:font-medium">
              <p class="line-clamp-3">{{ product.description }}</p>
              <button @click="activeTab = 'description'" class="text-brand font-bold text-sm mt-2 hover:underline">Lire la suite</button>
            </div>

            <!-- Action Block (Hidden on Mobile) -->
            <div class="hidden sm:block space-y-6 pt-6 border-t border-gray-100">
              <div class="flex flex-wrap lg:flex-nowrap items-center gap-4">
                <!-- Quantity Pill -->
                <div class="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-200 shadow-sm">
                  <button
                    @click="quantity > 1 && quantity--"
                    :disabled="quantity <= 1"
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:text-[var(--color-primary)] hover:bg-gray-50 disabled:opacity-50 disabled:shadow-none transition-all border border-gray-100"
                  >
                    <MinusIcon class="w-5 h-5" />
                  </button>
                  <span class="w-16 text-center font-black text-xl text-[var(--color-primary)]">{{ quantity }}</span>
                  <button
                    @click="quantity++"
                    :disabled="quantity >= 10"
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:text-[var(--color-primary)] hover:bg-gray-50 disabled:opacity-50 disabled:shadow-none transition-all border border-gray-100"
                  >
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Primary CTA -->
                <button
                  @click="addToCart"
                  :disabled="!product.inStock || isAddingToCart"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-14 flex-1 text-base sm:text-lg px-8 relative overflow-hidden"
                >
                  <LoaderIcon v-if="isAddingToCart" class="w-5 h-5 animate-spin mr-2" />
                  <template v-else>
                    <ShoppingCartIcon class="w-5 h-5 mr-2" />
                    Ajouter au panier
                  </template>
                </button>
              </div>

              <!-- Secondary CTA -->
              <button
                @click="buyNow"
                :disabled="!product.inStock"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-14 w-full text-base sm:text-lg mt-4"
              >
                Acheter instantanément
              </button>

              <!-- Share Button -->
              <button
                @click="generateShareLink"
                :disabled="isGeneratingLink"
                class="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:border-gray-400 hover:text-gray-900 transition-all text-sm disabled:opacity-60"
              >
                <Share2Icon class="w-4 h-4" />
                <span v-if="isGeneratingLink">Génération du lien...</span>
                <span v-else-if="linkCopied" class="text-emerald-600 font-bold flex items-center gap-2">
                  <CheckIcon class="w-4 h-4" /> Lien copié !
                </span>
                <span v-else>Partager ce produit</span>
              </button>
            </div>

            <!-- Mobile Action Spacer -->
            <div class="sm:hidden h-24"></div>

            <!-- Trust Badges Block -->
            <div class="bg-card rounded-xl p-6 border border-border shadow-sm mt-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-0 md:pr-4">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-shrink-0 items-center justify-center">
                    <TruckIcon class="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">Livraison Garantie</h4>
                    <p class="text-xs font-medium text-gray-500 mt-0.5">N'Djamena s/ 3-5j</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-0 md:pr-4">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-shrink-0 items-center justify-center">
                    <ShieldCheckIcon class="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">Paiement Sécurisé</h4>
                    <p class="text-xs font-medium text-gray-500 mt-0.5">Virement / CB</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-shrink-0 items-center justify-center">
                    <PackageIcon class="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">Preuve Photo</h4>
                    <p class="text-xs font-medium text-gray-500 mt-0.5">À la remise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="mt-20">
        <div class="relative flex justify-start sm:justify-start">
          <nav class="inline-flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200/60 rounded-2xl shadow-inner overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative px-6 py-3 font-bold text-sm sm:text-base transition-all whitespace-nowrap rounded-xl"
              :class="activeTab === tab.id 
                ? 'bg-card text-foreground shadow-sm border border-border' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="py-10 max-w-4xl">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Main description -->
            <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium mb-12 max-w-3xl">
              {{ product.description }}
            </p>

            <!-- Premium Features Grid -->
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">L'Engagement Dounia Market</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-white rounded-2xl border-2 border-gray-50 hover:border-gray-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                <Icon name="ph:star-four-duotone" class="w-8 h-8 text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform" />
                <h4 class="text-base font-bold text-gray-900 mb-2">Sélection Premium</h4>
                <p class="text-sm text-gray-500 font-medium leading-relaxed">Sourcé avec rigueur pour certifier une qualité absolue jusqu'à N'Djamena.</p>
              </div>
              <div class="p-6 bg-white rounded-2xl border-2 border-gray-50 hover:border-gray-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                <Icon name="ph:shield-check-duotone" class="w-8 h-8 text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform" />
                <h4 class="text-base font-bold text-gray-900 mb-2">Emballage Blindé</h4>
                <p class="text-sm text-gray-500 font-medium leading-relaxed">Protégé sur-mesure pour résister parfaitement au transport international.</p>
              </div>
              <div class="p-6 bg-white rounded-2xl border-2 border-gray-50 hover:border-gray-200 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                <Icon name="ph:bank-duotone" class="w-8 h-8 text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform" />
                <h4 class="text-base font-bold text-gray-900 mb-2">Zéro Surprise</h4>
                <p class="text-sm text-gray-500 font-medium leading-relaxed">Prix net : logistique et douanes incluses. Votre proche ne paie rien à la réception.</p>
              </div>
            </div>
          </div>

          <!-- Shipping Tab -->
          <div v-else-if="activeTab === 'shipping'" class="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h3 class="text-2xl font-black text-[var(--color-primary)] mb-10">Logistique & Délais d'Acheminement</h3>
            
            <div class="relative pl-8 space-y-10 before:absolute before:inset-y-0 before:left-[11px] before:w-[3px] before:bg-gray-100">
              <div class="relative">
                <div class="absolute -left-[41px] bg-white p-1.5 rounded-full border-2 border-gray-100">
                  <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <h4 class="text-xl font-bold text-gray-900 mb-2">Préparation Express</h4>
                <p class="text-gray-500 font-medium leading-relaxed">La commande est vérifiée, soigneusement emballée et préparée pour expédition aérienne sous 24h ouvrées.</p>
              </div>

              <div class="relative">
                <div class="absolute -left-[41px] bg-white p-1 rounded-full border-2 border-[var(--color-accent)] shadow-sm">
                  <div class="w-4 h-4 bg-[var(--color-accent)] rounded-full animate-pulse"></div>
                </div>
                <h4 class="text-xl font-bold text-[var(--color-primary)] mb-2 flex items-center gap-3">
                  N'Djamena (3 à 5 Jours)
                  <span class="text-[10px] font-black bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2.5 py-1 rounded-md uppercase tracking-widest">Gratuit dès 150€</span>
                </h4>
                <p class="text-gray-500 font-medium leading-relaxed">Le produit atterrit au Tchad. Il passe rapidement la douane via notre réseau sans aucun frais supplémentaire pour le destinaire.</p>
              </div>

              <div class="relative">
                <div class="absolute -left-[41px] bg-white p-1.5 rounded-full border-2 border-gray-100">
                   <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <h4 class="text-xl font-bold text-gray-900 mb-2">Remise en main propre</h4>
                <p class="text-gray-500 font-medium leading-relaxed">Notre livreur contacte le proche, se déplace à domicile et réalise une photographie de la remise disponible directement sur ton espace client.</p>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-else-if="activeTab === 'reviews'">
            <ProductReviews :productId="product.id" />
          </div>
        </div>
      </div>
      
      <!-- UNIVERSAL STICKY BOTTOM BAR -->
      <div 
        v-if="product" 
        class="fixed left-0 w-full bg-background/90 backdrop-blur-md border-t border-border p-4 shadow-sm z-50 pb-safe transition-transform duration-500 ease-out"
        :class="[
          'bottom-[4rem] lg:bottom-0',
          isScrolledPastCTA ? 'translate-y-0' : 'translate-y-[150%]'
        ]"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col">
            <span class="text-2xl font-black text-foreground leading-none">{{ cartStore.formatPrice(currentPrice) }}</span>
            <span v-if="cartStore.currency !== 'XAF'" class="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">
              ≈ {{ formatFCFA(currentPrice) }}
            </span>
          </div>
          <button
            @click="addToCart"
            :disabled="!product.inStock || isAddingToCart"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 flex-shrink-0"
          >
            <LoaderIcon v-if="isAddingToCart" class="w-4 h-4 animate-spin mr-2" />
            <template v-else>
              <ShoppingCartIcon class="w-4 h-4 mr-2" />
              Ajouter
            </template>
          </button>
        </div>
      </div>

      <!-- Related Products / Recommendations via AI -->
      <ProductRecommendations :product="product" />
    </div>

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <PackageIcon class="w-10 h-10 text-[var(--color-text-muted)]" />
      </div>
      <h2 class="text-xl font-semibold text-[var(--color-text)] mb-2">Produit introuvable</h2>
      <p class="text-[var(--color-text-muted)] mb-6">Ce produit n'existe pas ou a été supprimé.</p>
      <NuxtLink
        to="/catalogue"
        class="px-8 py-4 bg-gray-900 border border-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-md mt-6"
      >
        Voir le catalogue
      </NuxtLink>
    </div>

    <!-- Image Zoom Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showZoom" 
          @click="showZoom = false"
          class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button 
            @click="showZoom = false"
            class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <XIcon class="w-6 h-6 text-white" />
          </button>
          <img
            :src="selectedImage || product?.thumbnail"
            :alt="product?.title"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRight as ChevronRightIcon,
  Heart as HeartIcon,
  ZoomIn as ZoomInIcon,
  Check as CheckIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  ShoppingCart as ShoppingCartIcon,
  Loader as LoaderIcon,
  Truck as TruckIcon,
  ShieldCheck as ShieldCheckIcon,
  Package as PackageIcon,
  Star as StarIcon,
  X as XIcon,
  Share2 as Share2Icon,
} from 'lucide-vue-next'
import type { Product, ProductVariant } from '~/types'

const route = useRoute()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

// State
const product = ref<Product | null>(null)
const selectedVariant = ref<ProductVariant | null>(null)
const relatedProducts = ref<Product[]>([])
const isLoading = ref(true)
const isAddingToCart = ref(false)
const selectedImage = ref<string | null>(null)
const quantity = ref(1)
const activeTab = ref('description')
const showZoom = ref(false)
const isScrolledPastCTA = ref(false)
const isGeneratingLink = ref(false)
const linkCopied = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  // If we scroll down 500px, show the sticky bar
  isScrolledPastCTA.value = window.scrollY > 400
}

// Tabs
const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'shipping', label: 'Livraison' },
  { id: 'reviews', label: 'Avis (0)' },
]

// Computed
const isFavorite = computed(() => {
  return product.value ? favoritesStore.isFavorite(product.value.id) : false
})

const currentPrice = computed(() => {
  if (selectedVariant.value) return selectedVariant.value.price
  return product.value?.price || 0
})

const discountPercent = computed(() => {
  if (!product.value?.compareAtPrice) return 0
  return Math.round((1 - product.value.price / product.value.compareAtPrice) * 100)
})

// SEO
useSeoMeta({
  title: () => product.value ? `${product.value.title} - Dounia Market` : 'Produit - Dounia Market',
  description: () => product.value?.description || 'Découvrez ce produit sur Dounia Market',
})

// Fetch product
const { trackProductView } = usePulse()

onMounted(async () => {
  await fetchProduct()
})

async function fetchProduct() {
  const slug = route.params.slug as string
  const { getProduct, getProducts } = useProducts()
  
  try {
    // Fetch product from Laravel API by slug
    const response = await getProduct(slug)
    const p = response.product

    if (!p) {
      isLoading.value = false
      return
    }

    product.value = {
      id: p.id.toString(),
      title: p.title,
      handle: p.slug,
      description: p.description || '',
      subtitle: p.subtitle || '',
      price: p.price || 0,
      compareAtPrice: undefined,
      images: p.images || [],
      thumbnail: p.thumbnail || (p.images?.[0] ?? ''),
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: p.in_stock ?? true,
      stockQuantity: p.stock_quantity,
      variants: p.variants ? p.variants.map((v: any) => ({
        id: v.id.toString(),
        title: v.title || v.name,
        price: v.price || p.price,
        inventory_quantity: v.inventory_quantity || 0
      })) : [],
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }

    if (product.value.variants && product.value.variants.length > 0) {
      selectedVariant.value = product.value.variants[0]
    }
    
    // Fetch related products from same category
    if (p.category_handle) {
      try {
        const relatedResponse = await getProducts({ category: p.category_handle, limit: 4 })
        relatedProducts.value = relatedResponse.products
          .filter((rp: any) => rp.id !== p.id)
          .slice(0, 4)
          .map((rp: any) => ({
            id: rp.id.toString(),
            title: rp.title,
            handle: rp.slug,
            price: rp.price || 0,
            thumbnail: rp.thumbnail || (rp.images?.[0] ?? ''),
            category: rp.category || '',
            categoryHandle: rp.category_handle || '',
            images: rp.images || [],
            inStock: rp.in_stock ?? true,
            createdAt: rp.created_at,
            updatedAt: rp.updated_at,
          }))
      } catch (e) {
        // Related products non-critiques
        relatedProducts.value = []
      }
    }
  } catch (e) {
    console.error('Failed to fetch product:', e)
  }
  
  if (product.value) {
    trackProductView(parseInt(product.value.id), product.value.category)
  }

  isLoading.value = false
}

function formatFCFA(amount: number): string {
  const fcfa = Math.round(amount * 656)
  return new Intl.NumberFormat('fr-FR').format(fcfa) + ' FCFA'
}

function toggleFavorite() {
  if (!product.value) return
  favoritesStore.toggleFavorite(product.value)
}

async function addToCart() {
  if (!product.value || !product.value.inStock) return
  
  isAddingToCart.value = true
  
  cartStore.addItem({
    productId: product.value.id,
    variantId: selectedVariant.value?.id,
    variantTitle: selectedVariant.value?.title,
    title: product.value.title,
    price: currentPrice.value,
    thumbnail: product.value.thumbnail,
    category: product.value.category,
  }, quantity.value)
  
  isAddingToCart.value = false
}

function buyNow() {
  addToCart()
  navigateTo('/checkout')
}

async function generateShareLink() {
  if (!product.value || isGeneratingLink.value) return

  isGeneratingLink.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl

    const response = await $fetch<{ short_url: string }>(`${apiBase}/links`, {
      method: 'POST',
      body: { product_id: parseInt(product.value.id) },
    })

    // Copie dans le presse-papier
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(response.short_url)
    } else {
      const el = document.createElement('textarea')
      el.value = response.short_url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }

    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 3000)
  } catch (e) {
    console.error('Erreur lors de la génération du lien court:', e)
  } finally {
    isGeneratingLink.value = false
  }
}
</script>
