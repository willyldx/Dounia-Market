<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="modelValue" class="fixed inset-0 z-[100] lg:hidden">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          @click="close"
        ></div>

        <!-- Offcanvas panel -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <div 
            v-if="modelValue" 
            class="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col h-full overflow-hidden"
          >
            <!-- Header -->
            <div class="px-5 py-6 bg-[var(--color-primary)] text-white flex items-center justify-between">
              <template v-if="authStore.isAuthenticated">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    {{ authStore.initials }}
                  </div>
                  <div>
                    <p class="font-bold pr-2 leading-tight">{{ authStore.fullName }}</p>
                    <p class="text-xs text-slate-300">Bienvenue sur TchadBox</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div>
                  <h2 class="text-lg font-bold">Mon Compte</h2>
                  <p class="text-xs text-slate-300">Connectez-vous pour continuer</p>
                </div>
              </template>
              <button @click="close" class="p-2 -mr-2 text-white/70 hover:text-white bg-white/10 rounded-full">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Body Scrollable -->
            <div class="flex-1 overflow-y-auto w-full">
              
              <div v-if="!authStore.isAuthenticated" class="p-5 border-b border-gray-100">
                <NuxtLink to="/auth/login" @click="close" class="btn-primary w-full shadow-md text-sm text-center block">
                  Se connecter
                </NuxtLink>
              </div>
              
              <!-- Compte -->
              <div class="py-2 border-b border-gray-100" v-if="authStore.isAuthenticated">
                <h3 class="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Mon Profil</h3>
                <NuxtLink to="/compte" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <LayoutDashboard class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Tableau de bord</span>
                </NuxtLink>
                <NuxtLink to="/compte/commandes" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <Package class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Mes Commandes</span>
                </NuxtLink>
                <NuxtLink to="/favoris" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <Heart class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Mes Favoris</span>
                </NuxtLink>
                <button @click="handleLogout" class="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 text-red-600 outline-none">
                  <LogOut class="w-5 h-5" /> 
                  <span class="font-medium">Déconnexion</span>
                </button>
              </div>

              <!-- Aide & Assistance -->
              <div class="py-2 border-b border-gray-100">
                <h3 class="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Assistance & Aide</h3>
                <NuxtLink to="/suivi" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <MapPinned class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Suivre ma commande</span>
                </NuxtLink>
                <NuxtLink to="/comment-ca-marche" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <HelpCircle class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Centre d'aide (FAQ)</span>
                </NuxtLink>
                <NuxtLink to="/conditions" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 text-gray-700">
                  <Shield class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Politique de retour</span>
                </NuxtLink>
              </div>

              <!-- Nos Catégories -->
              <div class="py-2 bg-gray-50">
                <h3 class="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Nos Catégories</span>
                  <NuxtLink to="/catalogue" @click="close" class="text-[var(--color-accent-dark)] lowercase text-[10px]">Voir tout</NuxtLink>
                </h3>
                <NuxtLink to="/catalogue" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-white text-gray-700 border-b border-gray-100/50">
                  <ShoppingCart class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Supermarché & Alimentaire</span>
                </NuxtLink>
                <NuxtLink to="/catalogue" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-white text-gray-700 border-b border-gray-100/50">
                  <Zap class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">Électroménager</span>
                </NuxtLink>
                <NuxtLink to="/catalogue" @click="close" class="flex items-center gap-4 px-5 py-3 hover:bg-white text-gray-700 border-b border-gray-100/50">
                  <Hammer class="w-5 h-5 text-gray-400" /> 
                  <span class="font-medium">BTP & Construction</span>
                </NuxtLink>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  X, User, LayoutDashboard, Package, Heart, LogOut, 
  MapPinned, HelpCircle, Shield, ShoppingCart, Zap, Hammer 
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const authStore = useAuthStore()

function close() {
  emit('update:modelValue', false)
}

async function handleLogout() {
  close()
  await authStore.logout()
}
</script>
