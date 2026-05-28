<template>
  <div class="min-h-screen bg-background">
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-border/70 py-16 sm:py-24">
      <div class="container-main text-center">
        <div class="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-700">
          <Heart class="h-4 w-4" />
          Notre histoire
        </div>
        <h1 class="heading-hero mx-auto max-w-4xl text-foreground">
          Vous commandez ici.<br/>
          <span class="text-gold-700">Nous livrons là-bas.</span>
        </h1>
        <p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Dounia Market relie la diaspora tchadienne à ceux qui comptent, restés au pays. Vous faites vos courses en ligne depuis l'étranger ; nous nous chargeons de livrer votre famille à N'Djamena.
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
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-gold-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <Store class="h-6 w-6" :stroke-width="1.5" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-foreground">Produits locaux & de qualité</h3>
              <p class="text-base font-medium leading-relaxed text-muted-foreground">
                Notre catalogue est constitué de produits stockés à N'Djamena, prêts à être livrés. Pas d'attente internationale interminable.
              </p>
            </div>
            
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-gold-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                <ShieldCheck class="h-6 w-6" :stroke-width="1.5" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-foreground">Livraison 100% sécurisée</h3>
              <p class="text-base font-medium leading-relaxed text-muted-foreground">
                Nos livreurs connaissent la ville. Nous remettons la commande en main propre et vous envoyons une preuve de livraison.
              </p>
            </div>
            
            <div class="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-gold-200 hover:shadow-premium">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
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
        <div class="overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-premium sm:p-16">
          <h2 class="heading-section mb-6 text-3xl sm:text-4xl">Un geste pour ceux qui comptent</h2>
          <p class="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Parcourez notre sélection — essentiels, épicerie, et bien d'autres choses du quotidien — à faire livrer directement à N'Djamena.
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
