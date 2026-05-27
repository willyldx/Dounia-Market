<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="hero-gradient relative overflow-hidden pt-32 pb-24 border-b border-white/10">
      <div class="orb orb-amber absolute -right-40 -top-40 h-[500px] w-[500px] animate-float-slow opacity-20"></div>
      <div class="orb orb-warm absolute -bottom-20 -left-20 h-[300px] w-[300px] animate-float opacity-10"></div>
      
      <div class="container-main relative z-10 text-center">
        <div class="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
          <Heart class="h-4 w-4" />
          Notre Histoire
        </div>
        <h1 class="heading-hero mx-auto max-w-4xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Vous commandez ici.<br/>
          <span class="text-gradient-gold">Nous livrons là-bas.</span>
        </h1>
        <p class="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl">
          Dounia Market est le pont entre la diaspora tchadienne et leurs proches au pays. Faites vos courses en ligne depuis l'étranger, nous livrons directement votre famille à N'Djamena.
        </p>
      </div>
    </section>

    <!-- La Mission -->
    <section class="py-24 sm:py-32">
      <div class="container-main">
        <div class="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
          <div class="reveal-up">
            <h2 class="heading-section text-3xl sm:text-4xl">Plus qu'une boutique, <br/>un lien familial.</h2>
            <p class="mt-6 text-lg font-medium leading-relaxed text-muted-foreground">
              Nous savons à quel point il est important de soutenir sa famille restée au pays. Souvent, envoyer de l'argent ne suffit pas : il faut s'assurer que les besoins essentiels sont couverts.
              <br/><br/>
              C'est pourquoi nous avons créé Dounia Market. Vous choisissez les produits de qualité, et notre équipe sur place s'occupe de tout le reste, jusqu'à la remise en main propre.
            </p>
          </div>

          <div class="space-y-10 reveal-up">
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Store class="h-6 w-6" :stroke-width="1.5" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-foreground">Produits locaux & de qualité</h3>
              <p class="text-base font-medium leading-relaxed text-muted-foreground">
                Notre catalogue est constitué de produits stockés à N'Djamena, prêts à être livrés. Pas d'attente internationale interminable.
              </p>
            </div>
            
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheck class="h-6 w-6" :stroke-width="1.5" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-foreground">Livraison 100% sécurisée</h3>
              <p class="text-base font-medium leading-relaxed text-muted-foreground">
                Nos livreurs connaissent la ville. Nous remettons la commande en main propre et vous envoyons une preuve de livraison.
              </p>
            </div>
            
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <HeartHandshake class="h-6 w-6" :stroke-width="1.5" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-foreground">Service client dédié</h3>
              <p class="text-base font-medium leading-relaxed text-muted-foreground">
                Une équipe à votre écoute pour vous accompagner et résoudre le moindre imprévu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-24 pt-0">
      <div class="container-main max-w-4xl text-center">
        <div class="overflow-hidden rounded-3xl border border-border bg-[#faf8f5] p-10 shadow-premium sm:p-16 relative">
          <div class="orb orb-amber absolute -left-20 -top-20 h-60 w-60 opacity-30"></div>
          <div class="relative z-10">
            <h2 class="heading-section mb-6 text-3xl sm:text-4xl">Prêt à faire plaisir à vos proches ?</h2>
            <p class="mx-auto mb-10 max-w-xl text-lg font-medium text-muted-foreground">
              Découvrez notre sélection de produits essentiels, alimentaires et bien plus encore, livrables directement à N'Djamena.
            </p>
            <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <NuxtLink to="/catalogue" class="btn-primary">
                <span>Explorer le catalogue</span>
              </NuxtLink>
              <NuxtLink to="/comment-ca-marche" class="btn-outline">
                Voir comment ça marche
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Heart, Store, ShieldCheck, HeartHandshake } from 'lucide-vue-next'

useSeoMeta({
  title: 'À propos de nous | Dounia Market Tchad',
  description: 'Dounia Market est le pont entre la diaspora tchadienne et N\'Djamena. Découvrez notre mission : vous permettre de faire les courses pour vos proches au pays.',
  ogTitle: 'À propos | Dounia Market Tchad',
  ogDescription: 'Le service e-commerce dédié à la diaspora tchadienne pour soutenir leurs proches à N\'Djamena.',
})
</script>
