<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
    <div class="text-center max-w-lg w-full">
      <!-- Animated 404 -->
      <div class="relative mb-8 mx-auto w-full max-w-[280px]">
        <h1 class="text-[150px] font-bold text-border/40 leading-none select-none tracking-tighter">404</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-xl shadow-gold-500/30 animate-float">
            <Compass class="h-12 w-12 text-white" :stroke-width="2" />
          </div>
        </div>
      </div>

      <h2 class="mb-4 text-3xl font-bold text-foreground tracking-tight">Vous êtes perdu ?</h2>
      <p class="mb-10 text-base font-medium text-muted-foreground leading-relaxed px-4">
        Oups ! Cette page semble s'être égarée en route vers N'Djamena. 
        Elle n'existe pas ou a été déplacée.
      </p>

      <div class="flex flex-col justify-center gap-4 sm:flex-row px-4">
        <NuxtLink to="/" class="btn-primary flex-1">
          <span>
            <Home class="mr-2 h-4 w-4" />
            Retour à l'accueil
          </span>
        </NuxtLink>
        <NuxtLink to="/catalogue" class="btn-outline flex-1">
          <ShoppingBag class="mr-2 h-4 w-4" />
          Voir le catalogue
        </NuxtLink>
      </div>

      <!-- Aide -->
      <p class="mt-12 text-sm font-medium text-muted-foreground">
        Besoin d'aide ? 
        <NuxtLink to="/contact" class="font-bold text-gold-700 hover:underline">Contactez-nous</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Compass, Home, ShoppingBag } from 'lucide-vue-next'

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Page introuvable | Dounia Market Tchad',
  description: 'Cette page n\'existe pas sur Dounia Market Tchad.',
  robots: 'noindex, nofollow, noarchive',
})
</script>
