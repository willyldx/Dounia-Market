<template>
  <div class="bg-background min-h-screen pt-32 pb-24">
    <!-- Header -->
    <section class="max-w-3xl mx-auto px-6 mb-16 pt-10 text-center">
      <h1 class="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
        Foire aux questions
      </h1>
      <p class="text-lg text-muted-foreground font-medium">
        Les informations utiles pour commander et faire livrer à N'Djamena.
      </p>
    </section>

    <!-- FAQ Accordion (V0 Style) -->
    <section class="max-w-3xl mx-auto px-6 mb-24">
      <div class="border-t border-border">
        <div 
          v-for="(faq, i) in faqs" :key="i" 
          class="border-b border-border"
        >
          <button @click="openFaq = openFaq === i ? null : i" class="w-full py-6 text-left flex justify-between items-center gap-4 group">
            <span class="font-medium text-[15px] text-foreground group-hover:text-muted-foreground transition-colors">{{ faq.question }}</span>
            <ChevronDown class="w-4 h-4 text-muted-foreground transition-transform duration-300" :class="openFaq === i ? 'rotate-180' : ''" />
          </button>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-40"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-40"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="openFaq === i" class="pb-6 pr-8 text-muted-foreground text-sm leading-relaxed overflow-hidden">
              {{ faq.answer }}
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Contact Support CTA -->
    <section class="max-w-3xl mx-auto px-6 text-center">
      <div class="bg-muted/30 rounded-lg p-10 border border-border shadow-sm">
        <h2 class="text-2xl font-bold text-foreground mb-3">Vous ne trouvez pas votre réponse ?</h2>
        <p class="text-muted-foreground text-sm mb-6">Notre équipe est disponible pour vous accompagner à chaque étape.</p>
        <NuxtLink to="/contact" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6">
          Contacter l'assistance
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const openFaq = ref<number | null>(0) // Open the first one by default

const faqs = [
  { question: 'Où livrez-vous actuellement ?', answer: 'La livraison locale est proposée à N\'Djamena selon les zones couvertes. La disponibilité pour une adresse est indiquée au cours de la commande.' },
  { question: 'Quand les frais de livraison seront-ils connus ?', answer: 'Les zones couvertes et les frais applicables seront confirmés avant l\'ouverture publique du service.' },
  { question: 'Quels produits puis-je commander ?', answer: 'Les produits proposés au catalogue sont destinés à être préparés localement. Consultez chaque fiche pour les informations de disponibilité.' },
  { question: 'Comment suivre la livraison ?', answer: 'Saisissez uniquement la référence de commande sur la page de suivi. Ne communiquez pas publiquement le nom, le téléphone ou l\'adresse du bénéficiaire.' },
  { question: 'Comment finaliser une commande ?', answer: 'Les modalités disponibles seront confirmées avant l\'ouverture publique du service et présentées avant toute validation.' },
  { question: 'Comment demander une modification ?', answer: 'Contactez l\'assistance en mentionnant votre référence de commande. L\'équipe vous indiquera ce qui est possible selon son état d\'avancement.' },
]

useSeoMeta({
  title: 'Foire Aux Questions | Dounia Market',
  description: 'Retrouvez les réponses concernant les commandes et livraisons locales à N\'Djamena via Dounia Market.',
})
</script>

<style scoped>
/* Animations and clean styles */
</style>
