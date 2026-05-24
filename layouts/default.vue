<template>
  <div class="min-h-screen flex flex-col bg-background">
    <!-- Announcement Bar -->
    <div
      class="text-primary-foreground py-2.5 transition-all duration-500 border-b border-white/10"
      :class="isScrolled ? 'bg-primary/90 backdrop-blur-md' : 'bg-primary'"
    >
      <div class="container-main">
        <div class="flex items-center gap-4 text-sm whitespace-nowrap overflow-hidden">
          <div class="flex items-center gap-4 animate-marquee">
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-accent" />
              <span>Livraison à N'Djamena sous 3-5 jours — Preuve photo incluse</span>
            </div>
            <span class="text-accent">•</span>
              <span>Paiement 100% sécurisé</span>
            <span class="text-accent">•</span>
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-accent" />
              <span>Dounia Market — Le meilleur pour vos proches</span>
            </div>
          </div>
          <!-- Repeat for infinite smooth scrolling effect -->
          <div class="flex items-center gap-4 animate-marquee" aria-hidden="true">
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-accent" />
              <span>Livraison à N'Djamena sous 3-5 jours — Preuve photo incluse</span>
            </div>
            <span class="text-accent">•</span>
            <span>Paiement 100% sécurisé</span>
            <span class="text-accent">•</span>
            <div class="flex items-center gap-2">
              <Truck class="w-4 h-4 text-accent" />
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
              src="/logo-full.svg" 
              alt="Dounia Market" 
              class="h-6 sm:h-8 lg:h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </NuxtLink>

          <!-- Desktop Search Bar — Central Component -->
          <div class="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div class="relative w-full group">
              <input 
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full min-w-[180px] lg:min-w-[250px] h-11 pl-4 pr-14 rounded-xl border border-border focus:border-primary outline-none transition-all text-sm bg-card/90 focus:bg-card text-foreground shadow-sm backdrop-blur-md"
                @click="isSearchOpen = true"
                readonly
              />
              <button 
                @click="isSearchOpen = true"
                class="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-primary text-primary-foreground rounded-r-xl hover:bg-primary/90 transition-colors"
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
                <button class="relative font-medium text-muted-foreground transition-colors duration-300 hover:text-primary flex items-center gap-2 py-2 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                  <LayoutList class="w-4 h-4" /> Catégories <ChevronDown class="w-3 h-3 group-hover:rotate-180 transition-transform" />
                </button>
                <div 
                  v-show="isCategoryMenuOpen"
                  class="absolute top-full left-0 w-[400px] mt-2 bg-card rounded-2xl shadow-md border border-border overflow-hidden z-[100] transition-opacity duration-200 backdrop-blur-sm"
                >
                  <div class="p-6 grid grid-cols-2 gap-4">
                    <NuxtLink to="/catalogue?categorie=alimentaire" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-muted/50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Wheat class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-foreground">Alimentaire</span>
                      <span class="text-[10px] text-muted-foreground/80">Marché & Supermarché</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=scolarite" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-muted/50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><BookOpen class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-foreground">Scolarité</span>
                      <span class="text-[10px] text-muted-foreground/80">Kits & Fournitures</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=sante" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-muted/50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Heart class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-foreground">Santé & Bébé</span>
                      <span class="text-[10px] text-muted-foreground/80">Pharmacie & Soins</span>
                    </NuxtLink>
                    <NuxtLink to="/catalogue?categorie=btp" class="flex flex-col gap-1 p-3 rounded-xl hover:bg-muted/50 transition-colors group/link" @click="isCategoryMenuOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mb-1 group-hover/link:scale-110 transition-transform"><Hammer class="w-4 h-4"/></div>
                      <span class="font-bold text-sm text-foreground">Construction</span>
                      <span class="text-[10px] text-muted-foreground/80">Matériaux BTP</span>
                    </NuxtLink>
                  </div>
                  <div class="bg-muted/30 p-4 border-t border-border/50">
                    <NuxtLink to="/catalogue" class="text-sm text-primary font-medium flex items-center justify-center gap-2 hover:underline" @click="isCategoryMenuOpen = false">
                      Voir tout le catalogue <ArrowRight class="w-4 h-4"/>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <NuxtLink to="/catalogue" class="relative font-medium text-muted-foreground transition-colors duration-300 hover:text-primary flex items-center gap-2 py-2 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full" active-class="text-primary after:w-full">
                <Package class="w-4 h-4" /> Catalogue
              </NuxtLink>
            </nav>

            <!-- Favorites -->
            <NuxtLink
              to="/favoris"
              class="hidden md:flex relative p-2.5 rounded-xl hover:bg-muted transition-colors group border border-transparent hover:border-border/50"
            >
              <Heart class="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
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
              <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-foreground font-medium text-sm border border-transparent hover:border-border/50">
                <HelpCircle class="w-5 h-5 text-muted-foreground/80" />
                <span>Aide</span>
                <ChevronDown class="w-4 h-4 text-muted-foreground/60" :class="{ 'rotate-180': isHelpMenuOpen }" />
              </button>
              
              <Transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div v-show="isHelpMenuOpen" class="absolute right-0 mt-1 w-64 bg-card rounded-xl shadow-md border border-border overflow-hidden z-50 pt-2 backdrop-blur-sm">
                  <div class="flex flex-col">
                    <NuxtLink to="/comment-ca-marche" class="flex flex-col px-5 py-3 hover:bg-muted/50 transition-colors border-b border-border/50">
                      <span class="text-sm font-medium text-foreground">Centre d'aide</span>
                      <span class="text-xs text-muted-foreground/80">Guides et questions fréquentes</span>
                    </NuxtLink>
                    <NuxtLink to="/suivi" class="flex flex-col px-5 py-3 hover:bg-muted/50 transition-colors border-b border-border/50">
                      <span class="text-sm font-medium text-foreground">Suivre une commande</span>
                      <span class="text-xs text-muted-foreground/80">Où se trouve mon colis ?</span>
                    </NuxtLink>
                    <NuxtLink to="/conditions" class="px-5 py-3 text-sm font-medium text-muted-foreground/90 hover:bg-muted/50 transition-colors border-b border-border/50">
                      Politique de retour & Remboursement
                    </NuxtLink>
                    <div class="px-5 py-4 bg-muted/30 flex gap-2">
                      <NuxtLink to="https://wa.me/235xxxxxxx" target="_blank" class="flex-1 btn-primary text-xs py-2 px-0 bg-green-500 text-white hover:bg-green-600 shadow-none border-none justify-center rounded-lg">
                        WhatsApp
                      </NuxtLink>
                      <NuxtLink to="/contact" class="flex-1 btn-outline text-xs py-2 px-0 shadow-none border-border justify-center rounded-lg">
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
                <button class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-foreground font-medium text-sm border border-transparent hover:border-border/50">
                  <template v-if="authStore.isAuthenticated">
                    <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                      {{ authStore.initials }}
                    </div>
                  </template>
                  <template v-else>
                    <User class="w-5 h-5 text-muted-foreground/80" />
                  </template>
                  <span>Compte</span>
                  <ChevronDown class="w-4 h-4 text-muted-foreground/60" :class="{ 'rotate-180': isUserMenuOpen }" />
                </button>

                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div v-show="isUserMenuOpen" class="absolute right-0 mt-1 w-64 bg-card rounded-xl shadow-md border border-border overflow-hidden z-50 pt-2 backdrop-blur-sm">
                    
                    <!-- Not Logged In State -->
                    <div v-if="!authStore.isAuthenticated" class="p-4 border-b border-border/50">
                      <NuxtLink to="/auth/login" class="flex justify-center py-2.5 text-sm mb-2 px-4 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-all shadow-sm">
                        Se connecter
                      </NuxtLink>
                      <p class="text-xs text-center text-muted-foreground">Nouveau client ? <NuxtLink to="/auth/login" class="font-bold text-primary hover:underline">Créer un compte</NuxtLink></p>
                    </div>

                    <!-- Logged In State -->
                    <div v-else class="px-4 py-3 border-b border-border/50">
                      <p class="font-bold text-foreground truncate">{{ authStore.fullName }}</p>
                      <p class="text-xs text-muted-foreground/80 truncate">{{ authStore.user?.email }}</p>
                    </div>

                    <!-- Links -->
                    <div class="py-2">
                      <NuxtLink to="/compte" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <LayoutDashboard class="w-4 h-4" /> Mon Compte
                      </NuxtLink>
                      <NuxtLink to="/compte/commandes" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <Package class="w-4 h-4" /> Vos Commandes
                      </NuxtLink>
                      <NuxtLink to="/favoris" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        <Heart class="w-4 h-4" /> Votre Liste d'envies
                      </NuxtLink>
                      
                      <div v-if="authStore.isAuthenticated" class="border-t border-border/50 mt-1 pt-1">
                        <button @click="handleLogout" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full">
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
                class="relative p-2.5 rounded-xl hover:bg-muted transition-colors group border border-transparent hover:border-border/50"
              >
                <ShoppingBag class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <ClientOnly>
                <span 
                  v-if="cartStore.itemCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm"
                >
                  {{ cartStore.itemCount }}
                </span>
              </ClientOnly>
              </button>

              <NuxtLink
                to="/compte"
                class="p-2 sm:px-4 sm:py-2.5 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <User class="w-5 h-5" />
                <span class="hidden sm:inline">Mon compte</span>
              </NuxtLink>

            <!-- Mobile Menu -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              <component :is="isMobileMenuOpen ? X : Menu" class="w-5 h-5 text-foreground" />
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
      <slot />
    </main>

    <!-- Pre-Footer Trust Section -->
    <div class="bg-muted/10 mt-20 border-t border-border/50">
      <div class="container-main py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
          <div class="flex flex-col items-center px-4 pt-4 md:pt-0">
            <div class="w-12 h-12 bg-card rounded-full flex items-center justify-center text-primary shadow-sm mb-4 border border-border/50">
              <Truck class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-foreground mb-2">Livraison Rapide</h4>
            <p class="text-sm text-muted-foreground/90">Sous 3 à 5 jours ouvrés à N'Djamena, directement chez vous.</p>
          </div>
          <div class="flex flex-col items-center px-4 pt-8 md:pt-0">
            <div class="w-12 h-12 bg-card rounded-full flex items-center justify-center text-primary shadow-sm mb-4 border border-border/50">
              <Shield class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-foreground mb-2">Paiement Sécurisé</h4>
            <p class="text-sm text-muted-foreground/90">Transactions chiffrées. Nous acceptons Cartes et Mobile Money.</p>
          </div>
          <div class="flex flex-col items-center px-4 pt-8 md:pt-0">
            <div class="w-12 h-12 bg-card rounded-full flex items-center justify-center text-primary shadow-sm mb-4 border border-border/50">
              <Camera class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-foreground mb-2">Preuve de Livraison</h4>
            <p class="text-sm text-muted-foreground/90">Photo de remise envoyée pour garantir la réception de vos proches.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-border bg-card text-foreground pt-12">
      <div class="container-main pb-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <!-- Brand (Visible on Mobile & Desktop) -->
          <div class="rounded-2xl border border-border bg-muted/50 p-6 shadow-sm">
            <NuxtLink to="/" class="inline-block mb-6">
              <img src="/logo-full.svg" alt="Dounia Market" class="h-8 md:h-10 w-auto" />
            </NuxtLink>
            <p class="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
              Le trait d'union de confiance entre la diaspora et le Tchad. Offrez l'excellence et la tranquillité d'esprit à votre famille.
            </p>
            <div class="flex gap-3">
              <a v-for="s in socials" :key="s.name" :href="s.url" class="w-10 h-10 rounded-xl bg-background border border-border hover:bg-muted text-foreground flex items-center justify-center transition-all duration-300">
                <component :is="s.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- A PROPOS (Hidden on Mobile) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-foreground tracking-wide uppercase text-xs">Notre Engagement</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/a-propos" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Notre Mission</NuxtLink></li>
              <li><NuxtLink to="/comment-ca-marche" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Notre Fonctionnement</NuxtLink></li>
              <li><NuxtLink to="/conditions" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Conditions Générales (CGV)</NuxtLink></li>
              <li><NuxtLink to="/mentions-legales" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Mentions Légales</NuxtLink></li>
              <li><NuxtLink to="/confidentialite" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Confidentialité</NuxtLink></li>
            </ul>
          </div>

          <!-- ASSISTANCE (Hidden on Mobile) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-foreground tracking-wide uppercase text-xs">Accompagnement</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/faq" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Centre d'aide & FAQ</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Service Client</NuxtLink></li>
              <li><NuxtLink to="/suivi" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Suivre ma commande</NuxtLink></li>
              <li><NuxtLink to="/conditions#remboursement" class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">Remboursement & Retours</NuxtLink></li>
            </ul>
          </div>

          <!-- PAIEMENT & CONTACT (Visible on Desktop) -->
          <div class="hidden md:block">
            <h4 class="font-bold mb-6 text-foreground tracking-wide uppercase text-xs">Paiement & Contact</h4>
            <ul class="space-y-4 mb-6">
              <li>
                <a href="mailto:contact@douniamarket.com" class="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div class="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-muted transition-all">
                    <Mail class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">contact@douniamarket.com</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/235xxxxxxx" target="_blank" class="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div class="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-muted transition-all">
                    <MessageCircle class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">WhatsApp Assistance</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="border-t border-border bg-muted/30">
        <div class="container-main py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-muted-foreground text-xs text-center md:text-left font-medium">© {{ new Date().getFullYear() }} Dounia Market. Tous droits réservés.</p>
          <div class="flex items-center gap-4">
            <span class="text-xs text-muted-foreground font-bold tracking-widest uppercase">Paiements Sécurisés</span>
            <div class="flex gap-2">
              <div class="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">VISA</div>
              <div class="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">MC</div>
              <div class="w-10 h-6 bg-background border border-border rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">MM</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Search Modal -->
    <SearchModal v-model="isSearchOpen" />
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
  background: rgba(var(--color-card), 0.6);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
}

.header-glass--scrolled {
  background: rgba(var(--color-card), 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(var(--color-border), 0.5);
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.08);
}
</style>
