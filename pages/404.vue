<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="text-center max-w-lg">
      <!-- Animated 404 -->
      <div class="relative mb-8">
        <h1 class="text-[150px] font-bold text-border/50 leading-none select-none">404</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce-slow">
            <PackageXIcon class="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-foreground mb-3">Page introuvable</h2>
      <p class="text-muted-foreground mb-8">
        Oups ! Cette page semble s'être perdue en route vers N'Djamena. 
        Elle n'existe pas ou a été déplacée.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/"
          class="px-8 py-4 bg-brand border border-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-sm "
        >
          <span class="flex items-center gap-2">
            <HomeIcon class="w-5 h-5" />
            Retour à l'accueil
          </span>
        </NuxtLink>
        <NuxtLink
          to="/catalogue"
          class="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-all shadow-sm"
        >
          <span class="flex items-center gap-2">
            <ShoppingBagIcon class="w-5 h-5" />
            Voir le catalogue
          </span>
        </NuxtLink>
      </div>

      <!-- Help -->
      <p class="text-sm text-muted-foreground mt-12">
        Besoin d'aide ? 
        <NuxtLink to="/contact" class="text-accent hover:underline">Contactez-nous</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PackageX as PackageXIcon, Home as HomeIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-vue-next'

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Page introuvable - Dounia Market Tchad',
  description: 'Cette page n\'existe pas sur Dounia Market Tchad.',
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
