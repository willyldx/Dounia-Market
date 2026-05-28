<template>
  <div class="min-h-screen bg-background">
    <!-- Hero -->
    <section class="border-b border-border bg-card py-16 sm:py-20">
      <div class="container-main mx-auto max-w-3xl text-center">
        <p class="label mb-4">En toute simplicité</p>
        <h1 class="heading-hero mb-6 text-foreground">
          Comment ça marche
        </h1>
        <p class="text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Quatre étapes, pas une de plus. Vous commandez depuis l'étranger, nous nous occupons de tout livrer à N'Djamena.
        </p>
      </div>
    </section>

    <!-- Timeline des étapes -->
    <section class="relative border-b border-border bg-background py-24 sm:py-32">
      <div class="container-main relative mx-auto max-w-5xl">
        <!-- Ligne verticale (Desktop) -->
        <div class="absolute bottom-10 left-1/2 top-10 hidden w-0.5 -translate-x-1/2 bg-gold-100 md:block" />
        
        <div class="space-y-24 md:space-y-32">
          <div 
            v-for="(step, i) in steps" :key="i" 
            class="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24 reveal-up"
          >
            <!-- Badge central (Desktop) -->
            <div class="absolute left-1/2 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-background bg-gold-500 text-xl font-bold text-white shadow-sm md:flex">
              {{ i + 1 }}
            </div>

            <!-- Contenu Texte -->
            <div :class="{ 'md:order-2 md:pl-12': i % 2 === 1, 'md:pr-12 text-left md:text-right': i % 2 === 0 }">
              <div class="mb-6 flex items-center gap-4" :class="{'md:flex-row-reverse': i % 2 === 0, 'flex-row': true}">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-lg font-bold text-white shadow-md md:hidden">
                  {{ i + 1 }}
                </span>
                <h2 class="heading-section text-2xl sm:text-3xl">{{ step.title }}</h2>
              </div>
              <p class="mb-8 text-lg font-medium leading-relaxed text-muted-foreground">{{ step.description }}</p>
              
              <div class="inline-block" :class="{'text-left': true}">
                <ul class="space-y-4">
                  <li v-for="feature in step.features" :key="feature" class="flex items-center gap-3">
                    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                      <Check class="h-3.5 w-3.5" :stroke-width="2.5" />
                    </div>
                    <span class="text-base font-medium text-muted-foreground">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Carte Visuelle -->
            <div :class="{ 'md:order-1': i % 2 === 1 }">
              <div class="group rounded-3xl border border-border bg-[#faf8f5] p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-gold-200 hover:shadow-premium hover:bg-white">
                <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-100 text-gold-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                   <component :is="step.icon" class="h-10 w-10" :stroke-width="1.5" />
                </div>
                <p class="text-xl font-bold text-foreground">{{ step.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section FAQ Rapide -->
    <section class="bg-[#faf8f5] py-24">
      <div class="container-main mx-auto max-w-3xl">
        <div class="mb-16 text-center">
          <h2 class="heading-section mb-4 text-3xl sm:text-4xl">Questions Fréquentes</h2>
          <p class="text-lg font-medium text-muted-foreground">Livraison, destinataire et sécurité.</p>
        </div>
        
        <div class="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          <div 
            v-for="(faq, i) in faqs" :key="i" 
            class="group"
          >
            <button @click="openFaq = openFaq === i ? null : i" class="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-muted/30">
              <span class="text-base font-bold text-foreground">{{ faq.question }}</span>
              <ChevronDown 
                class="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300" 
                :class="openFaq === i ? 'rotate-180 text-gold-600' : 'group-hover:text-gold-600'" 
              />
            </button>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaq === i" class="overflow-hidden bg-muted/10 px-6 pb-6 text-sm font-medium leading-relaxed text-muted-foreground">
                <div class="pt-2">
                  {{ faq.answer }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-24 text-center">
      <div class="container-main mx-auto max-w-5xl">
        <div class="hero-gradient relative overflow-hidden rounded-3xl p-12 shadow-premium sm:p-20">
          <div class="relative z-10">
            <h2 class="heading-section mb-6 text-3xl text-white sm:text-4xl lg:text-5xl">Composez votre première commande</h2>
            <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80">
              Notre équipe à N'Djamena prépare chaque commande avec le même soin que si c'était pour sa propre famille.
            </p>
            <div class="flex flex-col justify-center gap-4 sm:flex-row">
              <NuxtLink to="/catalogue" class="btn-primary !h-14 !px-8 !text-base">
                <span>Remplir mon panier</span>
              </NuxtLink>
              <NuxtLink to="/contact" class="btn-outline !h-14 !px-8 !text-base !text-white !border-white/30 hover:!bg-white/10">
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
import { ShoppingBag, MapPin, CreditCard, Truck, ChevronDown, Check } from 'lucide-vue-next'

const openFaq = ref<number | null>(null)

const steps = [
  { 
    title: 'Faites votre marché',
    description: 'Parcourez notre catalogue depuis votre téléphone ou votre ordinateur. Ajoutez au panier les produits dont vos proches ont besoin.',
    subtitle: 'Sélection des produits',
    icon: ShoppingBag,
    features: [
      'Produits de qualité en stock localement',
      'Prix transparents sans frais cachés',
      'Catalogue adapté aux besoins locaux',
    ]
  },
  { 
    title: 'Indiquez le bénéficiaire',
    description: 'Lors de la validation, renseignez simplement le nom et le numéro de téléphone de la personne qui doit recevoir les courses à N\'Djamena.',
    subtitle: 'Détails du destinataire',
    icon: MapPin,
    features: [
      'Sélectionnez le quartier de livraison',
      'Ajoutez des indications si nécessaire',
      'Livraison directement à domicile',
    ]
  },
  { 
    title: 'Payez en toute sécurité',
    description: 'Réglez votre commande en ligne de manière 100% sécurisée. Les frais de livraison sont calculés automatiquement.',
    subtitle: 'Paiement sécurisé',
    icon: CreditCard,
    features: [
      'Paiement par carte bancaire',
      'Transactions cryptées et protégées',
      'Facture envoyée immédiatement',
    ]
  },
  { 
    title: 'Nous livrons votre proche',
    description: 'Notre équipe locale prépare la commande et contacte le bénéficiaire pour organiser la remise en main propre.',
    subtitle: 'Livraison & Preuve',
    icon: Truck,
    features: [
      'Livreurs fiables et courtois',
      'Suivi de commande disponible en ligne',
      'Preuve de livraison avec photo (optionnel)',
    ]
  },
]

const faqs = [
  { question: 'Où la livraison est-elle disponible ?', answer: 'Nous livrons dans la grande majorité des quartiers de N\'Djamena. Lors de votre commande, vous pourrez sélectionner le quartier de votre proche.' },
  { question: 'Quels sont les délais de livraison ?', answer: 'Généralement, les commandes sont livrées sous 24h à 48h ouvrées après validation du paiement, selon la disponibilité du bénéficiaire.' },
  { question: 'Le bénéficiaire doit-il payer quelque chose ?', answer: 'Absolument rien. Vous réglez la totalité de la commande (produits + frais de livraison) en ligne. Votre proche n\'a qu\'à réceptionner le colis avec le sourire.' },
  { question: 'Comment puis-je m\'assurer que la commande est bien arrivée ?', answer: 'Vous disposez d\'une page "Suivi" pour voir l\'état de votre commande. De plus, nos livreurs peuvent prendre une photo lors de la remise (avec l\'accord du bénéficiaire) pour vous rassurer.' },
]

useSeoMeta({
  title: 'Comment ça marche | Dounia Market Tchad',
  description: 'Découvrez les 4 étapes simples pour faire vos courses en ligne et les faire livrer à vos proches à N\'Djamena.',
  ogTitle: 'Comment fonctionne Dounia Market Tchad ?',
  ogDescription: 'Sélectionnez, payez, et nous livrons à N\'Djamena. Découvrez notre fonctionnement.',
})
</script>
