<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
    <div class="text-center max-w-lg w-full">
      <!-- Animated 403 -->
      <div class="relative mb-8 mx-auto w-full max-w-[280px]">
        <h1 class="text-[150px] font-black text-border/40 leading-none select-none tracking-tighter">403</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30">
            <ShieldAlert class="h-12 w-12 text-white" :stroke-width="2" />
          </div>
        </div>
      </div>

      <h2 class="mb-4 text-3xl font-bold text-foreground tracking-tight">Accès restreint</h2>
      <p class="mb-10 text-base font-medium text-muted-foreground leading-relaxed px-4">
        Désolé, mais vous n'avez pas les autorisations nécessaires pour accéder à cette zone sécurisée.
      </p>

      <div class="flex flex-col justify-center gap-4 sm:flex-row px-4">
        <NuxtLink to="/" class="btn-primary flex-1">
          <span>
            <Home class="mr-2 h-4 w-4" />
            Retour à l'accueil
          </span>
        </NuxtLink>
        <button @click="goBack" class="btn-outline flex-1">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Page précédente
        </button>
      </div>

      <!-- Aide -->
      <p class="mt-12 text-sm font-medium text-muted-foreground">
        Une erreur de notre part ? 
        <NuxtLink to="/contact" class="font-bold text-amber-700 hover:underline">Contactez-nous</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, Home, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: false,
})

const router = useRouter()

const goBack = () => {
  router.back()
}

useSeoMeta({
  title: 'Accès refusé | Dounia Market Tchad',
  robots: 'noindex, nofollow, noarchive',
})
</script>
