<template>
  <div class="bg-background min-h-screen">
    <!-- Minimalist Header -->
    <section class="pt-32 pb-16 bg-background border-b border-border">
      <div class="container-main text-center max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
          Contactez-nous
        </h1>
        <p class="text-lg text-muted-foreground font-medium leading-relaxed">
          Notre équipe dédiée est à votre écoute pour vous accompagner à chaque étape.
        </p>
      </div>
    </section>

    <!-- Support Content -->
    <div class="container-main py-24 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        
        <!-- Contact Form — 3/5 width -->
        <div class="lg:col-span-3">
          <div class="bg-card p-8 md:p-10 rounded-lg border border-border shadow-sm">
            <h2 class="text-2xl font-bold text-foreground tracking-tight mb-2">Écrivez-nous</h2>
            <p class="text-muted-foreground text-sm mb-8">Notre équipe traite les questions liées aux commandes et à la livraison locale.</p>
            
            <form @submit.prevent="submitForm" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium leading-none text-foreground">Nom complet</label>
                  <input v-model="form.name" type="text" placeholder="Ex: Jean Dupont" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors" required />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium leading-none text-foreground">Email</label>
                  <input v-model="form.email" type="email" placeholder="votre@email.com" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors" required />
                </div>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-medium leading-none text-foreground">Sujet</label>
                <select v-model="form.subject" class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors" required>
                  <option value="" disabled>Sélectionnez un sujet</option>
                  <option value="commande">Suivi de ma commande</option>
                  <option value="livraison">Détails de livraison</option>
                  <option value="validation">Question sur la validation d'une commande</option>
                  <option value="autre">Autre question</option>
                </select>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-medium leading-none text-foreground">Message</label>
                <textarea 
                  v-model="form.message" 
                  rows="5" 
                  placeholder="Décrivez votre question..."
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors resize-y" 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 py-2 w-full mt-2"
              >
                <Loader v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
                <Send v-else class="w-4 h-4 mr-2" />
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Contact Info — 2/5 width -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Support context -->
          <div class="bg-muted/50 border border-border rounded-lg p-5 flex items-start gap-4 mb-2">
            <Zap class="w-5 h-5 text-foreground mt-0.5" />
            <div>
              <p class="font-bold text-foreground text-sm tracking-wide mb-1">Nous contacter</p>
              <p class="text-sm text-muted-foreground leading-relaxed">Indiquez votre référence de commande lorsque vous en disposez.</p>
            </div>
          </div>

          <!-- Contact cards -->
          <div class="bg-card rounded-lg border border-border shadow-sm p-1">
            <div 
              v-for="(info, i) in contactInfo" :key="info.label"
              class="p-4 flex items-center gap-4 hover:bg-muted/50 rounded-lg transition-colors group"
            >
              <component :is="info.icon" class="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              <div>
                <h3 class="font-medium text-foreground text-sm">{{ info.label }}</h3>
                <a v-if="info.href" :href="info.href" class="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  {{ info.value }}
                </a>
                <p v-else class="text-muted-foreground text-sm">{{ info.value }}</p>
              </div>
            </div>
          </div>

          <!-- Availability card -->
          <div class="bg-card rounded-lg border border-border shadow-sm p-5">
            <div class="flex items-center gap-2 mb-4">
              <Clock class="w-4 h-4 text-foreground" />
              <h3 class="font-bold text-foreground text-sm">Disponibilité du support</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Les canaux et horaires opérationnels seront indiqués avant ouverture publique.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send, Mail, MapPin, Clock, Zap, MessageSquare, Loader } from 'lucide-vue-next'

const toast = useToast()
// Keeping simple form logic for frontend phase
const form = ref({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)

const contactInfo = [
  { label: 'Email Support', value: 'support@douniamarket.com', href: 'mailto:support@douniamarket.com', icon: Mail },
  { label: 'Formulaire en ligne', value: 'Utilisez le formulaire pour nous écrire', href: null, icon: MessageSquare },
  { label: 'Livraison locale', value: 'N\'Djamena, selon zones couvertes', href: null, icon: MapPin },
]

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
    
    toast.add({ title: 'Message envoyé', description: 'Votre message a été transmis à notre équipe logistique.', icon: 'i-heroicons-paper-airplane', color: 'black' })
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    console.error('Contact error:', error)
    toast.add({ title: 'Erreur', description: 'Impossible d\'envoyer le message. Veuillez réessayer via ce formulaire.', icon: 'i-heroicons-exclamation-circle', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: 'Contact',
  description: 'Contactez l\'équipe Dounia Market Tchad au sujet des produits et de la livraison locale à N\'Djamena.',
  ogTitle: 'Contact | Dounia Market Tchad',
  ogDescription: 'Contactez l\'équipe au sujet des produits et de la livraison locale à N\'Djamena.',
})
</script>

<style scoped>
/* Scoped overrides if needed */
</style>
