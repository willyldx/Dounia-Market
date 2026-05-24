<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand">
    <!-- Cinematic Full-screen Photo Background -->
    <div class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105" style="background-image: url('/auth-bg.png');"></div>
    
    <!-- Luxury Overlay (Very subtle) to keep the image extremely visible -->
    <div class="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

    <!-- Centered Glassmorphism Card -->
    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      
      <!-- Back to Home -->
      <NuxtLink to="/" class="mb-8 mx-auto flex w-fit items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/10">
        <ArrowLeft class="w-4 h-4" /> Retour à l'accueil
      </NuxtLink>

      <div class="bg-brand/80 backdrop-blur-[40px] rounded-[2rem] border border-white/10 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-center">
        
        <!-- Logo -->
        <div class="pt-10 pb-2 flex justify-center">
          <img src="/logo.png" alt="Dounia Market" class="h-10 sm:h-12 w-auto brightness-0 invert" />
        </div>

        <div class="px-8 sm:px-10 pb-12 pt-6">
          <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <UserPlus class="w-8 h-8 text-accent" />
          </div>

          <h1 class="text-2xl font-extrabold text-white mb-4 tracking-tight">Créer un compte</h1>
          <p class="text-white/70 font-medium text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
            Chez Dounia Market, la simplicité est reine. Votre compte est créé <strong class="text-white font-bold">automatiquement</strong> lors de votre première connexion. Aucun formulaire complexe !
          </p>

          <NuxtLink to="/auth/login" class="w-full relative group overflow-hidden rounded-xl p-[2px] transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] block border border-accent/50">
            <span class="absolute inset-0 bg-gradient-to-r from-accent via-yellow-400 to-accent group-hover:scale-105 transition-transform duration-500"></span>
            <div class="relative flex items-center justify-center gap-2 px-6 py-4 bg-brand/50 rounded-[10px] text-white font-bold text-lg transition-colors group-hover:bg-transparent">
              <Mail class="w-5 h-5" /> Se connecter
            </div>
          </NuxtLink>

          <p class="text-xs font-medium text-white/50 mt-8 max-w-[250px] mx-auto bg-white/5 border border-white/5 py-2 px-3 rounded-full">
            Magic Code OTP sans mot de passe.
          </p>
        </div>
      </div>
      
      <!-- Footer Text -->
      <div class="text-center mt-6">
        <p class="text-xs text-white/60 font-medium">
          En continuant, vous acceptez nos
          <NuxtLink to="/conditions" class="text-white hover:underline transition-colors">CGV</NuxtLink>.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { UserPlus, Mail, ArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: false, middleware: ['guest'] })

useSeoMeta({
  title: 'Créer un compte - Dounia Market',
  description: 'Créez votre compte Dounia Market facilement grâce à notre système magique sans mot de passe.',
})

// Redirect if already logged in
onMounted(async () => {
  const authStore = useAuthStore()
  await authStore.checkSession()
  if (authStore.isAuthenticated) {
    navigateTo(authStore.getRedirectPath())
  }
})
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.3);
}
.custom-shadow:hover {
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.4);
}
</style>
