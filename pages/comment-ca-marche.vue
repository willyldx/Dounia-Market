<template>
  <div class="bg-background min-h-screen">
    <!-- Minimalist Header -->
    <section class="pt-32 pb-16 bg-background border-b border-border">
      <div class="container-main text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
          Comment ça marche ?
        </h1>
        <p class="text-lg text-muted-foreground font-medium leading-relaxed">
          En 4 étapes simples, offrez le meilleur à votre famille au Tchad avec la fiabilité d'un service d'excellence.
        </p>
      </div>
    </section>

    <!-- Steps — Sleek E-Commerce Timeline -->
    <section class="py-32 relative bg-muted/10 border-t border-border/50">
      <div class="container-main max-w-5xl relative">
        <!-- LA LIGNE VERTICALE RÉPARÉE : Parent désormais en position relative ! -->
        <div class="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-border -translate-x-1/2" />
        
        <div class="space-y-32">
          <div 
            v-for="(step, i) in steps" :key="i" 
            class="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
            v-motion 
            :initial="{ opacity: 0, y: 40 }" 
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: i * 100, duration: 600 } }"
          >
            <!-- Timeline Center Node (Desktop) -->
            <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-card border-[6px] border-muted/50 rounded-full items-center justify-center shadow-sm z-10 text-foreground font-black text-xl">
              {{ i + 1 }}
            </div>

            <!-- Text side -->
            <div :class="{ 'md:order-2 md:pl-10': i % 2 === 1, 'md:pr-10 text-left md:text-right': i % 2 === 0 }">
              <div class="flex items-center gap-4 mb-6" :class="{'md:flex-row-reverse': i % 2 === 0, 'flex-row': true}">
                <span class="md:hidden w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {{ i + 1 }}
                </span>
                <h2 class="text-3xl font-black text-foreground tracking-tight">{{ step.title }}</h2>
              </div>
              <p class="text-lg text-muted-foreground font-medium leading-relaxed mb-8">{{ step.description }}</p>
              
              <!-- Feature bullets -->
              <div class="inline-block" :class="{'text-left': true}">
                <ul class="space-y-4">
                  <li v-for="feature in step.features" :key="feature" class="flex items-center gap-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                    <span class="text-muted-foreground/90 font-medium text-base">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Visual side (Sleek minimalist cards) -->
            <div :class="{ 'md:order-1': i % 2 === 1 }">
              <div class="bg-card rounded-2xl p-10 text-center border border-border shadow-sm transition-all duration-300 group">
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

    <!-- Nouveau Design FAQ (V0 Style) -->
    <section class="py-24 bg-background">
      <div class="container-main max-w-3xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">Des questions ?</h2>
          <p class="text-lg text-muted-foreground font-medium">Tout ce que vous devez savoir sur le processus d'expédition.</p>
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

    <!-- Nouveau CTA Luxe -->
    <section class="py-24 mb-10 text-center">
      <div class="container-main max-w-5xl">
        <div 
          v-motion :initial="{ opacity: 0, y: 20 }" :visibleOnce="{ opacity: 1, y: 0 }"
          class="bg-primary rounded-xl p-12 md:p-24 relative overflow-hidden"
        >
          <div class="absolute inset-0 opacity-10 bg-[url('https://api.douniamarket.com/storage/textures/noise.png')]"></div>
          <div class="relative z-10">
            <h2 class="text-4xl md:text-5xl font-black text-primary-foreground mb-6 tracking-tight">Prêt à envoyer un sourire ?</h2>
            <p class="text-xl text-primary-foreground/70 mb-12 max-w-2xl mx-auto font-medium">
              Rejoignez des centaines de familles qui font déjà confiance à Dounia Market pour le lien avec leurs proches.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/catalogue" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-background text-foreground font-bold rounded-md hover:bg-muted transition-all shadow-sm">
                Voir le catalogue premium
              </NuxtLink>
              <NuxtLink to="/contact" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-primary-foreground/10 text-primary-foreground font-bold rounded-md hover:bg-primary-foreground/20 transition-all backdrop-blur-sm border border-primary-foreground/10">
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
import { Package, CreditCard, Truck, Camera, ChevronDown } from 'lucide-vue-next'

const openFaq = ref<number | null>(null)

const steps = [
  { 
    title: 'Composez votre commande', 
    description: 'Parcourez notre catalogue et choisissez les produits de qualité à faire livrer à vos proches au Tchad.',
    subtitle: 'Catalogue exclusif',
    icon: Package,
    features: [
      'Alimentation, santé, fêtes',
      'Prix transparents sans aucun frais de douane cachés',
      'Photos haute résolution certifiées',
    ]
  },
  { 
    title: 'Réglez en tout sécurité', 
    description: 'Finalisez votre achat grâce à notre plateforme de paiement inviolable et certifiée.',
    subtitle: '100% Crypté et Sécurisé',
    icon: CreditCard,
    features: [
      'Cartes bancaires Visa et Mastercard acceptées',
      'Cryptage de pointe SSL 256-bit',
      'Confirmation de commande par email instantanée',
    ]
  },
  { 
    title: 'Livraison à domicile', 
    description: 'Notre équipe logistique réceptionne et achemine votre colis soigneusement directement au domicile de votre proche.',
    subtitle: 'Logistique Premium',
    icon: Truck,
    features: [
      'Remise porte-à-porte au Tchad',
      'Suivi étape par étape depuis votre compte',
      'Traitement prioritaire pour l\'aéroport',
    ]
  },
  { 
    title: 'Preuve Photographique', 
    description: 'Bénéficiez dune tranquillité absolue en recevant une photo validant la bonne réception par votre famille.',
    subtitle: 'Zéro stress',
    icon: Camera,
    features: [
      'Cliché de la remise envoyé en direct',
      'Notification immédiate sur Whatsapp/Email',
      'Garantie satisfaction ou remboursement',
    ]
  },
]

const faqs = [
  { question: 'Dans quelles villes livrez-vous actuellement ?', answer: 'Notre service de livraison couvre actuellement l\'ensemble de N\'Djamena (ainsi que Moundou et Sarh selon les options de transport). Inscrivez-vous à notre newsletter pour être informé de nos ouvertures.' },
  { question: 'Quel est le délai de livraison garanti ?', answer: 'Comptez 3 à 5 jours ouvrés après la confirmation de votre paiement. Pour les commandes urgentes, notre équipe peut organiser une livraison express — contactez-nous directement par WhatsApp pour en discuter.' },
  { question: 'Comment être sûr que ma famille a bien reçu le colis ?', answer: 'C\'est notre engagement phare : chaque livraison est accompagnée d\'une photo de preuve envoyée par WhatsApp ou email. Vous pouvez également suivre l\'avancement de votre commande en temps réel depuis votre espace client.' },
  { question: 'Quels moyens de paiement sont acceptés ?', answer: 'Nous acceptons les cartes bancaires Visa et Mastercard via la passerelle sécurisée Paystack.' },
  { question: 'Est-il possible d\'annuler une commande ?', answer: 'Oui, l\'annulation est gratuite tant que la préparation de votre colis n\'a pas débuté. Il vous suffit de nous contacter par email ou WhatsApp et nous procéderons au remboursement intégral sous 48h.' },
  { question: 'Les frais de livraison sont-ils inclus dans les prix ?', answer: 'Absolument. Les frais de livraison sont calculés et affichés de manière totalement transparente avant la validation de votre commande. Votre proche ne paiera pas de douane ou de frais caché.' },
]

useHead({ 
  title: 'Comment ça marche ? — Dounia Market',
  meta: [
    { name: 'description', content: 'Découvrez comment envoyer facilement des produits essentiels à votre famille au Tchad avec le service premium Dounia Market.' },
    { property: 'og:title', content: 'Comment fonctionne Dounia Market ?' }
  ]
})
</script>
