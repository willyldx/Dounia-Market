<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
    <div class="text-center max-w-lg w-full">
      <!-- Animated Error -->
      <div class="relative mb-8 mx-auto w-full max-w-[280px]">
        <h1 class="text-[120px] font-black text-border/40 leading-none select-none tracking-tighter">
          {{ error?.statusCode || '500' }}
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <h2 class="mb-4 text-3xl font-bold text-foreground tracking-tight">
        {{ error?.statusCode === 404 ? 'Page introuvable' : 'Oups, un souci technique' }}
      </h2>
      
      <p class="mb-10 text-base font-medium text-muted-foreground leading-relaxed px-4">
        {{ error?.statusCode === 404 
          ? 'Il semble que cette page n\'existe plus ou a été déplacée. Ne vous inquiétez pas, notre catalogue est toujours là.'
          : 'Nous rencontrons un problème inattendu. Notre équipe technique a été avertie.' 
        }}
      </p>

      <div class="flex flex-col justify-center gap-4 sm:flex-row px-4">
        <button
          @click="handleError"
          class="btn-primary flex-1"
        >
          <span>Retour à l'accueil</span>
        </button>
        <button
          @click="clearError({ redirect: '/catalogue' })"
          class="btn-outline flex-1"
        >
          Voir le catalogue
        </button>
      </div>

      <!-- Mode Dev uniquement -->
      <div v-if="error?.message && isDev" class="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-left">
        <p class="text-xs font-mono font-bold text-red-600 break-all">{{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
    url?: string
  }
}>()

const isDev = process.dev

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: 'Erreur | Dounia Market Tchad',
  robots: 'noindex, nofollow, noarchive',
})
</script>
