<template>
  <div class="bg-background min-h-screen pt-32 pb-24">
    <!-- Clean Minimalist Header -->
    <section class="max-w-4xl mx-auto px-6 mb-16 text-center">
      <nav class="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-8">
        <NuxtLink to="/" class="hover:text-foreground transition-colors">Accueil</NuxtLink>
        <ChevronRightIcon class="w-4 h-4" />
        <span class="text-foreground">Juridique</span>
      </nav>
      
      <h1 class="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6">
        Conditions Générales de Vente
      </h1>
      <p class="text-lg text-muted-foreground/80 font-medium">
        Dernière mise à jour : {{ lastUpdated }}
      </p>
    </section>

    <!-- Content -->
    <div class="container-main max-w-4xl mx-auto px-6">
      <div class="bg-card border border-border shadow-sm rounded-lg p-8 md:p-12">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-brand prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes conditions décrivent le parcours proposé par Dounia Market Tchad pour commander des produits
            disponibles localement et demander leur livraison à un bénéficiaire à N'Djamena.
          </p>
          <p>
            Le client est invité à lire les informations présentées dans son récapitulatif avant de valider une commande.
          </p>

          <h2>Article 2 — Produits et disponibilité</h2>
          <p>
            Les produits proposés sont ceux référencés dans le catalogue au moment de la consultation. La fiche produit
            présente les informations disponibles, notamment le produit, son prix affiché et son état de disponibilité.
          </p>
          <p>
            En cas d'indisponibilité identifiée avant la préparation, Dounia Market Tchad contacte le client afin de déterminer
            les suites possibles pour la commande.
          </p>

          <h2>Article 3 — Prix et frais de livraison</h2>
          <p>
            Les prix des produits sont présentés dans le catalogue et le parcours de commande.
            Les zones couvertes et frais de livraison applicables seront confirmés avant l'ouverture publique du service.
          </p>

          <h2>Article 4 — Processus de Commande</h2>
          <p>
            Le client renseigne le bénéficiaire, son adresse et un contact local utile à la livraison, puis vérifie le
            récapitulatif présenté avant toute validation. Une commande enregistrée peut être consultée depuis l'espace client
            et suivie au moyen de sa référence.
          </p>

          <h2>Article 5 — Modalités de finalisation</h2>
          <p>
            Les modalités permettant de finaliser une commande seront confirmées avant l'ouverture publique du service.
            Dounia Market Tchad n'annonce sur cette page aucun prestataire ni moyen spécifique.
          </p>

          <h2>Article 6 — Livraison locale</h2>
          <p>
            La livraison sera proposée localement à N'Djamena selon les zones couvertes confirmées avant l'ouverture
            publique du service. Les frais applicables seront communiqués dans ce même cadre.
          </p>
          <p>
            Le bénéficiaire doit pouvoir être joint au numéro communiqué par le client afin de faciliter la livraison.
          </p>

          <h2>Article 7 — Modification ou annulation</h2>
          <p>
            Pour demander une modification ou une annulation, le client contacte l'assistance avec sa référence.
            Les possibilités dépendent de l'état de préparation ou de livraison de la commande et des conditions confirmées au client.
          </p>

          <h2>Article 8 — Réclamations</h2>
          <p>
            Toute question ou réclamation peut être adressée par la page de contact en indiquant la référence de commande,
            sans publier les coordonnées du bénéficiaire.
          </p>
          <p>
            L'équipe examine la demande et informe le client des éléments nécessaires à son traitement.
          </p>

          <h2>Article 9 — Confidentialité</h2>
          <p>
            Les informations du bénéficiaire sont destinées au traitement de la commande et à l'organisation de sa
            livraison locale. Les détails sont présentés dans la politique de confidentialité.
          </p>

          <h2>Article 10 — Évolution des conditions</h2>
          <p>
            Dounia Market Tchad peut mettre à jour ces conditions lorsque les modalités opérationnelles du service sont précisées.
            La version affichée au moment de la validation est celle présentée au client.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Conditions générales',
  description: 'Consultez les conditions de Dounia Market Tchad pour les commandes et livraisons locales à N\'Djamena.',
  ogTitle: 'Conditions générales | Dounia Market Tchad',
  ogDescription: 'Conditions applicables au parcours de commande et à la livraison locale.',
})

const lastUpdated = '25 mai 2026'
</script>
