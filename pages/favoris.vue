<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">Favoris</span>
      </nav>
      
      <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 reveal-up">
        <div>
          <h1 class="heading-section flex items-center gap-4">
            Vos Coups de Cœur
            <span v-if="!favoritesStore.isEmpty" class="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-amber-100 px-3 text-sm font-bold text-amber-700">
              {{ favoritesStore.count }}
            </span>
          </h1>
          <p v-if="!favoritesStore.isEmpty" class="mt-3 text-sm font-medium text-muted-foreground">
            Les produits que vous avez sélectionnés pour vos proches.
          </p>
        </div>

        <div v-if="!favoritesStore.isEmpty" class="flex flex-wrap gap-3">
          <button
            @click="showClearConfirm = true"
            class="btn-ghost !border !border-border bg-card text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 class="h-4 w-4 mr-2" /> Vider la liste
          </button>
          <button
            @click="moveAllToCart"
            class="btn-primary"
          >
            <span>
              <ShoppingBag class="h-4 w-4" /> Tout ajouter au panier
            </span>
          </button>
        </div>
      </div>

      <!-- État Vide -->
      <div v-if="favoritesStore.isEmpty" class="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-center shadow-sm sm:mt-12">
        <div class="hero-gradient px-6 py-12 sm:px-12 sm:py-16 relative">
          <div class="orb orb-amber absolute -right-10 -top-10 h-40 w-40 opacity-20"></div>
          <div class="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-xl">
            <Heart class="h-10 w-10" :stroke-width="1.5" />
          </div>
          <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl">Votre sélection est vide</h2>
          <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
            Enregistrez ici les produits qui vous font de l'œil pour vos proches à N'Djamena. Cliquez sur le petit cœur sur n'importe quel produit pour le sauvegarder !
          </p>
          <NuxtLink to="/catalogue" class="btn-primary mt-8">
            <span>
              Explorer le catalogue
              <Sparkles class="h-4 w-4" :stroke-width="2" />
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Grille des Favoris -->
      <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 sm:gap-6 lg:gap-8 stagger active">
        <div
          v-for="item in favoritesStore.items"
          :key="item.productId"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-premium"
        >
          <!-- Image -->
          <NuxtLink :to="`/produit/${item.productId}`" class="relative block aspect-[4/5] bg-[#f8f5ef] overflow-hidden p-4">
            <img
              v-if="item.thumbnail"
              :src="item.thumbnail"
              :alt="item.title"
              class="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <Package class="h-12 w-12 text-muted-foreground/30" />
            </div>

            <!-- Bouton Supprimer -->
            <button
              @click.prevent="removeFromFavorites(item.productId)"
              class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-amber-600 shadow-sm transition-all hover:scale-110 hover:bg-red-500 hover:text-white"
              aria-label="Retirer des favoris"
            >
              <Heart class="h-4 w-4 fill-current" :stroke-width="2" />
            </button>
            
            <div class="absolute inset-x-0 bottom-0 flex p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/40 to-transparent">
               <span v-if="item.category" class="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-md">
                 {{ item.category }}
               </span>
            </div>
          </NuxtLink>

          <!-- Infos Produit -->
          <div class="flex flex-1 flex-col p-4 sm:p-5">
            <NuxtLink :to="`/produit/${item.productId}`">
              <h3 class="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-amber-700 sm:text-base">
                {{ item.title }}
              </h3>
            </NuxtLink>
            
            <div class="mt-auto pt-4 flex items-end justify-between gap-2">
              <div>
                 <p class="text-lg font-black tracking-tight text-foreground sm:text-xl">{{ formatPrice(item.price) }}</p>
              </div>
              <button
                @click="addToCart(item)"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shadow-sm transition-all hover:bg-[#c9872b] hover:text-white"
                aria-label="Ajouter au panier"
              >
                <ShoppingBag class="h-4 w-4" :stroke-width="2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Synchronisation (Connecté) -->
      <div v-if="authStore.isAuthenticated && !favoritesStore.isEmpty" class="mt-12 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:items-center">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200/50 text-amber-700">
          <Cloud class="h-5 w-5" />
        </div>
        <div>
          <p class="text-sm font-bold text-foreground">Sauvegarde automatique activée</p>
          <p class="mt-1 text-sm font-medium text-muted-foreground">Vos favoris sont liés à votre compte et resteront accessibles depuis n'importe quel appareil.</p>
        </div>
      </div>

      <!-- Synchronisation (Invité) -->
      <div v-if="!authStore.isAuthenticated && !favoritesStore.isEmpty" class="mt-12 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-4">
           <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
             <User class="h-5 w-5" />
           </div>
           <div>
             <p class="text-sm font-bold text-foreground">Ne perdez pas votre sélection</p>
             <p class="mt-1 text-sm font-medium text-muted-foreground">
               Connectez-vous à votre compte pour sauvegarder vos favoris et y accéder sur votre téléphone ou votre ordinateur.
             </p>
           </div>
        </div>
        <NuxtLink to="/auth/login?redirect=/favoris" class="btn-outline whitespace-nowrap">
          Créer un compte ou s'identifier
        </NuxtLink>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showClearConfirm" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div class="relative w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl animate-scale-in">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 class="h-8 w-8 text-red-600" />
            </div>
            <h3 class="mb-2 text-center text-xl font-bold text-foreground">Vider la liste ?</h3>
            <p class="mb-8 text-center text-sm font-medium leading-relaxed text-muted-foreground">
              Vos {{ favoritesStore.count }} coups de cœur seront définitivement effacés de votre sélection.
            </p>
            <div class="flex flex-col gap-3">
              <button
                @click="clearAll"
                class="flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-bold text-white shadow-md shadow-red-500/20 transition-colors hover:bg-red-700"
              >
                Oui, tout effacer
              </button>
              <button
                @click="showClearConfirm = false"
                class="btn-outline w-full !h-12"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Heart,
  ShoppingBag,
  Trash2,
  Search,
  Package,
  CheckCircle,
  User,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Cloud
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'

useSeoMeta({
  title: 'Mes favoris | Dounia Market Tchad',
  description: 'Retrouvez tous vos produits favoris sur Dounia Market Tchad.',
  robots: 'noindex, nofollow, noarchive',
})

const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showClearConfirm = ref(false)

onMounted(() => {
  favoritesStore.initialize()
})

function formatPrice(amount: number): string {
  return cartStore.formatPrice(amount)
}

function removeFromFavorites(productId: string) {
  favoritesStore.removeFromFavorites(productId)
}

function addToCart(item: any) {
  cartStore.addItem({
    id: item.productId,
    productId: item.productId,
    title: item.title,
    price: item.price,
    thumbnail: item.thumbnail,
    category: item.category,
  })
}

function moveAllToCart() {
  favoritesStore.moveAllToCart()
}

function clearAll() {
  favoritesStore.clearAll()
  showClearConfirm.value = false
}
</script>
