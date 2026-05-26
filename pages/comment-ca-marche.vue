<template>
  <div class="bg-background min-h-screen">
    <section class="pt-32 pb-16 bg-background border-b border-border">
      <div class="container-main text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
          Comment ça marche ?
        </h1>
        <p class="text-lg text-muted-foreground font-medium leading-relaxed">
          Depuis l'étranger, choisissez des produits disponibles localement pour un proche à N'Djamena.
        </p>
      </div>
    </section>

    <section class="py-32 relative bg-muted/10 border-t border-border/50">
      <div class="container-main max-w-5xl relative">
        <div class="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-border -translate-x-1/2" />
        
        <div class="space-y-32">
          <div 
            v-for="(step, i) in steps" :key="i" 
            class="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
            v-motion 
            :initial="{ opacity: 0, y: 40 }" 
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: i * 100, duration: 600 } }"
          >
            <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-card border-[6px] border-muted/50 rounded-full items-center justify-center shadow-sm z-10 text-foreground font-black text-xl">
              {{ i + 1 }}
            </div>

            <div :class="{ 'md:order-2 md:pl-10': i % 2 === 1, 'md:pr-10 text-left md:text-right': i % 2 === 0 }">
              <div class="flex items-center gap-4 mb-6" :class="{'md:flex-row-reverse': i % 2 === 0, 'flex-row': true}">
                <span class="md:hidden w-12 h-12 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {{ i + 1 }}
                </span>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ step.title }}</h2>
              </div>
              <p class="text-lg text-muted-foreground font-medium leading-relaxed mb-8">{{ step.description }}</p>
              
              <div class="inline-block" :class="{'text-left': true}">
                <ul class="space-y-4">
                  <li v-for="feature in step.features" :key="feature" class="flex items-center gap-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                    <span class="text-muted-foreground/90 font-medium text-base">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div :class="{ 'md:order-1': i % 2 === 1 }">
              <div class="bg-card rounded-lg p-10 text-center border border-border shadow-sm transition-all duration-300 group">
                <div class="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                   <component :is="step.icon" class="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p class="text-lg font-semibold text-foreground">{{ step.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-background">
      <div class="container-main max-w-3xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">Des questions ?</h2>
          <p class="text-lg text-muted-foreground font-medium">Livraison, bénéficiaire et suivi de commande.</p>
        </div>
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
      </div>
    </section>

    <section class="py-24 mb-10 text-center">
      <div class="container-main max-w-5xl">
        <div 
          v-motion :initial="{ opacity: 0, y: 20 }" :visibleOnce="{ opacity: 1, y: 0 }"
          class="bg-brand rounded-lg p-12 md:p-24 relative overflow-hidden"
        >
          <div class="relative z-10">
            <h2 class="text-4xl md:text-5xl font-black text-brand-foreground mb-6 tracking-tight">Commander pour un proche</h2>
            <p class="text-xl text-brand-foreground/70 mb-12 max-w-2xl mx-auto font-medium">
              Consultez les produits disponibles et les informations de livraison affichées par Dounia Market.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/catalogue" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-background text-foreground font-bold rounded-md hover:bg-muted transition-all shadow-sm">
                Voir le catalogue
              </NuxtLink>
              <NuxtLink to="/contact" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-brand-foreground/10 text-brand-foreground font-bold rounded-md hover:bg-brand-foreground/20 transition-all backdrop-blur-sm border border-brand-foreground/10">
                Nous contacter
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Package, MapPin, ClipboardCheck, Truck, ChevronDown } from 'lucide-vue-next'

const openFaq = ref<number | null>(null)

const steps = [
  { 
    title: 'Choisissez les produits',
    description: 'Parcourez le catalogue et choisissez des produits disponibles localement pour votre proche.',
    subtitle: 'Catalogue local',
    icon: Package,
    features: [
      'Produits présentés dans le catalogue',
      'Disponibilité indiquée sur la fiche produit',
      'Ajout simple au panier',
    ]
  },
  { 
    title: 'Indiquez le bénéficiaire',
    description: 'Renseignez la personne qui recevra la commande et son adresse de livraison à N\'Djamena.',
    subtitle: 'Adresse locale',
    icon: MapPin,
    features: [
      'Nom et contact du bénéficiaire',
      'Quartier et repère utiles à la livraison',
      'Livraison selon les zones couvertes',
    ]
  },
  { 
    title: 'Vérifiez le récapitulatif',
    description: 'Vérifiez les produits, le bénéficiaire et l\'adresse; les frais seront confirmés avant l\'ouverture publique.',
    subtitle: 'Informations claires',
    icon: ClipboardCheck,
    features: [
      'Adresse visible avant validation',
      'Frais de livraison à confirmer avant ouverture',
      'Conditions accessibles à tout moment',
    ]
  },
  { 
    title: 'Suivez la livraison',
    description: 'Une fois une commande enregistrée, consultez son avancement à partir de sa référence.',
    subtitle: 'Suivi de commande',
    icon: Truck,
    features: [
      'Référence de commande uniquement',
      'Aucune donnée personnelle à saisir',
      'Assistance disponible en cas de question',
    ]
  },
]

const faqs = [
  { question: 'Où la livraison est-elle proposée ?', answer: 'Dounia Market propose la livraison locale à N\'Djamena, selon les zones couvertes indiquées lors de la commande.' },
  { question: 'Quand connaîtrai-je les frais de livraison ?', answer: 'Les zones couvertes et les frais applicables seront confirmés avant l\'ouverture publique du service.' },
  { question: 'Comment suivre une commande ?', answer: 'Utilisez sa référence sur la page de suivi. N\'y saisissez jamais le nom, le téléphone ou l\'adresse du bénéficiaire.' },
  { question: 'Comment finaliser une commande ?', answer: 'Les modalités disponibles seront confirmées avant l\'ouverture publique du service et présentées avant toute validation.' },
  { question: 'Puis-je modifier une commande ?', answer: 'Contactez l\'assistance avec votre référence pour connaître les possibilités applicables à votre commande.' },
]

useHead({ 
  title: 'Comment ça marche ? — Dounia Market',
  meta: [
    { name: 'description', content: 'Découvrez comment commander à distance des produits disponibles localement pour un proche à N\'Djamena avec Dounia Market.' },
    { property: 'og:title', content: 'Comment fonctionne Dounia Market ?' }
  ]
})
</script>
