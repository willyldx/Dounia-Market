<template>
  <div class="flex min-h-screen flex-col bg-background">
    <div class="bg-brand py-2 text-brand-foreground">
      <p class="px-4 text-center text-xs font-medium sm:text-sm">
        Livraison locale à N'Djamena selon zones couvertes
      </p>
    </div>

    <header class="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div class="container-main">
        <div class="flex h-16 items-center gap-3 sm:h-[72px] lg:gap-7">
          <NuxtLink to="/" class="shrink-0" aria-label="Dounia Market, accueil">
            <img src="/logo-full.svg" alt="Dounia Market" class="h-7 w-auto sm:h-8" />
          </NuxtLink>

          <nav class="hidden items-center gap-5 text-sm font-medium text-foreground lg:flex">
            <NuxtLink to="/catalogue" class="transition-colors hover:text-amber-700" active-class="text-amber-700">
              Catalogue
            </NuxtLink>
            <NuxtLink to="/suivi" class="transition-colors hover:text-amber-700" active-class="text-amber-700">
              Suivi
            </NuxtLink>
          </nav>

          <button
            type="button"
            class="mx-auto hidden h-11 max-w-lg flex-1 items-center gap-3 rounded-md border border-input bg-background px-4 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 sm:flex"
            aria-label="Ouvrir la recherche de produits"
            @click="isSearchOpen = true"
          >
            <Search class="h-4 w-4 shrink-0" :stroke-width="1.75" />
            <span class="truncate">Rechercher un produit</span>
          </button>

          <div class="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <ClientOnly>
              <CurrencySelector class="hidden xl:block" />
            </ClientOnly>
            <NuxtLink
              to="/favoris"
              class="relative hidden h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
              aria-label="Favoris"
            >
              <Heart class="h-5 w-5" :stroke-width="1.75" />
              <ClientOnly>
                <span
                  v-if="favoritesStore.count > 0"
                  class="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#c9872b] px-1 text-[10px] font-semibold text-white"
                >
                  {{ favoritesStore.count }}
                </span>
              </ClientOnly>
            </NuxtLink>
            <NuxtLink
              to="/compte"
              class="hidden h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-muted md:flex"
            >
              <User class="h-5 w-5 text-muted-foreground" :stroke-width="1.75" />
              <span class="hidden xl:inline">Compte</span>
            </NuxtLink>
            <button
              type="button"
              class="relative flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Panier"
              @click="cartStore.toggleCart"
            >
              <ShoppingBag class="h-5 w-5" :stroke-width="1.75" />
              <ClientOnly>
                <span
                  v-if="cartStore.itemCount > 0"
                  class="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#c9872b] px-1 text-[10px] font-semibold text-white"
                >
                  {{ cartStore.itemCount }}
                </span>
              </ClientOnly>
            </button>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted lg:hidden"
              :aria-expanded="isMobileMenuOpen"
              aria-label="Ouvrir le menu"
              @click="isMobileMenuOpen = true"
            >
              <Menu class="h-5 w-5" :stroke-width="1.75" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="mb-3 flex h-11 w-full items-center gap-3 rounded-md border border-input bg-background px-4 text-sm text-muted-foreground sm:hidden"
          aria-label="Ouvrir la recherche de produits"
          @click="isSearchOpen = true"
        >
          <Search class="h-4 w-4" :stroke-width="1.75" />
          Rechercher un produit
        </button>
      </div>

      <ClientOnly>
        <MobileSidebar v-model="isMobileMenuOpen" />
      </ClientOnly>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="border-t border-border bg-card">
      <div class="container-main grid gap-9 py-10 md:grid-cols-[1.35fr_1fr_1fr]">
        <div class="max-w-sm">
          <NuxtLink to="/" aria-label="Dounia Market, accueil">
            <img src="/logo-full.svg" alt="Dounia Market" class="h-8 w-auto" />
          </NuxtLink>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
            Commandez depuis l'étranger pour vos proches à N'Djamena, selon les zones couvertes.
          </p>
        </div>
        <nav aria-label="Boutique">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Boutique</h2>
          <div class="mt-4 flex flex-col gap-3 text-sm">
            <NuxtLink to="/catalogue" class="hover:text-amber-700">Catalogue</NuxtLink>
            <NuxtLink to="/suivi" class="hover:text-amber-700">Suivre une commande</NuxtLink>
            <NuxtLink to="/favoris" class="hover:text-amber-700">Favoris</NuxtLink>
            <NuxtLink to="/compte" class="hover:text-amber-700">Mon compte</NuxtLink>
          </div>
        </nav>
        <nav aria-label="Informations">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Informations</h2>
          <div class="mt-4 flex flex-col gap-3 text-sm">
            <NuxtLink to="/a-propos" class="hover:text-amber-700">À propos</NuxtLink>
            <NuxtLink to="/contact" class="hover:text-amber-700">Contact</NuxtLink>
            <NuxtLink to="/conditions" class="hover:text-amber-700">Conditions générales</NuxtLink>
            <NuxtLink to="/confidentialite" class="hover:text-amber-700">Confidentialité</NuxtLink>
          </div>
        </nav>
      </div>
      <div class="border-t border-border">
        <div class="container-main flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {{ new Date().getFullYear() }} Dounia Market. Tous droits réservés.</p>
          <p>Livraison locale à N'Djamena selon zones couvertes.</p>
        </div>
      </div>
    </footer>

    <SearchModal v-model="isSearchOpen" />
  </div>
</template>

<script setup lang="ts">
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()
const { autoDetect } = useCurrency()

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)

onMounted(() => {
  autoDetect()
})

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
  isSearchOpen.value = false
})
</script>
