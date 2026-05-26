<template>
  <div class="bg-background">
    <section class="border-b border-border bg-[#f8f5ef]" aria-labelledby="home-title">
      <div class="container-main grid gap-9 py-9 sm:py-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-14">
        <div class="max-w-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Dounia Market Tchad</p>
          <h1 id="home-title" class="mt-4 text-balance text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Des produits locaux pour vos proches à N'Djamena
          </h1>
          <p class="mt-5 max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Depuis l'étranger, parcourez les produits disponibles localement pour préparer ce dont vos proches ont besoin à N'Djamena.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/catalogue"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#c9872b] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#b97824]"
            >
              Consulter le catalogue
              <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
            </NuxtLink>
            <NuxtLink
              to="/suivi"
              class="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:border-[#c9872b]/40 hover:bg-white"
            >
              Suivre une référence
            </NuxtLink>
          </div>
        </div>

        <div class="market-panel overflow-hidden p-2 sm:p-3">
          <div class="relative aspect-[5/4] overflow-hidden rounded-lg bg-brand sm:aspect-[16/11]">
            <NuxtImg
              src="/images/home/hero-marketplace.jpg"
              alt="Produits présentés pour Dounia Market Tchad"
              class="h-full w-full object-cover object-center"
              width="1792"
              height="1024"
              sizes="100vw lg:54vw"
              preload
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#071124]/70 via-transparent to-[#071124]/10"></div>
            <div class="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
              <p class="text-xs font-medium tracking-wide text-white/70">Dounia Market Tchad</p>
              <p class="mt-1 text-lg font-semibold text-white sm:text-xl">Pour vos proches à N'Djamena</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border bg-card" aria-label="Repères du service">
      <div class="container-main grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div class="flex items-center gap-3 py-4 sm:pr-6">
          <Package class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Produits présentés dans le catalogue local</p>
        </div>
        <div class="flex items-center gap-3 py-4 sm:px-6">
          <MapPin class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Service destiné aux proches à N'Djamena</p>
        </div>
        <div class="flex items-center gap-3 py-4 sm:pl-6">
          <PackageCheck class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Suivi accessible avec une référence</p>
        </div>
      </div>
    </section>

    <div class="container-main pb-14 pt-9 sm:pb-16 sm:pt-12">
      <section aria-labelledby="products-title">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
            <h2 id="products-title" class="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Produits publiés</h2>
          </div>
          <NuxtLink to="/catalogue" class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-amber-700">
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
          <button type="button" class="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground" @click="loadCatalogue">
            Réessayer
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
            class="mt-6 inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-[#c9872b]/40"
          >
            Comprendre le service
          </NuxtLink>
        </div>
      </section>

      <section v-if="featuredCategories.length" class="mt-12 sm:mt-14" aria-labelledby="categories-title">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Parcourir</p>
            <h2 id="categories-title" class="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Catégories publiées</h2>
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <NuxtLink
            v-for="category in featuredCategories"
            :key="category.handle"
            :to="`/catalogue?categorie=${category.handle}`"
            class="group relative aspect-[5/3] overflow-hidden rounded-lg bg-brand"
          >
            <NuxtImg
              v-if="category.image"
              :src="category.image"
              :alt="`Sélection de la catégorie ${category.name}`"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              width="640"
              height="420"
            />
            <div v-else class="flex h-full items-center justify-center bg-[#162139]">
              <Package class="h-9 w-9 text-white/45" :stroke-width="1.5" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/20 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white">
              <span class="text-base font-semibold text-white">{{ category.name }}</span>
              <ArrowRight class="h-4 w-4 shrink-0" :stroke-width="1.75" />
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, ArrowRight, MapPin, Package, PackageCheck } from 'lucide-vue-next'
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
