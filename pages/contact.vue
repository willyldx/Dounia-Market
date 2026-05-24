<template>
  <div class="bg-background min-h-screen">
    <!-- Hero (Cinematic) -->
    <section class="relative pt-32 pb-40 overflow-hidden text-center flex flex-col items-center justify-center">
      <!-- Background Image with Heavy Cinematic Overlay for perfect text contrast -->
      <NuxtImg src="/hero-contact.png" alt="Contact Dounia Market" class="absolute inset-0 w-full h-full object-cover" loading="eager" quality="80" format="webp" sizes="100vw" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
      
      <div class="container-main relative z-10 mt-10">
        <span 
          v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
          class="inline-flex px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md"
        >Support Client</span>
        <h1 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          Contactez-<span class="text-accent">nous</span>
        </h1>
        <p 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md"
        >
          Notre équipe dédiée est à votre écoute pour vous accompagner à chaque étape.
        </p>
      </div>
    </section>

    <!-- Support Content -->
    <div class="container-main py-24 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        
        <!-- Contact Form — 3/5 width -->
        <div class="lg:col-span-3">
          <div class="bg-card p-10 md:p-14 rounded-[2rem] border border-border shadow-premium glass-strong">
            <h2 class="text-3xl font-black text-foreground tracking-tight mb-3">Écrivez-nous</h2>
            <p class="text-muted-foreground font-medium mb-10">Notre équipe logistique s'engage à vous répondre sous 24 heures.</p>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-muted-foreground/90">Nom complet</label>
                  <input v-model="form.name" type="text" placeholder="Ex: Jean Dupont" class="w-full bg-muted/30 border border-border text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm" required />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-muted-foreground/90">Email</label>
                  <input v-model="form.email" type="email" placeholder="votre@email.com" class="w-full bg-muted/30 border border-border text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm" required />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-bold text-muted-foreground/90">Sujet</label>
                <select v-model="form.subject" class="w-full bg-muted/30 border border-border text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm" required>
                  <option value="" disabled>Que concerne votre demande ?</option>
                  <option value="commande">Suivi de ma commande</option>
                  <option value="livraison">Détails de livraison / Douane</option>
                  <option value="paiement">Problème de paiement</option>
                  <option value="autre">Autre question</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-bold text-muted-foreground/90">Message</label>
                <textarea 
                  v-model="form.message" 
                  rows="5" 
                  placeholder="Décrivez votre question en détail..."
                  class="w-full bg-muted/30 border border-border text-foreground rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm resize-none" 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full flex items-center justify-center gap-2 py-4 bg-brand text-brand-foreground font-bold rounded-xl hover:bg-brand/90 transition-all shadow-premium glow-accent disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                <Loader v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                <Send v-else class="w-5 h-5" />
                {{ isSubmitting ? 'Traitement en cours...' : 'Envoyer le message' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Contact Info — 2/5 width -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Quick response badge -->
          <div class="bg-accent/10 border border-accent/20 rounded-2xl p-6 flex items-start gap-4 mb-2">
            <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Zap class="w-6 h-6 text-accent" />
            </div>
            <div>
              <p class="font-black text-accent text-sm uppercase tracking-wider mb-1">Assistance Prioritaire</p>
              <p class="text-sm text-foreground/80 font-medium leading-relaxed">Notre équipe commerciale garantit une prise en charge de votre dossier en moins de 24h ouvrées.</p>
            </div>
          </div>

          <!-- Contact cards -->
          <div class="bg-card rounded-2xl border border-border shadow-sm p-2 glass-strong">
            <div 
              v-for="(info, i) in contactInfo" :key="info.label"
              class="p-4 flex items-center gap-4 hover:bg-muted/30 rounded-xl transition-colors group"
            >
              <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-brand group-hover:text-brand-foreground text-muted-foreground">
                <component :is="info.icon" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-foreground text-sm">{{ info.label }}</h3>
                <a v-if="info.href" :href="info.href" class="text-muted-foreground font-medium text-sm hover:text-brand transition-colors">
                  {{ info.value }}
                </a>
                <p v-else class="text-muted-foreground font-medium text-sm">{{ info.value }}</p>
              </div>
            </div>
          </div>

          <!-- Hours card -->
          <div class="bg-card rounded-2xl border border-border shadow-sm p-6 glass-strong">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Clock class="w-5 h-5 text-foreground" />
              </div>
              <h3 class="font-black text-foreground">Horaires d'ouverture</h3>
            </div>
            <div class="space-y-4">
              <div v-for="h in hours" :key="h.day" class="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                <span class="text-muted-foreground font-medium">{{ h.day }}</span>
                <span 
                  class="text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider"
                  :class="h.closed ? 'bg-muted text-muted-foreground' : 'bg-green-500/10 text-green-500'"
                >
                  {{ h.closed ? 'Fermé' : h.time }}
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send, Mail, Phone, MapPin, Clock, Zap, MessageSquare, Loader } from 'lucide-vue-next'

const toast = useToast()
// Keeping simple form logic for frontend phase
const form = ref({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)

const contactInfo = [
  { label: 'Email Support', value: 'contact@douniamarket.com', href: 'mailto:contact@douniamarket.com', icon: Mail },
  { label: 'WhatsApp', value: '+33 X XX XX XX XX', href: '#', icon: MessageSquare },
  { label: 'Zone Logistique', value: 'N\'Djamena, Tchad', href: null, icon: MapPin },
]

const hours = [
  { day: 'Lun - Ven', time: '09:00 - 18:00', closed: false },
  { day: 'Samedi', time: '10:00 - 14:00', closed: false },
  { day: 'Dimanche', time: '', closed: true },
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
    
    toast.add({ title: 'Message envoyé', description: 'Notre équipe logistique vous répondra sous 24h ouvrées.', icon: 'i-heroicons-paper-airplane', color: 'black' })
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    console.error('Contact error:', error)
    toast.add({ title: 'Erreur', description: 'Impossible d\'envoyer le message. Veuillez réessayer ou nous contacter par téléphone.', icon: 'i-heroicons-exclamation-circle', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

useHead({ 
  title: 'Contactez-nous | Dounia Market',
  meta: [
    { name: 'description', content: 'Besoin d\'aide ? Contactez l\'équipe Dounia Market. Notre support est disponible pour toute question sur vos commandes vers N\'Djamena.' },
  ]
})
</script>

<style scoped>
/* Scoped overrides if needed */
</style>
