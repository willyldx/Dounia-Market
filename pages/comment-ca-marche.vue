<template>
  <div class="bg-background min-h-screen">
    <!-- Hero (Cinematic) -->
    <section class="relative pt-32 pb-40 overflow-hidden text-center flex flex-col items-center justify-center">
      <!-- Background Image with Heavy Cinematic Overlay for perfect text contrast -->
      <NuxtImg src="/hero-howto.png" alt="Comment ça marche" class="absolute inset-0 w-full h-full object-cover" loading="eager" quality="80" format="webp" sizes="100vw" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
      
      <div class="container-main relative z-10 mt-10">
        <span 
          v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }"
          class="inline-flex px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md"
        >Notre Processus</span>
        <h1 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          Comment ça <span class="text-accent">marche</span> ?
        </h1>
        <p 
          v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md"
        >
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
                <span class="md:hidden w-12 h-12 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-lg shadow-md shrink-0">
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
            
            <!-- Visual side (Sleek monochrome cards) -->
            <div :class="{ 'md:order-1': i % 2 === 1 }">
              <div class="bg-card rounded-[2rem] p-12 text-center border border-border shadow-sm hover:shadow-premium hover:border-border/80 transition-all duration-300 group glass-strong">
                <div class="w-24 h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-border group-hover:scale-110 group-hover:bg-muted transition-all duration-500">
                   <component :is="step.icon" class="w-10 h-10 text-foreground" />
                </div>
                <p class="text-xl font-bold text-foreground">{{ step.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nouveau Design FAQ -->
    <section class="py-32 bg-background">
      <div class="container-main max-w-4xl">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Des questions ?</h2>
          <p class="text-xl text-muted-foreground font-medium">Tout ce que vous devez savoir sur le processus d'expédition.</p>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(faq, i) in faqs" :key="i" 
            class="bg-muted/30 rounded-2xl overflow-hidden transition-all duration-300 border border-border"
            :class="openFaq === i ? 'border-border/80 shadow-sm' : ''"
          >
            <button @click="openFaq = openFaq === i ? null : i" class="w-full p-6 text-left flex justify-between items-center gap-4 group">
              <span class="font-bold text-lg text-foreground group-hover:text-muted-foreground transition-colors">{{ faq.question }}</span>
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all border border-border"
                :class="openFaq === i ? 'bg-brand text-brand-foreground rotate-180 border-brand' : 'bg-card text-muted-foreground'"
              >
                <ChevronDown class="w-5 h-5 transition-transform" />
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
              <div v-if="openFaq === i" class="px-6 pb-8 text-muted-foreground font-medium leading-relaxed overflow-hidden">
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
          class="bg-brand rounded-[3rem] p-12 md:p-24 relative overflow-hidden"
        >
          <div class="absolute inset-0 opacity-10 bg-[url('https://api.spencerai.tech/storage/textures/noise.png')]"></div>
          <div class="relative z-10">
            <h2 class="text-4xl md:text-5xl font-black text-brand-foreground mb-6 tracking-tight">Prêt à envoyer un sourire ?</h2>
            <p class="text-xl text-brand-foreground/70 mb-12 max-w-2xl mx-auto font-medium">
              Rejoignez des centaines de familles qui font déjà confiance à Dounia Market pour le lien avec leurs proches.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/catalogue" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-accent text-brand-foreground font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-premium glow-accent">
                Voir le catalogue premium
              </NuxtLink>
              <NuxtLink to="/contact" class="inline-flex flex-col items-center justify-center px-10 py-5 bg-white/10 text-brand-foreground font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
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
      'Cartes bancaires & Mobile Money acceptés',
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
  { question: 'Quels moyens de paiement sont acceptés ?', answer: 'Nous acceptons : les cartes bancaires (Visa, Mastercard), le Mobile Money International via Paystack (MTN, Orange Money), le virement bancaire, et bien sûr le Mobile Money local tchadien (Airtel Money et Moov Africa).' },
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
