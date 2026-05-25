<template>
  <div class="bg-background min-h-screen pt-32 pb-24">
    <!-- Header -->
    <section class="max-w-3xl mx-auto px-6 mb-16 pt-10 text-center">
      <h1 class="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
        Foire aux questions
      </h1>
      <p class="text-lg text-muted-foreground font-medium">
        Toutes les réponses pour expédier sereinement vers N'Djamena.
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
      <div class="bg-muted/30 rounded-2xl p-10 border border-border shadow-sm">
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
import { ChevronRight as ChevronRightIcon, ChevronDown, MessageCircle as MessageCircleIcon } from 'lucide-vue-next'

const openFaq = ref<number | null>(0) // Open the first one by default

const faqs = [
  { question: 'Dans quelles villes livrez-vous actuellement ?', answer: 'Notre service de livraison couvre actuellement l\'ensemble de N\'Djamena (ainsi que Moundou et Sarh selon les options de transport choisies). Inscrivez-vous à notre newsletter pour être informé de l\'ouverture de nos nouveaux hubs.' },
  { question: 'Quel est le délai de livraison garanti ?', answer: 'Le délai standard est de 3 à 5 jours ouvrés par transport aérien après la confirmation de votre paiement. L\'acheminement passe par notre propre réseau pour éviter tout blocage en douane.' },
  { question: 'Y a-t-il des frais de douanes pour le destinataire ?', answer: 'Non, jamais. Tous nos prix sont définitifs et incluent les frais d\'exportation, les taxes douanières au Tchad et la livraison locale. Votre famille ne paiera pas le moindre centime.' },
  { question: 'Comment être sûr que ma famille a bien reçu le colis ?', answer: 'C\'est notre plus grande force : la Preuve Dounia Market. Chaque livraison à domicile est validée par une photographie sécurisée du bénéficiaire avec le colis. Vous la recevez directement dans votre espace client.' },
  { question: 'Quels moyens de paiement internationaux sont acceptés ?', answer: 'Les cartes bancaires Visa et Mastercard sont acceptées via notre passerelle sécurisée Paystack. Le montant débité est affiché avant paiement.' },
  { question: 'Puis-je annuler une commande après paiement ?', answer: 'L\'annulation et le remboursement intégral sont possibles jusqu\'à ce que le statut de la commande passe à "Expédié". Une fois le colis dans l\'avion, les frais logistiques internationaux nous empêchent de bloquer la livraison.' },
]

useSeoMeta({
  title: 'Foire Aux Questions | Dounia Market',
  description: 'Retrouvez toutes les réponses concernant les livraisons vers le Tchad via Dounia Market.',
})
</script>

<style scoped>
/* Animations and clean styles */
</style>
