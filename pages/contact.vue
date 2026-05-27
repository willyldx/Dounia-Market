<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">Contact</span>
      </nav>

      <div class="mb-12 text-center reveal-up">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
          <MessageCircleHeart class="h-8 w-8" :stroke-width="1.5" />
        </div>
        <h1 class="heading-section mb-4 text-3xl sm:text-4xl md:text-5xl">
          Contactez-nous
        </h1>
        <p class="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
          Une question sur une commande ? Un besoin particulier ? Notre équipe est à votre écoute pour vous accompagner.
        </p>
      </div>

      <!-- Contenu Support -->
      <div class="mx-auto max-w-5xl reveal-up" style="animation-delay: 100ms;">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          
          <!-- Informations de Contact (2 colonnes) -->
          <div class="space-y-6 lg:col-span-2">
            <!-- Message de réassurance -->
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div class="mb-3 flex items-center gap-3 text-amber-800">
                <LifeBuoy class="h-5 w-5" />
                <h3 class="font-bold">Service Client Dounia Market</h3>
              </div>
              <p class="text-sm font-medium leading-relaxed text-amber-700">
                Nous nous engageons à vous répondre dans les plus brefs délais. Si votre demande concerne une commande, merci de préciser la référence (Ex: CMD-12345).
              </p>
            </div>

            <!-- Cartes de contact -->
            <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div class="divide-y divide-border">
                <a href="mailto:support@douniamarket.com" class="group flex items-center gap-4 p-5 transition-colors hover:bg-muted/50">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-transform group-hover:scale-110 group-hover:bg-amber-200">
                    <Mail class="h-4 w-4" :stroke-width="2" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-foreground">Email Support</p>
                    <p class="text-sm font-medium text-muted-foreground group-hover:text-amber-700 transition-colors">support@douniamarket.com</p>
                  </div>
                </a>
                
                <div class="flex items-center gap-4 p-5">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <MapPin class="h-4 w-4" :stroke-width="2" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-foreground">Livraison Locale</p>
                    <p class="text-sm font-medium text-muted-foreground">N'Djamena, quartiers couverts</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-5">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Clock class="h-4 w-4" :stroke-width="2" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-foreground">Horaires d'ouverture</p>
                    <p class="text-sm font-medium text-muted-foreground">Du Lundi au Samedi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulaire de Contact (3 colonnes) -->
          <div class="rounded-3xl border border-border bg-card p-8 shadow-premium lg:col-span-3 sm:p-10">
            <h2 class="mb-2 text-2xl font-bold text-foreground tracking-tight">Envoyez-nous un message</h2>
            <p class="mb-8 text-sm font-medium text-muted-foreground">Remplissez le formulaire ci-dessous et nous vous recontacterons très vite.</p>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-foreground">Nom complet</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    placeholder="Ex: Jean Dupont" 
                    class="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                    required 
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-bold text-foreground">Email</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    class="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                    required 
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-bold text-foreground">Sujet de votre demande</label>
                <div class="relative">
                  <select 
                    v-model="form.subject" 
                    class="h-12 w-full appearance-none rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                    required
                  >
                    <option value="" disabled>Sélectionnez un sujet</option>
                    <option value="commande">Où en est ma commande ?</option>
                    <option value="livraison">Question sur la livraison à N'Djamena</option>
                    <option value="produit">Je cherche un produit spécifique</option>
                    <option value="autre">Autre demande</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-bold text-foreground">Votre message</label>
                <textarea 
                  v-model="form.message" 
                  rows="5" 
                  placeholder="Décrivez comment nous pouvons vous aider..."
                  class="min-h-[120px] w-full resize-y rounded-xl border border-input bg-background p-4 text-sm font-medium text-foreground outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="btn-primary w-full !h-14"
              >
                <span>
                  <Loader v-if="isSubmitting" class="mr-2 h-5 w-5 animate-spin" />
                  <Send v-else class="mr-2 h-5 w-5" />
                  {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
                </span>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send, Mail, MapPin, Clock, LifeBuoy, MessageCircleHeart, ChevronRight, ChevronDown, Loader } from 'lucide-vue-next'

const toast = useToast()
const form = ref({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    const { contactSupport } = useBackendApi()
    await contactSupport({
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    })
    
    toast.add({ 
      title: 'Message bien reçu !', 
      description: 'Nous vous répondrons dans les plus brefs délais.', 
      icon: 'i-heroicons-check-circle', 
      color: 'green' 
    })
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    console.error('Contact error:', error)
    toast.add({ 
      title: 'Petit souci technique', 
      description: 'Impossible d\'envoyer le message. Veuillez réessayer ou nous écrire par email.', 
      icon: 'i-heroicons-exclamation-circle', 
      color: 'red' 
    })
  } finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: 'Nous contacter | Dounia Market Tchad',
  description: 'Une question ? Besoin d\'aide pour votre commande ? Contactez l\'équipe Dounia Market Tchad.',
  ogTitle: 'Contact | Dounia Market Tchad',
  ogDescription: 'Contactez notre équipe pour toute question sur nos produits ou la livraison locale à N\'Djamena.',
})
</script>
