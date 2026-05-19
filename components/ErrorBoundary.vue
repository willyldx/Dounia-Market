<template>
  <div class="p-12 my-12 bg-white rounded-3xl border border-red-50 shadow-sm flex flex-col items-center text-center animate-fade-in">
    <div class="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
      <AlertCircle class="w-10 h-10" />
    </div>
    <h3 class="text-xl font-bold text-gray-900 mb-3">Oups ! Quelque chose s'est mal passé.</h3>
    <p class="text-gray-500 max-w-md mb-8">
      Nous avons rencontré une erreur lors du chargement de cette section. Ne vous inquiétez pas, le reste de la boutique fonctionne normalement.
    </p>
    <div class="flex gap-4">
      <button 
        @click="recover" 
        class="btn-primary"
      >
        Réessayer
      </button>
      <NuxtLink 
        to="/" 
        class="btn-outline"
        @click="recover"
      >
        Retour à l'accueil
      </NuxtLink>
    </div>
    
    <div v-if="error && isDev" class="mt-8 p-4 bg-gray-50 rounded-xl text-left w-full max-w-2xl overflow-auto">
      <p class="text-[10px] font-mono text-gray-400 uppercase mb-2 tracking-widest">Détails techniques (Dev Only)</p>
      <pre class="text-xs text-red-600 font-mono">{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  error: any
}>()

const emit = defineEmits(['recover'])

const isDev = process.dev

const recover = () => {
  emit('recover')
}
</script>
