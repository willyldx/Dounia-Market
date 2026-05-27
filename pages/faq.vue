<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main max-w-4xl">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">FAQ</span>
      </nav>

      <div class="mb-12 text-center reveal-up">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
          <MessageCircleQuestion class="h-8 w-8" :stroke-width="1.5" />
        </div>
        <h1 class="heading-section mb-4 text-3xl sm:text-4xl md:text-5xl">
          Questions Fréquentes
        </h1>
        <p class="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
          Vous avez des questions sur le fonctionnement, la livraison ou le paiement ? Nous avons rassemblé ici les réponses les plus courantes.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="mb-16 rounded-3xl border border-border bg-card shadow-premium reveal-up" style="animation-delay: 100ms;">
        <div class="divide-y divide-border">
          <div 
            v-for="(faq, i) in faqs" :key="i" 
            class="group"
          >
            <button @click="openFaq = openFaq === i ? null : i" class="flex w-full items-center justify-between gap-6 p-6 text-left transition-colors sm:p-8 hover:bg-muted/30">
              <span class="text-base font-bold text-foreground sm:text-lg">{{ faq.question }}</span>
              <div 
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                :class="openFaq === i ? 'bg-amber-100 text-amber-600' : 'bg-muted text-muted-foreground group-hover:bg-amber-50 group-hover:text-amber-600'"
              >
                <ChevronDown 
                  class="h-5 w-5 transition-transform duration-300" 
                  :class="openFaq === i ? 'rotate-180' : ''" 
                />
              </div>
            </button>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaq === i" class="overflow-hidden bg-[#faf8f5] px-6 pb-6 sm:px-8 sm:pb-8">
                <div class="pt-4 text-base font-medium leading-relaxed text-muted-foreground border-t border-border/50">
                  {{ faq.answer }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Contact Support CTA -->
      <div class="overflow-hidden rounded-2xl border border-border bg-[#faf8f5] text-center shadow-sm reveal-up" style="animation-delay: 200ms;">
        <div class="hero-gradient p-10 sm:p-14 relative">
          <div class="orb orb-amber absolute -left-10 -top-10 h-40 w-40 opacity-20"></div>
          <div class="relative z-10">
            <h2 class="mb-3 text-2xl font-bold text-white">Vous ne trouvez pas votre réponse ?</h2>
            <p class="mx-auto mb-8 max-w-md text-base font-medium text-white/80">Notre équipe est disponible tous les jours pour vous accompagner personnellement à chaque étape.</p>
            <NuxtLink to="/contact" class="btn-primary">
              <span><MessageCircle class="mr-2 h-4 w-4" /> Contacter l'assistance</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, ChevronDown, MessageCircleQuestion, MessageCircle } from 'lucide-vue-next'

const openFaq = ref<number | null>(0)

const faqs = [
  { 
    question: 'Dans quels quartiers de N\'Djamena livrez-vous ?', 
    answer: 'Nous livrons dans la grande majorité des quartiers de la capitale (N\'Djamena). Lors de la commande, vous pourrez sélectionner le quartier de votre bénéficiaire pour vérifier la couverture.' 
  },
  { 
    question: 'À combien s\'élèvent les frais de livraison ?', 
    answer: 'Les frais de livraison dépendent du quartier de destination à N\'Djamena. Ils sont calculés et affichés en toute transparence lors de la validation de votre panier.' 
  },
  { 
    question: 'Quels types de produits proposez-vous ?', 
    answer: 'Notre catalogue est composé de produits essentiels (alimentaire, hygiène, packs familiaux) déjà stockés localement, ce qui nous permet de livrer très rapidement.' 
  },
  { 
    question: 'Puis-je suivre ma commande ?', 
    answer: 'Oui, dès la validation de votre commande, vous recevrez une "Référence de commande". Il vous suffit de la saisir sur notre page "Suivi" pour voir l\'état d\'avancement de la livraison.' 
  },
  { 
    question: 'Le destinataire devra-t-il payer quelque chose à la réception ?', 
    answer: 'Non, absolument rien. Vous payez l\'intégralité (produits et frais de livraison) en ligne de manière sécurisée. Votre proche n\'a plus qu\'à réceptionner sa commande.' 
  },
  { 
    question: 'Que se passe-t-il si mon proche n\'est pas joignable ?', 
    answer: 'Nos livreurs tentent toujours de contacter le destinataire avant de se déplacer. Si celui-ci est injoignable, nous conservons la commande en sécurité et vous contactons pour trouver une solution.' 
  },
]

useSeoMeta({
  title: 'Questions fréquentes | Dounia Market Tchad',
  description: 'Trouvez les réponses à toutes vos questions sur le fonctionnement de Dounia Market, les paiements et la livraison à N\'Djamena.',
  ogTitle: 'FAQ | Dounia Market Tchad',
  ogDescription: 'Informations utiles sur les produits et la livraison locale à N\'Djamena.',
})
</script>
