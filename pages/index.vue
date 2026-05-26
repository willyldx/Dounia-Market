<template>
  <div class="min-h-screen bg-background">
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section class="grid items-stretch gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div class="rounded-lg border border-border bg-card p-6 sm:p-10 lg:p-12">
          <p class="mb-4 inline-flex rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
            Dounia Market | Diaspora tchadienne
          </p>
          <h1 class="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Commandez à distance, votre famille reçoit à N'Djamena.
          </h1>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Choisissez des produits du catalogue local. Dounia Market prépare la commande au Tchad
            et organise la livraison au bénéficiaire selon les zones couvertes.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/catalogue"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Voir les produits
              <ArrowRight class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink
              to="/suivi"
              class="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Suivre une commande
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div
            v-for="(step, index) in serviceSteps"
            :key="step.title"
            class="flex gap-4 rounded-lg border border-border bg-card p-5"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
              <component :is="step.icon" class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Étape {{ index + 1 }}
              </p>
              <h2 class="mt-1 text-base font-semibold text-foreground">{{ step.title }}</h2>
              <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Informations de service">
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <PackageCheck class="h-5 w-5 shrink-0 text-amber-700" />
          <p class="text-sm font-medium text-foreground">Disponibilité locale indiquée par produit</p>
        </div>
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <MapPin class="h-5 w-5 shrink-0 text-amber-700" />
          <p class="text-sm font-medium text-foreground">Livraison locale à N'Djamena selon zone</p>
        </div>
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <ReceiptText class="h-5 w-5 shrink-0 text-slate-700" />
          <p class="text-sm font-medium text-foreground">Zones et frais à confirmer avant ouverture</p>
        </div>
      </section>

      <section class="mt-14 sm:mt-16">
        <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Catalogue local</p>
            <h2 class="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Produits pour vos proches</h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Consultez le prix et l'état de disponibilité avant d'ajouter au panier.
            </p>
          </div>
          <NuxtLink
            to="/catalogue"
            class="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80"
          >
            Tout le catalogue
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <ProductSkeleton v-for="i in 4" :key="i" />
        </div>
        <div v-else-if="featuredProducts.length" class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div v-else class="rounded-lg border border-border bg-card px-6 py-10 text-center">
          <p class="text-sm text-muted-foreground">Le catalogue sera disponible ici prochainement.</p>
          <NuxtLink to="/catalogue" class="mt-4 inline-flex text-sm font-semibold text-brand">
            Ouvrir le catalogue
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, MapPin, PackageCheck, ReceiptText, ShoppingBasket, Truck } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import ProductSkeleton from '~/components/product/ProductSkeleton.vue'

const serviceSteps = [
  {
    icon: ShoppingBasket,
    title: 'Vous choisissez',
    text: 'Depuis l’étranger, sélectionnez les produits utiles à votre proche.',
  },
  {
    icon: PackageCheck,
    title: 'Nous préparons localement',
    text: 'Dounia Market rassemble les articles disponibles sur place.',
  },
  {
    icon: Truck,
    title: 'Votre famille reçoit',
    text: 'La livraison est organisée à N’Djamena dans les zones couvertes.',
  },
]

const featuredProducts = ref<any[]>([])
const loading = ref(true)
const normalizePrice = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) ? value : undefined
)
const normalizeAvailability = (value: unknown): boolean | undefined => (
  value === true ? true : value === false ? false : undefined
)

onMounted(() => {
  fetchFeaturedProducts()
})

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
      price: normalizePrice(p.price),
      thumbnail: p.thumbnail || '',
      images: p.images || [],
      category: p.category || '',
      categoryHandle: p.category_handle || '',
      inStock: normalizeAvailability(p.in_stock),
    }))
  } catch (e) {
    featuredProducts.value = []
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Dounia Market | Produits livrés à vos proches à N’Djamena',
  meta: [
    {
      name: 'description',
      content: 'Commandez à distance des produits disponibles localement pour une livraison à N’Djamena selon les zones couvertes.',
    },
  ],
})
</script>
