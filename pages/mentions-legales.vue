<template>
  <div class="min-h-screen bg-background pb-20 pt-10 sm:pt-14">
    <div class="container-main max-w-4xl">
      <!-- En-tête -->
      <nav class="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRight class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span class="text-foreground">Juridique</span>
      </nav>

      <section class="mb-10 rounded-3xl border border-border bg-[#faf8f5] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h1 class="heading-section mb-4 text-3xl sm:text-4xl md:text-5xl">
          Mentions Légales
        </h1>
        <p class="text-lg font-medium text-muted-foreground">
          Informations relatives au site Dounia Market Tchad
        </p>
      </section>

      <!-- Contenu -->
      <div class="rounded-3xl border border-border bg-card p-8 shadow-premium sm:p-12 md:p-16">
        <div class="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground/90 prose-a:text-gold-700 hover:prose-a:text-gold-800 prose-strong:text-foreground">
          <h2>1. Nom du service</h2>
          <p>
            Le site <strong>douniamarket.com</strong> opère sous le nom commercial
            <strong>Dounia Market Tchad</strong>. Ce service est exclusivement dédié à faciliter les commandes pour la diaspora tchadienne vers N'Djamena.
          </p>

          <h2>2. Éditeur et publication</h2>
          <p>
            Pour toute demande d'ordre légal ou commercial concernant ce site, vous pouvez nous contacter directement à l'adresse suivante :
            <strong>support@douniamarket.com</strong>.
          </p>

          <h2>3. Hébergement</h2>
          <p>
            Le site Dounia Market Tchad est hébergé sur des serveurs sécurisés garantissant une haute disponibilité et la sécurité des données échangées.
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments figurant sur notre site (textes, images, logos, charte graphique, code source) sont protégés par les lois sur la propriété intellectuelle. Toute reproduction, copie ou utilisation sans autorisation explicite préalable est strictement interdite.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Le respect de votre vie privée est une priorité absolue. Les informations collectées lors de vos commandes sont utilisées exclusivement pour assurer le bon déroulement de nos services (préparation et livraison locale). Pour en savoir plus, consultez notre
            <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink>.
          </p>

          <h2>6. Utilisation des cookies</h2>
          <p>
            Notre plateforme utilise des cookies pour assurer le bon fonctionnement de votre panier d'achat et la sécurité de votre compte (cookies strictement nécessaires). Nous utilisons également des outils de mesure d'audience optionnels pour améliorer nos services, qui ne sont activés qu'avec votre consentement. Modifiez vos choix sur la page
            <NuxtLink to="/cookies">Cookies et préférences</NuxtLink>.
          </p>

          <h2>7. Contactez-nous</h2>
          <p>
            Si vous avez la moindre question concernant ces mentions légales ou le fonctionnement du site, n'hésitez pas à nous écrire via notre
            <NuxtLink to="/contact">formulaire de contact</NuxtLink> ou à <strong>support@douniamarket.com</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

useSeoMeta({
  title: 'Mentions légales | Dounia Market Tchad',
  description: 'Informations juridiques concernant l\'éditeur et l\'hébergement du site Dounia Market Tchad.',
  robots: 'noindex, nofollow, noarchive',
})
</script>
