<template>
  <div class="min-h-screen flex flex-col pb-16 lg:pb-0 bg-[radial-gradient(circle_at_top,rgba(212,135,44,0.06),transparent_40%)]">
    <!-- Announcement Bar -->
    <div
      class="text-white py-2.5 transition-all duration-500"
      :class="isScrolled ? 'bg-[var(--color-primary)]/90 backdrop-blur-md' : 'bg-[var(--color-primary)]'"
    >
      <div class="container-main">
        <div class="flex items-center gap-4 text-sm whitespace-nowrap overflow-hidden">
          <div class="flex items-center gap-4 animate-marquee">
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-[var(--color-accent)]" />
              <span>Livraison à N'Djamena sous 3-5 jours — Preuve photo incluse</span>
            </div>
            <span class="text-[var(--color-accent)]">•</span>
              <span>Paiement 100% sécurisé</span>
            <span class="text-[var(--color-accent)]">•</span>
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-[var(--color-accent)]" />
              <span>Dounia Market — Le meilleur pour vos proches</span>
            </div>
          </div>
          <!-- Repeat for infinite smooth scrolling effect -->
          <div class="flex items-center gap-4 animate-marquee" aria-hidden="true">
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-[var(--color-accent)]" />
              <span>Livraison à N'Djamena sous 3-5 jours — Preuve photo incluse</span>
            </div>
            <span class="text-[var(--color-accent)]">•</span>
            <span>Paiement 100% sécurisé</span>
            <span class="text-[var(--color-accent)]">•</span>
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-[var(--color-accent)]" />
              <span>Dounia Market — Le meilleur pour vos proches</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header — Liquid Glass -->
    <header 
      class="sticky top-0 z-50 transition-all duration-500 header-glass"
      :class="isScrolled ? 'header-glass--scrolled' : 'header-glass--top'"
    >
      <div class="container-main">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex-shrink-0 group">
            <img 
              src="/logo.png" 
              alt="Dounia Market" 
              class="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </NuxtLink>

          <!-- Desktop Search Bar — Central Component -->
          <div class="hidden md:flex flex-1 max-w-xl mx-8">
            <div class="relative w-full group">
              <input 
                type="text"
                placeholder="Rechercher un produit, une marque, une catégorie..."
                class="w-full h-11 pl-4 pr-12 rounded-xl border border-slate-200 focus:border-[var(--color-accent)] outline-none transition-all text-sm bg-white/90 focus:bg-white shadow-sm backdrop-blur-md"
                @click="isSearchOpen = true"
                readonly
              />
              <button 
                @click="isSearchOpen = true"
                class="absolute right-0 top-0 h-full px-4 bg-[var(--color-primary)] text-white rounded-r-xl hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <Search class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- Navigation (Desktop only) -->
            <nav class="hidden xl:flex items-center gap-6 mr-4">
              <!-- MegaMenu Categories -->
              <div class="relative group" @mouseenter="isCategoryMenuOpen = true" @mouseleave="isCategoryMenuOpen = false">
                <button class="nav-link text-sm font-medium flex items-center gap-2 py-2">
                  <LayoutList class="w-4 h-4" /> Catégories <ChevronDown class="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </button>
                <div 
                  v-show="isCategoryMenuOpen"
                  class="absolute top-full left-0 w-[400px] mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] transition-opacity duration-200"
                >
                  <div class="p-6 grid grid-cols-2 gap-4">
                    <NuxtLink to="/catalogue?categorie=alimentaire" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-green-50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Wheat class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-gray-800">Alimentaire</span>
                      <span class="text-[10px] text-gray-500">Marché & Supermarché</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=scolarite" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-blue-50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><BookOpen class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-gray-800">Scolarité</span>
                      <span class="text-[10px] text-gray-500">Kits & Fournitures</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=sante" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-pink-50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Heart class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-gray-800">Santé & Bébé</span>
                      <span class="text-[10px] text-gray-500">Pharmacie & Soins</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=btp" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-orange-50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Hammer class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-gray-800">Construction</span>
                      <span class="text-[10px] text-gray-500">Matériaux BTP</span>
                    </NuxtLink>
                  </div>
                  <div class="bg-gray-50 p-4 border-t border-gray-100">
                    <NuxtLink to="/catalogue" class="text-sm text-[var(--color-accent-dark)] font-medium flex items-center justify-center gap-2 hover:underline" @click="isCategoryMenuOpen = false">
                      Voir tout le catalogue <ArrowRight class="w-4 h-4"/>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <NuxtLink to="/catalogue" class="nav-link text-sm font-medium flex items-center gap-2">
                <Package class="w-4 h-4" /> Catalogue
              </NuxtLink>
            </nav>

            <!-- Favorites -->
            <NuxtLink
              to="/favoris"
              class="hidden md:flex relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group border border-transparent hover:border-slate-200"
            >
              <Heart class="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              <ClientOnly>
                <span 
                  v-if="favoritesStore.count > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ favoritesStore.count }}
                </span>
              </ClientOnly>
            </NuxtLink>

            <!-- Help Dropdown -->
            <div class="hidden md:block relative" ref="helpMenuRef" @mouseenter="isHelpMenuOpen = true" @mouseleave="isHelpMenuOpen = false">
              <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm border border-transparent hover:border-slate-200">
                <HelpCircle class="w-5 h-5 text-gray-500" />
                <span>Aide</span>
                <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'rotate-180': isHelpMenuOpen }" />
              </button>
              
              <Transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-show="isHelpMenuOpen" class="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 pt-2">
                  <div class="flex flex-col">
                    <NuxtLink to="/comment-ca-marche" class="flex flex-col px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <span class="text-sm font-medium text-gray-800">Centre d'aide</span>
                      <span class="text-xs text-gray-500">Guides et questions fréquentes</span>
                    </NuxtLink>
                    <NuxtLink to="/suivi" class="flex flex-col px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <span class="text-sm font-medium text-gray-800">Suivre une commande</span>
                      <span class="text-xs text-gray-500">Où se trouve mon colis ?</span>
                    </NuxtLink>
                    <NuxtLink to="/conditions" class="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50">
                      Politique de retour & Remboursement
                    </NuxtLink>
                    <div class="px-5 py-4 bg-gray-50 flex gap-2">
                      <NuxtLink to="https://wa.me/235xxxxxxx" target="_blank" class="flex-1 btn-primary text-xs py-2 px-0 bg-green-500 text-white hover:bg-green-600 shadow-none border-none justify-center">
                        WhatsApp
                      </NuxtLink>
                      <NuxtLink to="/contact" class="flex-1 btn-outline text-xs py-2 px-0 shadow-none border-gray-200 justify-center">
                        Email
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- User Menu Dropdown -->
            <div class="hidden md:block relative" ref="userMenuRef" @mouseenter="isUserMenuOpen = true" @mouseleave="isUserMenuOpen = false">
              <ClientOnly>
                <button class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm border border-transparent hover:border-slate-200">
                  <template v-if="authStore.isAuthenticated">
                    <div class="w-7 h-7 bg-[var(--color-accent)] rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {{ authStore.initials }}
                    </div>
                  </template>
                  <template v-else>
                    <User class="w-5 h-5 text-gray-500" />
                  </template>
                  <span>Compte</span>
                  <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'rotate-180': isUserMenuOpen }" />
                </button>

                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div v-show="isUserMenuOpen" class="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 pt-2">
                    
                    <!-- Not Logged In State -->
                    <div v-if="!authStore.isAuthenticated" class="p-4 border-b border-gray-100">
                      <NuxtLink to="/auth/login" class="btn-primary w-full flex justify-center py-2.5 text-sm shadow-md mb-2">
                        Se connecter
                      </NuxtLink>
                      <p class="text-xs text-center text-gray-500">Nouveau client ? <NuxtLink to="/auth/login" class="font-bold text-[var(--color-primary)] hover:underline">Créer un compte</NuxtLink></p>
                    </div>

                    <!-- Logged In State -->
                    <div v-else class="px-4 py-3 border-b border-gray-100">
                      <p class="font-bold text-gray-800 truncate">{{ authStore.fullName }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                    </div>

                    <!-- Links -->
                    <div class="py-2">
                      <NuxtLink to="/compte" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-accent-dark)] transition-colors">
                        <LayoutDashboard class="w-4 h-4" /> Mon Compte
                      </NuxtLink>
                      <NuxtLink to="/compte/commandes" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-accent-dark)] transition-colors">
                        <Package class="w-4 h-4" /> Vos Commandes
                      </NuxtLink>
                      <NuxtLink to="/favoris" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-accent-dark)] transition-colors">
                        <Heart class="w-4 h-4" /> Votre Liste d'envies
                      </NuxtLink>
                      
                      <div v-if="authStore.isAuthenticated" class="border-t border-gray-100 mt-1 pt-1">
                        <button @click="handleLogout" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full">
                          <LogOut class="w-4 h-4" /> Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </ClientOnly>
            </div>

            <!-- Currency Selector -->
            <ClientOnly>
              <CurrencySelector />
            </ClientOnly>

            <!-- Cart -->
              <button
                @click="cartStore.toggleCart"
                class="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
              >
                <ShoppingBag class="w-5 h-5 text-gray-600 group-hover:text-[var(--color-primary)] transition-colors" />
              <ClientOnly>
                <span 
                  v-if="cartStore.itemCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in"
                >
                  {{ cartStore.itemCount }}
                </span>
              </ClientOnly>
            </button>

            <!-- Mobile Menu -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <component :is="isMobileMenuOpen ? X : Menu" class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Sidebar -->
      <ClientOnly>
        <MobileSidebar v-model="isMobileMenuOpen" />
      </ClientOnly>
    </header>

    <!-- Main -->
    <main class="flex-grow">
      <div class="container-main">
        <NuxtErrorBoundary>
          <slot />
          <template #error="{ error }">
            <ErrorBoundary :error="error" @recover="error.value = null" />
          </template>
        </NuxtErrorBoundary>
      </div>
    </main>

    <!-- Pre-Footer Trust Section -->
    <div class="bg-gradient-to-b from-slate-50 to-white mt-20 border-t border-slate-200">
      <div class="container-main py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div class="flex flex-col items-center px-4 pt-4 md:pt-0">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-accent-dark)] shadow-sm mb-4">
              <Truck class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-slate-900 mb-2">Livraison Rapide</h4>
            <p class="text-sm text-slate-600">Sous 3 à 5 jours ouvrés à N'Djamena, directement chez vous.</p>
          </div>
          <div class="flex flex-col items-center px-4 pt-8 md:pt-0">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-accent-dark)] shadow-sm mb-4">
              <Shield class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-slate-900 mb-2">Paiement Sécurisé</h4>
            <p class="text-sm text-slate-600">Transactions chiffrées. Nous acceptons Cartes et Mobile Money.</p>
          </div>
          <div class="flex flex-col items-center px-4 pt-8 md:pt-0">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--color-accent-dark)] shadow-sm mb-4">
              <Camera class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-slate-900 mb-2">Preuve de Livraison</h4>
            <p class="text-sm text-slate-600">Photo de remise envoyée pour garantir la réception de vos proches.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_55%,#111827_100%)] text-white pt-12">
      <div class="container-main pb-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <!-- Brand (Visible on Mobile & Desktop) -->
          <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <img src="/logo.png" alt="Dounia Market" class="h-10 md:h-14 w-auto mb-6" />
            <p class="text-slate-400 text-sm leading-relaxed mb-6">
              Dounia Market relie la diaspora tchadienne à ses proches. Envoyez l'essentiel avec confiance et amour.
            </p>
            <div class="flex gap-3">
              <a v-for="s in socials" :key="s.name" :href="s.url" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-[var(--color-accent)] hover:text-white flex items-center justify-center transition-all duration-300">
                <component :is="s.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- A PROPOS (Hidden on Mobile) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-white tracking-wide uppercase text-xs opacity-50">Dounia Market</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/a-propos" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Qui sommes-nous ?</NuxtLink></li>
              <li><NuxtLink to="/comment-ca-marche" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Comment ça marche</NuxtLink></li>
              <li><NuxtLink to="/conditions" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Conditions Générales (CGV)</NuxtLink></li>
              <li><NuxtLink to="/mentions-legales" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Mentions Légales</NuxtLink></li>
              <li><NuxtLink to="/confidentialite" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Confidentialité</NuxtLink></li>
            </ul>
          </div>

          <!-- ASSISTANCE (Hidden on Mobile) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-white tracking-wide uppercase text-xs opacity-50">Besoin d'aide ?</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/faq" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Foire aux questions</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Contactez-nous</NuxtLink></li>
              <li><NuxtLink to="/suivi" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Suivre ma commande</NuxtLink></li>
              <li><NuxtLink to="/conditions#remboursement" class="text-slate-400 hover:text-[var(--color-accent)] text-sm font-medium transition-colors">Remboursement & Retours</NuxtLink></li>
            </ul>
          </div>

          <!-- PAIEMENT & CONTACT (Visible on Desktop) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-white tracking-wide uppercase text-xs opacity-50">Paiement & Contact</h4>
            <ul class="space-y-4 mb-6">
              <li>
                <a href="mailto:contact@tchadbox.com" class="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all">
                    <Mail class="w-4 h-4" />
                  </div>
                  <span class="text-sm">contact@douniamarket.com</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/235xxxxxxx" target="_blank" class="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 group-hover:text-green-400 transition-all">
                    <MessageCircle class="w-4 h-4" />
                  </div>
                  <span class="text-sm">WhatsApp Assistance</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="border-t border-white/10 bg-black/30">
        <div class="container-main py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-500 text-xs text-center md:text-left">© {{ new Date().getFullYear() }} Dounia Market. Tous droits réservés.</p>
          <div class="flex items-center gap-4">
            <span class="text-xs text-slate-500 font-bold tracking-widest uppercase">Paiements Sécurisés</span>
            <div class="flex gap-2">
              <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white">VISA</div>
              <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white">MC</div>
              <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white">MM</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Search Modal -->
    <SearchModal v-model="isSearchOpen" />
    
    <!-- Mobile Bottom Navigation (App-like) -->
    <ClientOnly>
      <MobileBottomNav @open-sidebar="isMobileMenuOpen = true" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { 
  Search, ShoppingBag, Menu, X, Mail, Phone, MapPin, Truck, Shield, Camera,
  Home, Package, HelpCircle, MapPinned, MessageCircle,
  Facebook, Instagram, Twitter, Heart, User, ChevronDown,
  LayoutDashboard, UserCircle, LogOut, UserPlus,
  LayoutList, Wheat, BookOpen, Hammer, ArrowRight
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { onClickOutside } from '@vueuse/core'

const cartStore = useCartStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()

// Currency auto-detection
const { autoDetect } = useCurrency()

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isScrolled = ref(false)
const isUserMenuOpen = ref(false)
const isHelpMenuOpen = ref(false)
const isCategoryMenuOpen = ref(false)

const userMenuRef = ref<HTMLElement | null>(null)
const helpMenuRef = ref<HTMLElement | null>(null)

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

const navLinks = [
  { label: 'Accueil', to: '/', icon: Home },
  { label: 'Catalogue', to: '/catalogue', icon: Package },
  { label: 'Comment ça marche', to: '/comment-ca-marche', icon: HelpCircle },
  { label: 'Suivi', to: '/suivi', icon: MapPinned },
  { label: 'Contact', to: '/contact', icon: MessageCircle },
]

const socials = [
  { name: 'Facebook', url: '#', icon: Facebook },
  { name: 'Instagram', url: '#', icon: Instagram },
  { name: 'Twitter', url: '#', icon: Twitter },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function handleLogout() {
  isUserMenuOpen.value = false
  await authStore.logout()
}



onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })

  // Auto-detect currency from IP / user profile
  autoDetect()

  // Fetch live exchange rates
  cartStore.fetchRates()


})

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
})
</script>

<style scoped>
/* Liquid Glass Header */
.header-glass {
  border-bottom: 1px solid transparent;
}

.header-glass--top {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
}

.header-glass--scrolled {
  background: rgba(255, 251, 245, 0.78);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(212, 135, 44, 0.15);
  box-shadow:
    0 4px 24px -2px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7);
}

/* Nav Links */
.nav-link {
  @apply relative font-medium text-gray-600 transition-colors duration-300;
}

.nav-link:hover {
  color: var(--color-accent-dark);
}

.nav-link::after {
  content: '';
  @apply absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300;
  background: var(--color-accent);
}

.nav-link:hover::after,
.nav-link-active::after {
  @apply w-full;
}

.nav-link-active {
  color: var(--color-accent-dark);
}
</style>
