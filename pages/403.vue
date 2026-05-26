<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="text-center">
      <div class="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
        <Icon name="lucide:shield-x" class="w-12 h-12 text-red-500" />
      </div>
      
      <h1 class="text-4xl font-bold text-foreground mb-2">403</h1>
      <h2 class="text-xl font-semibold text-muted-foreground/90 mb-4">Accès refusé</h2>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton 
          to="/" 
          color="primary"
          size="lg"
        >
          Retour à l'accueil
        </UButton>
        <UButton 
          @click="goBack" 
          color="gray"
          variant="outline"
          size="lg"
        >
          Page précédente
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()

const goBack = () => {
  router.back()
}

useHead({
  title: 'Accès refusé - Dounia Market Tchad'
})
</script>
