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
            class="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col h-full overflow-hidden border-r border-gray-100"
          >
            <!-- Header with Premium Gradient -->
            <div class="px-6 pt-10 pb-8 bg-slate-900 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div class="relative z-10 flex items-center justify-between mb-8">
                <img src="/logo.png" alt="Logo" class="h-8 w-auto brightness-0 invert" />
                <button @click="close" class="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                  <X class="w-5 h-5 text-white" />
                </button>
              </div>
 
              <template v-if="authStore.isAuthenticated">
                <div class="relative z-10 flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
                    {{ authStore.initials }}
                  </div>
                  <div>
                    <p class="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-1">Votre Espace</p>
                    <p class="text-xl font-black text-white leading-tight tracking-tight">{{ authStore.fullName }}</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="relative z-10">
                  <p class="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-2">Bienvenue sur</p>
                  <h2 class="text-2xl font-black text-white tracking-tighter italic">DOUNIA MARKET</h2>
                </div>
              </template>
            </div>
 
            <!-- Body Scrollable -->
            <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
              
              <div v-if="!authStore.isAuthenticated" class="p-6">
                <NuxtLink 
                  to="/auth/login" 
                  @click="close" 
                  class="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-gray-800 transition-all uppercase tracking-widest text-[10px]"
                >
                  <User class="w-4 h-4" />
                  Se connecter
                </NuxtLink>
              </div>
              
              <!-- Navigation Principale -->
              <div class="py-4 px-3">
                <NuxtLink to="/" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Home class="w-5 h-5 text-slate-400 group-hover:text-gray-900" />
                  </div>
                  <span class="font-black text-xs uppercase tracking-widest">Accueil</span>
                </NuxtLink>
                <NuxtLink to="/catalogue" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Package class="w-5 h-5 text-slate-400 group-hover:text-gray-900" />
                  </div>
                  <span class="font-black text-xs uppercase tracking-widest">Catalogue</span>
                </NuxtLink>
              </div>
 
              <!-- Compte & Favoris -->
              <div class="py-4 px-3 border-t border-gray-50" v-if="authStore.isAuthenticated">
                <p class="px-4 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Espace Client</p>
                <NuxtLink to="/compte" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <LayoutDashboard class="w-5 h-5 text-slate-400 group-hover:text-gray-900" /> 
                  <span class="font-bold text-sm">Tableau de bord</span>
                </NuxtLink>
                <NuxtLink to="/favoris" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <Heart class="w-5 h-5 text-slate-400 group-hover:text-gray-900" /> 
                  <span class="font-bold text-sm">Ma liste d'envies</span>
                </NuxtLink>
              </div>
 
              <!-- Aide & Support -->
              <div class="py-4 px-3 border-t border-gray-50">
                <p class="px-4 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assistance</p>
                <NuxtLink to="/suivi" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <MapPinned class="w-5 h-5 text-slate-400 group-hover:text-gray-900" /> 
                  <span class="font-bold text-sm">Suivre un colis</span>
                </NuxtLink>
                <NuxtLink to="/contact" @click="close" class="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-gray-900 transition-all group">
                  <HelpCircle class="w-5 h-5 text-slate-400 group-hover:text-gray-900" /> 
                  <span class="font-bold text-sm">Nous contacter</span>
                </NuxtLink>
              </div>
 
              <!-- Logout -->
              <div v-if="authStore.isAuthenticated" class="p-6">
                <button @click="handleLogout" class="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest text-[10px]">
                  <LogOut class="w-4 h-4" /> 
                  Déconnexion
                </button>
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
