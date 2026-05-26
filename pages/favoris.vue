<template>
  <div class="min-h-screen bg-background pt-32 pb-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-black text-foreground tracking-tight">Favoris</h1>
          <p class="text-muted-foreground font-medium mt-2">{{ favoritesStore.count }} article{{ favoritesStore.count > 1 ? 's' : '' }} sauvegardé{{ favoritesStore.count > 1 ? 's' : '' }}</p>
        </div>

        <div v-if="!favoritesStore.isEmpty" class="flex gap-3">
          <button
            @click="showClearConfirm = true"
            class="flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-muted-foreground font-bold rounded-lg hover:bg-muted/50 hover:text-red-500 transition-all shadow-sm"
          >
            <TrashIcon class="w-4 h-4" /> Vider
          </button>
          <button
            @click="moveAllToCart"
            class="flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-foreground font-bold rounded-md hover:bg-brand/90 transition-all shadow-sm"
          >
            <ShoppingCartIcon class="w-4 h-4" /> Ajouter au panier
          </button>
        </div>
      </div>

      <!-- Premium Empty State -->
      <div v-if="favoritesStore.isEmpty" class="bg-card rounded-lg border border-border shadow-sm p-16 text-center max-w-3xl mx-auto mt-10">
        <div class="relative mb-10 group mx-auto w-max">
           <div class="absolute inset-0 bg-muted rounded-full scale-150 opacity-50 blur-2xl"></div>
           <div class="w-32 h-32 rounded-full border border-border bg-card shadow-sm flex items-center justify-center relative z-10">
             <HeartIcon class="w-12 h-12 text-muted-foreground/30" />
           </div>
        </div>
        <h3 class="text-3xl font-black text-foreground mb-4 tracking-tight">Aucun coup de cœur</h3>
        <p class="text-muted-foreground font-medium mb-12 max-w-lg mx-auto leading-relaxed">
          Votre liste d'envies est vide. Cliquez sur le petit cœur des produits pour sauvegarder vos cadeaux idéaux pour vos proches à N'Djamena.
        </p>
        <NuxtLink
          to="/catalogue"
          class="inline-flex items-center justify-center gap-3 px-10 py-4 bg-brand text-brand-foreground font-bold rounded-md hover:bg-brand/90 transition-all shadow-sm"
        >
          <SearchIcon class="w-5 h-5 opacity-70" /> Explorer la collection
        </NuxtLink>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        <div
          v-for="item in favoritesStore.items"
          :key="item.productId"
          class="bg-card rounded-lg overflow-hidden border border-border shadow-sm group hover:border-border/80 hover:shadow-md transition-all duration-300"
        >
          <!-- Product Image -->
          <NuxtLink :to="`/produit/${item.productId}`" class="block relative aspect-[4/5] bg-muted/30 overflow-hidden">
            <img
              v-if="item.thumbnail"
              :src="item.thumbnail"
              :alt="item.title"
              class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <PackageIcon class="w-12 h-12 text-muted-foreground/30" />
            </div>

            <!-- Remove Button -->
            <button
              @click.prevent="removeFromFavorites(item.productId)"
              class="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-red-500/10 hover:shadow-md transition-all group/btn z-10"
            >
              <HeartIcon class="w-5 h-5 fill-foreground text-foreground group-hover/btn:fill-red-500 group-hover/btn:text-red-500 transition-colors" />
            </button>
            
            <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent flex opacity-0 group-hover:opacity-100 transition-opacity">
               <span v-if="item.category" class="text-[10px] font-bold tracking-widest uppercase bg-card/95 backdrop-blur-md text-foreground px-3 py-1.5 rounded-full shadow-sm">
                 {{ item.category }}
               </span>
            </div>
          </NuxtLink>

          <!-- Product Info -->
          <div class="p-6">
            <NuxtLink :to="`/produit/${item.productId}`">
              <h3 class="font-bold text-foreground mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                {{ item.title }}
              </h3>
            </NuxtLink>
            
            <div class="flex items-center justify-between mt-4">
              <div class="flex flex-col">
                <p class="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-0.5">Prix</p>
                 <p class="font-black text-xl text-foreground">{{ formatPrice(item.price) }}</p>
              </div>
              <button
                @click="addToCart(item)"
                class="w-12 h-12 bg-muted/50 hover:bg-brand text-muted-foreground/80 hover:text-brand-foreground rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <ShoppingCartIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sync Notice for logged in users -->
      <div v-if="authStore.isAuthenticated && !favoritesStore.isEmpty" class="mt-12 p-6 bg-card border border-border rounded-lg shadow-sm flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <CheckCircleIcon class="w-5 h-5 text-accent" />
        </div>
        <div>
          <p class="text-sm font-bold text-foreground">Synchronisation active</p>
          <p class="text-sm text-muted-foreground font-medium mt-1">Vos favoris sont enregistrés dans votre compte Dounia Market.</p>
        </div>
      </div>

      <!-- Login prompt for guests -->
      <div v-if="!authStore.isAuthenticated && !favoritesStore.isEmpty" class="mt-12 p-6 bg-card border border-border rounded-lg shadow-sm flex items-start flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-start gap-4">
           <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
             <UserIcon class="w-5 h-5 text-muted-foreground" />
           </div>
           <div>
             <p class="text-sm font-bold text-foreground">Ne perdez pas votre sélection</p>
             <p class="text-sm text-muted-foreground font-medium mt-1">
               Connectez-vous pour retrouver vos favoris sur votre téléphone ou votre ordinateur à tout moment.
             </p>
           </div>
        </div>
        <NuxtLink to="/auth/login?redirect=/favoris" class="px-6 py-3 bg-muted text-foreground font-bold rounded-lg hover:bg-muted/80 transition-colors whitespace-nowrap">
          S'identifier
        </NuxtLink>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showClearConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div class="bg-card rounded-lg max-w-sm w-full p-8 shadow-2xl relative border border-border">
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrashIcon class="w-8 h-8 text-red-500" />
            </div>
            <h3 class="text-2xl font-black text-foreground text-center mb-3">Vider les favoris ?</h3>
            <p class="text-muted-foreground font-medium text-center mb-8 leading-relaxed">
              Vos {{ favoritesStore.count }} coups de cœur seront définitivement effacés de votre sélection.
            </p>
            <div class="flex flex-col gap-3">
              <button
                @click="clearAll"
                class="w-full py-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                Confirmer la suppression
              </button>
              <button
                @click="showClearConfirm = false"
                class="w-full py-4 bg-muted text-foreground font-bold rounded-lg hover:bg-muted/80 transition-colors border border-border"
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
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
  Trash as TrashIcon,
  Search as SearchIcon,
  Package as PackageIcon,
  CheckCircle as CheckCircleIcon,
  User as UserIcon,
} from 'lucide-vue-next'

useSeoMeta({
  title: 'Mes favoris | Dounia Market',
  description: 'Retrouvez tous vos produits favoris sur Dounia Market.',
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

function formatDate(date: string): string {
  const now = new Date()
  const added = new Date(date)
  const diffDays = Math.floor((now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "aujourd'hui"
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays} jours`
  
  return added.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
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
