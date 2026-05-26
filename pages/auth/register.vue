<template>
  <div class="min-h-screen flex items-center justify-center relative bg-muted/30">
    <div class="w-full max-w-md relative z-10 px-4 sm:px-0">
      
      <!-- Back to Home -->
      <NuxtLink to="/" class="mb-8 mx-auto flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="w-4 h-4" /> Retour à l'accueil
      </NuxtLink>

      <div class="bg-card rounded-lg border border-border shadow-sm overflow-hidden text-center">
        
        <div class="pt-10 pb-2 flex justify-center">
          <img src="/logo-full.svg" alt="Dounia Market" class="h-8 sm:h-10 w-auto" />
        </div>

        <div class="px-8 sm:px-10 pb-12 pt-6">
          <div class="w-12 h-12 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center border border-border">
            <UserPlus class="w-6 h-6 text-foreground" />
          </div>

          <h1 class="text-2xl font-bold text-foreground mb-4 tracking-tight">Créer mon espace</h1>
          <p class="text-muted-foreground text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
            Votre espace Dounia Market est créé lors de votre première connexion avec un code reçu par email.
          </p>

          <NuxtLink to="/auth/login" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 w-full">
            <Mail class="w-4 h-4 mr-2" /> Continuer par email
          </NuxtLink>

          <p class="text-xs text-muted-foreground mt-8">
            Connexion par code, sans mot de passe à mémoriser.
          </p>
        </div>
      </div>
      
      <!-- Footer Text -->
      <div class="text-center mt-6">
        <p class="text-xs text-muted-foreground">
          Consultez nos
          <NuxtLink to="/conditions" class="text-foreground hover:underline transition-colors">conditions</NuxtLink>
          et notre
          <NuxtLink to="/confidentialite" class="text-foreground hover:underline transition-colors">politique de confidentialité</NuxtLink>.
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
  description: 'Créez votre espace Dounia Market avec une connexion par code reçu par email.',
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
