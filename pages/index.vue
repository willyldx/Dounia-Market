<template>
  <div class="bg-background">
    <section class="relative isolate h-[clamp(430px,62svh,620px)] overflow-hidden sm:h-[clamp(470px,64svh,640px)]">
      <NuxtImg
        src="/images/home/hero-marketplace.jpg"
        alt=""
        class="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        width="1792"
        height="1024"
        sizes="100vw"
        preload
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#071124]/95 via-[#071124]/80 to-[#071124]/10"></div>
      <div class="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-xl text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Le marché de la diaspora tchadienne
          </p>
          <h1 class="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Dounia Market
          </h1>
          <p class="mt-5 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
            Commandez depuis l'étranger. Vos proches reçoivent localement à N'Djamena.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/catalogue"
              class="inline-flex h-12 items-center justify-center rounded-md bg-[#c9872b] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#b97824]"
            >
              Voir le catalogue
            </NuxtLink>
            <NuxtLink
              to="/suivi"
              class="inline-flex h-12 items-center justify-center rounded-md border border-white/50 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Suivre une commande
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border bg-card" aria-label="Service Dounia Market">
      <div class="mx-auto grid max-w-7xl gap-0 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 border-b border-border py-4 sm:border-b-0 sm:border-r sm:pr-6">
          <MapPin class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Livraison locale à N'Djamena selon zones couvertes</p>
        </div>
        <div class="flex items-center gap-3 border-b border-border py-4 sm:border-b-0 sm:px-6">
          <PackageCheck class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Produits sélectionnés dans le catalogue local</p>
        </div>
        <div class="flex items-center gap-3 py-4 sm:border-l sm:pl-6">
          <Truck class="h-5 w-5 shrink-0 text-amber-700" :stroke-width="1.75" />
          <p class="text-sm text-foreground">Suivi de commande avec votre référence</p>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 pb-14 pt-9 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <section v-if="featuredCategories.length" aria-labelledby="categories-title">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Parcourir</p>
            <h2 id="categories-title" class="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Catégories</h2>
          </div>
          <NuxtLink to="/catalogue" class="hidden items-center gap-1.5 text-sm font-semibold text-brand hover:text-amber-700 sm:inline-flex">
            Tout voir
            <ChevronRight class="h-4 w-4" :stroke-width="1.75" />
          </NuxtLink>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <NuxtLink
            v-for="category in featuredCategories"
            :key="category.handle"
            :to="`/catalogue?categorie=${category.handle}`"
            class="group relative aspect-[5/3] overflow-hidden rounded-lg bg-brand"
          >
            <NuxtImg
              :src="category.image"
              :alt="category.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              width="640"
              height="420"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/15 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white">
              <span class="text-base font-semibold">{{ category.name }}</span>
              <ChevronRight class="h-4 w-4 shrink-0" :stroke-width="1.75" />
            </div>
          </NuxtLink>
        </div>
      </section>

      <section :class="featuredCategories.length ? 'mt-12 sm:mt-14' : ''" aria-labelledby="products-title">
        <div class="mb-6 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
            <h2 id="products-title" class="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Produits disponibles</h2>
          </div>
          <NuxtLink to="/catalogue" class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-amber-700">
            Catalogue
            <ChevronRight class="h-4 w-4" :stroke-width="1.75" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <ProductSkeleton v-for="i in 4" :key="i" />
        </div>
        <div v-else-if="featuredProducts.length" class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
        <div v-else class="border-t border-border py-9 text-center sm:py-12">
          <p class="text-sm text-muted-foreground">Aucun produit n'est affiché pour le moment.</p>
          <NuxtLink
            to="/catalogue"
            class="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Consulter le catalogue
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, MapPin, PackageCheck, Truck } from 'lucide-vue-next'
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

onMounted(async () => {
  loading.value = true
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
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Dounia Market | Livraison locale à N\'Djamena',
  meta: [
    {
      name: 'description',
      content: 'Commandez depuis l\'étranger. Vos proches reçoivent localement à N\'Djamena selon les zones couvertes.',
    },
  ],
})
</script>
