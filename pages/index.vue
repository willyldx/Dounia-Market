<template>
  <div class="bg-background">
    <!-- ═══════════════════════════════════════════
         HERO — Clair, chaleureux, éditorial
         ═══════════════════════════════════════════ -->
    <section class="relative overflow-hidden border-b border-border/70" aria-labelledby="home-title">
      <!-- Décor chaleureux (Sahel) -->
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="orb orb-amber absolute -left-24 -top-28 h-72 w-72"></div>
        <div class="orb orb-warm absolute -right-10 top-1/3 h-80 w-80"></div>
      </div>
      <div class="container-main grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <!-- Texte -->
        <div class="max-w-xl">
          <span class="badge badge-gold">
            <Heart class="mr-1.5 h-3.5 w-3.5" :stroke-width="2.25" />
            Pour la diaspora tchadienne
          </span>
          <h1 id="home-title" class="heading-hero mt-5 text-foreground">
            Prendre soin des siens,
            <span class="text-gradient">même de loin</span>
          </h1>
          <p class="mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Depuis l'étranger, choisissez parmi des produits disponibles à N'Djamena.
            Nous les préparons avec soin et les remettons directement à votre famille.
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/catalogue" class="btn-primary">
              <span>
                Parcourir le catalogue
                <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
              </span>
            </NuxtLink>
            <NuxtLink to="/comment-ca-marche" class="btn-outline">
              Comment ça marche
            </NuxtLink>
          </div>

          <div class="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span class="inline-flex items-center gap-2">
              <MapPin class="h-4 w-4 text-gold-700" :stroke-width="1.75" />
              Livré à N'Djamena
            </span>
            <span class="inline-flex items-center gap-2">
              <PackageCheck class="h-4 w-4 text-gold-700" :stroke-width="1.75" />
              Produits d'ici
            </span>
            <span class="inline-flex items-center gap-2">
              <Truck class="h-4 w-4 text-gold-700" :stroke-width="1.75" />
              Suivi de commande
            </span>
          </div>
        </div>

        <!-- Image -->
        <div class="relative">
          <!-- Cadre or décalé -->
          <div class="absolute -right-3 -top-3 hidden h-full w-full rounded-3xl border border-gold-300/70 sm:block" aria-hidden="true"></div>
          <div class="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-xl ring-1 ring-foreground/5 sm:aspect-[16/12]">
            <NuxtImg
              src="/images/home/hero-marketplace.jpg"
              alt="Une sélection de produits préparée par Dounia Market à N'Djamena"
              class="h-full w-full object-cover object-center"
              width="1792"
              height="1024"
              sizes="100vw lg:50vw"
              preload
            />
            <!-- Chip de réassurance flottant -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-card/90 p-3 shadow-premium backdrop-blur-md sm:right-auto sm:max-w-xs">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <PackageCheck class="h-5 w-5" :stroke-width="1.75" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-foreground">Remis à votre famille</p>
                <p class="truncate text-xs text-muted-foreground">Livraison à N'Djamena, zones couvertes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         COMMENT ÇA MARCHE — 3 étapes
         ═══════════════════════════════════════════ -->
    <section class="py-16 sm:py-20" aria-labelledby="howto-title">
      <div class="container-main">
        <div class="mx-auto max-w-2xl text-center">
          <p class="label">En toute simplicité</p>
          <h2 id="howto-title" class="heading-section mt-3">Trois étapes, et c'est réglé</h2>
          <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            Faire plaisir à votre famille au Tchad ne devrait jamais être compliqué. Voilà comment ça se passe.
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          <!-- Étape 1 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: 0 } }"
            class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-premium-lg"
          >
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-gold-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-200">
              <Search class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md">1</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">Choisissez</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Parcourez le catalogue et composez, depuis chez vous, la commande qui leur fera plaisir.
            </p>
          </div>

          <!-- Étape 2 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: 120 } }"
            class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-premium-lg"
          >
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-gold-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-200">
              <ShoppingBag class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md">2</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">Commandez</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Indiquez le bénéficiaire, validez votre panier en quelques minutes. C'est tout.
            </p>
          </div>

          <!-- Étape 3 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: 240 } }"
            class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-200 hover:shadow-premium-lg"
          >
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-gold-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-200">
              <Truck class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md">3</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">On s'occupe du reste</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Nous préparons votre commande et la remettons à votre proche, à N'Djamena.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         PRODUITS — Sélection du catalogue
         ═══════════════════════════════════════════ -->
    <section class="border-y border-border bg-card py-14 sm:py-16" aria-labelledby="products-title">
      <div class="container-main">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="label">Le catalogue</p>
            <h2 id="products-title" class="heading-section mt-2">Une sélection pour eux</h2>
          </div>
          <NuxtLink to="/catalogue" class="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-800">
            Tout voir
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <ProductSkeleton v-for="i in 4" :key="i" />
        </div>

        <div v-else-if="catalogueError" class="market-empty px-5 py-10 text-center sm:px-8 sm:py-12">
          <AlertCircle class="mx-auto h-8 w-8 text-gold-700" :stroke-width="1.75" />
          <h3 class="mt-4 text-xl font-semibold text-foreground">Catalogue momentanément indisponible</h3>
          <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Nous ne pouvons pas charger les produits publiés actuellement. Réessayez dans quelques instants.
          </p>
          <button type="button" class="btn-primary mt-6" @click="loadCatalogue">
            <span>Réessayer</span>
          </button>
        </div>

        <div v-else-if="featuredProducts.length" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>

        <div v-else class="market-empty px-5 py-10 text-center sm:px-8 sm:py-14">
          <Package class="mx-auto h-9 w-9 text-gold-700" :stroke-width="1.5" />
          <h3 class="mt-4 text-xl font-semibold text-foreground">Le catalogue arrive bientôt</h3>
          <p class="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nous préparons une première sélection de produits pour vos proches. Revenez très vite.
          </p>
          <NuxtLink
            to="/comment-ca-marche"
            class="btn-outline mt-6"
          >
            Découvrir Dounia Market
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CATEGORIES — Browse by type
         ═══════════════════════════════════════════ -->
    <section v-if="featuredCategories.length" class="py-14 sm:py-16" aria-labelledby="categories-title">
      <div class="container-main">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="label">Par envie</p>
            <h2 id="categories-title" class="heading-section mt-2">Explorez par catégorie</h2>
          </div>
          <NuxtLink to="/catalogue" class="hidden items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-800 sm:inline-flex">
            Tout voir
            <ChevronRight class="h-4 w-4" :stroke-width="1.75" />
          </NuxtLink>
        </div>
        <div class="grid gap-4 sm:grid-cols-3 sm:gap-5">
          <NuxtLink
            v-for="category in featuredCategories"
            :key="category.handle"
            :to="`/catalogue?categorie=${category.handle}`"
            class="group relative aspect-[5/3] overflow-hidden rounded-2xl shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
          >
            <NuxtImg
              v-if="category.image"
              :src="category.image"
              :alt="`Sélection de la catégorie ${category.name}`"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              width="640"
              height="420"
            />
            <div v-else class="flex h-full items-center justify-center bg-[#15213b]">
              <Package class="h-9 w-9 text-white/45" :stroke-width="1.5" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#15213b]/90 via-[#15213b]/30 to-transparent transition-opacity duration-300 group-hover:from-[#15213b]/95"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-white">
              <span class="text-base font-bold text-white sm:text-lg">{{ category.name }}</span>
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-accent">
                <ArrowRight class="h-4 w-4" :stroke-width="2" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { AlertCircle, ArrowRight, ChevronRight, Heart, MapPin, Package, PackageCheck, Search, ShoppingBag, Truck } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'

const categoryPresentation = [
  {
    handle: 'alimentaire',
    name: 'Épicerie et essentiels',
    image: '/images/home/category-essentiels.jpg',
  },
  {
    handle: 'scolarite',
    name: 'Scolarité',
    image: '/images/home/category-scolarite.jpg',
  },
  {
    handle: 'sante',
    name: 'Bébé et soins',
    image: '/images/home/category-bebe-soins.jpg',
  },
]

const catalogueProducts = ref<any[]>([])
const loading = ref(true)
const catalogueError = ref(false)

const featuredProducts = computed(() => catalogueProducts.value.slice(0, 4))
const featuredCategories = computed(() => {
  const activeHandles = new Set(catalogueProducts.value.map(product => product.categoryHandle).filter(Boolean))
  return categoryPresentation.filter(category => activeHandles.has(category.handle))
})

const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

const loadCatalogue = async () => {
  loading.value = true
  catalogueError.value = false
  try {
    const { getProducts } = useProducts()
    const response = await getProducts({ limit: 100 })
    catalogueProducts.value = response.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.slug,
      subtitle: product.subtitle || '',
      price: normalizePrice(product.price),
      thumbnail: product.thumbnail || '',
      images: product.images || [],
      category: product.category || '',
      categoryHandle: product.category_handle || '',
      inStock: normalizeAvailability(product.in_stock),
    }))
  } catch {
    catalogueProducts.value = []
    catalogueError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(loadCatalogue)

useSeoMeta({
  title: 'Produits pour vos proches à N\'Djamena',
  description: 'Dounia Market Tchad permet à la diaspora tchadienne de consulter des produits disponibles localement pour livraison à N\'Djamena selon les zones couvertes.',
  ogTitle: 'Dounia Market Tchad - Produits pour vos proches à N\'Djamena',
  ogDescription: 'Depuis l\'étranger, consultez des produits disponibles localement pour vos proches à N\'Djamena selon les zones couvertes.',
})
</script>
