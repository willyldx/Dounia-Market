<template>
  <div class="bg-background">
    <!-- ═══════════════════════════════════════════
         HERO — Immersive dark gradient with orbs
         ═══════════════════════════════════════════ -->
    <section class="hero-gradient relative overflow-hidden" aria-labelledby="home-title">
      <!-- Decorative orbs -->
      <div class="orb orb-amber absolute -left-32 -top-32 h-96 w-96 animate-float-slow"></div>
      <div class="orb orb-warm absolute -bottom-20 -right-20 h-80 w-80 animate-float"></div>
      <div class="orb orb-amber absolute right-1/4 top-1/3 h-48 w-48 opacity-[0.06]"></div>

      <div class="container-main relative z-10 grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:py-24">
        <!-- Text content -->
        <div class="max-w-xl">
          <p class="label text-amber-400/90">Dounia Market Tchad</p>
          <h1
            id="home-title"
            class="heading-hero mt-5 text-white"
          >
            Des produits locaux pour vos proches
            <span class="text-gradient-gold">à N'Djamena</span>
          </h1>
          <p class="mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Depuis l'étranger, parcourez les produits disponibles localement pour préparer ce dont vos proches ont besoin à N'Djamena.
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/catalogue" class="btn-primary">
              <span>
                Consulter le catalogue
                <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
              </span>
            </NuxtLink>
            <NuxtLink
              to="/suivi"
              class="btn-outline !border-white/20 !bg-white/5 !text-white hover:!border-white/40 hover:!bg-white/10"
            >
              Suivre une référence
            </NuxtLink>
          </div>
        </div>

        <!-- Hero image -->
        <div class="relative">
          <div class="relative aspect-[5/4] overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 sm:aspect-[16/11]">
            <NuxtImg
              src="/images/home/hero-marketplace.jpg"
              alt="Produits présentés pour Dounia Market Tchad"
              class="h-full w-full object-cover object-center"
              width="1792"
              height="1024"
              sizes="100vw lg:54vw"
              preload
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#071124]/60 via-transparent to-[#071124]/10"></div>
            <div class="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p class="text-xs font-medium tracking-wide text-white/60">Dounia Market Tchad</p>
              <p class="mt-1 text-lg font-semibold text-white sm:text-xl">Pour vos proches à N'Djamena</p>
            </div>
          </div>
          <!-- Glow behind image -->
          <div class="absolute -inset-4 -z-10 rounded-3xl bg-amber-500/10 blur-3xl"></div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         TRUST BAR — Key service highlights
         ═══════════════════════════════════════════ -->
    <section class="relative z-20 -mt-7 sm:-mt-8" aria-label="Repères du service">
      <div class="container-main">
        <div class="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <div class="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-premium">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Package class="h-5 w-5" :stroke-width="1.75" />
            </div>
            <p class="text-sm font-medium text-foreground">Produits présentés dans le catalogue local</p>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-premium">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <MapPin class="h-5 w-5" :stroke-width="1.75" />
            </div>
            <p class="text-sm font-medium text-foreground">Service destiné aux proches à N'Djamena</p>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-premium">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <PackageCheck class="h-5 w-5" :stroke-width="1.75" />
            </div>
            <p class="text-sm font-medium text-foreground">Suivi accessible avec une référence</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         HOW IT WORKS — 3 simple steps
         ═══════════════════════════════════════════ -->
    <section class="py-16 sm:py-20" aria-labelledby="howto-title">
      <div class="container-main">
        <div class="mx-auto max-w-2xl text-center">
          <p class="label">Simple et rapide</p>
          <h2 id="howto-title" class="heading-section mt-3">Comment ça marche</h2>
          <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            En trois étapes simples, envoyez des produits de qualité à vos proches au Tchad.
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          <!-- Step 1 -->
          <div class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-premium-lg">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-200">
              <Search class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#c9872b] text-xs font-bold text-white shadow-md">1</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">Parcourez le catalogue</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Explorez les produits disponibles localement à N'Djamena depuis votre pays.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-premium-lg">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-200">
              <ShoppingBag class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#c9872b] text-xs font-bold text-white shadow-md">2</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">Passez commande</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Ajoutez au panier, choisissez les options et validez en toute sécurité.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="group relative rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-premium-lg">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-200">
              <Truck class="h-6 w-6" :stroke-width="1.75" />
            </div>
            <div class="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#c9872b] text-xs font-bold text-white shadow-md">3</div>
            <h3 class="mt-5 text-lg font-bold text-foreground">Livraison avec preuve</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Votre commande est livrée à vos proches avec confirmation photo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         PRODUCTS — Featured catalogue items
         ═══════════════════════════════════════════ -->
    <section class="border-y border-border bg-[#faf8f5] py-14 sm:py-16" aria-labelledby="products-title">
      <div class="container-main">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="label">Catalogue local</p>
            <h2 id="products-title" class="heading-section mt-2">Produits publiés</h2>
          </div>
          <NuxtLink to="/catalogue" class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c9872b] transition-colors hover:text-amber-700">
            Tout voir
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <ProductSkeleton v-for="i in 4" :key="i" />
        </div>

        <div v-else-if="catalogueError" class="market-empty px-5 py-10 text-center sm:px-8 sm:py-12">
          <AlertCircle class="mx-auto h-8 w-8 text-amber-700" :stroke-width="1.75" />
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
          <Package class="mx-auto h-9 w-9 text-amber-700" :stroke-width="1.5" />
          <h3 class="mt-4 text-xl font-semibold text-foreground">Aucun produit publié actuellement</h3>
          <p class="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Les produits disponibles à la consultation apparaîtront ici dès leur publication.
          </p>
          <NuxtLink
            to="/comment-ca-marche"
            class="btn-outline mt-6"
          >
            Comprendre le service
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
            <p class="label">Parcourir</p>
            <h2 id="categories-title" class="heading-section mt-2">Catégories publiées</h2>
          </div>
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
            <div v-else class="flex h-full items-center justify-center bg-[#162139]">
              <Package class="h-9 w-9 text-white/45" :stroke-width="1.5" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/30 to-transparent transition-opacity duration-300 group-hover:from-[#0f172a]/95"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-white">
              <span class="text-base font-bold text-white sm:text-lg">{{ category.name }}</span>
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#c9872b]">
                <ArrowRight class="h-4 w-4" :stroke-width="2" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CTA BANNER — Drive action
         ═══════════════════════════════════════════ -->
    <section class="hero-gradient relative overflow-hidden" aria-label="Appel à l'action">
      <div class="orb orb-amber absolute -right-24 -top-24 h-64 w-64"></div>
      <div class="orb orb-warm absolute -bottom-16 -left-16 h-52 w-52"></div>

      <div class="container-main relative z-10 py-16 text-center sm:py-20">
        <h2 class="heading-section mx-auto max-w-xl text-white">
          Prêt à envoyer des produits à vos proches ?
        </h2>
        <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
          Consultez notre catalogue et composez votre première commande en quelques minutes.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink to="/catalogue" class="btn-primary">
            <span>
              Voir le catalogue
              <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
            </span>
          </NuxtLink>
          <NuxtLink to="/comment-ca-marche" class="btn-outline !border-white/20 !bg-white/5 !text-white hover:!border-white/40 hover:!bg-white/10">
            En savoir plus
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, ArrowRight, MapPin, Package, PackageCheck, Search, ShoppingBag, Truck } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'

const categoryAssets: Record<string, string> = {
  alimentaire: '/images/home/category-essentiels.jpg',
  scolarite: '/images/home/category-scolarite.jpg',
  sante: '/images/home/category-bebe-soins.jpg',
}

const catalogueProducts = ref<any[]>([])
const loading = ref(true)
const catalogueError = ref(false)

const featuredProducts = computed(() => catalogueProducts.value.slice(0, 4))
const featuredCategories = computed(() => {
  const seen = new Set<string>()
  return catalogueProducts.value.reduce<Array<{ handle: string; name: string; image: string }>>((categories, product) => {
    const handle = product.categoryHandle
    if (!handle || seen.has(handle)) return categories
    seen.add(handle)
    categories.push({
      handle,
      name: product.category || handle.replace(/-/g, ' '),
      image: categoryAssets[handle] || '',
    })
    return categories
  }, []).slice(0, 3)
})

const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

async function loadCatalogue() {
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
