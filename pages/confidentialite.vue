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
          Politique de Confidentialité
        </h1>
        <p class="text-lg font-medium text-muted-foreground">
          Dernière mise à jour : {{ lastUpdated }}
        </p>
      </section>

      <!-- Contenu -->
      <div class="rounded-3xl border border-border bg-card p-8 shadow-premium sm:p-12 md:p-16">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-amber-700 hover:prose-a:text-amber-800 prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <p class="lead font-medium text-foreground text-xl border-b border-border pb-8 mb-8">
            Chez Dounia Market, nous prenons la protection de vos données très au sérieux. Cette page vous explique de manière transparente quelles informations nous collectons et comment nous les utilisons pour garantir la livraison à vos proches à N'Djamena.
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Dounia Market Tchad est responsable des données collectées via son site et son espace client. Pour toute demande liée à vos informations personnelles, vous pouvez utiliser la page de contact du site.
          </p>

          <h2>2. Données collectées</h2>
          <p>Afin de vous fournir le meilleur service, nous recueillons certaines informations essentielles :</p>
          
          <h3>2.1 Votre compte et vos commandes</h3>
          <ul>
            <li>Votre nom, votre adresse email et votre numéro de contact.</li>
            <li>L'historique, les références et les statuts de vos commandes.</li>
          </ul>

          <h3>2.2 Bénéficiaire et livraison</h3>
          <ul>
            <li>Le nom et le numéro de téléphone local du bénéficiaire à N'Djamena.</li>
            <li>Le quartier de livraison et toute indication utile (repère) fournie par vos soins.</li>
          </ul>

          <h3>2.3 Données techniques</h3>
          <ul>
            <li>Des informations nécessaires au bon fonctionnement et à la sécurité de notre plateforme.</li>
            <li>Les données liées à votre panier d'achat.</li>
            <li>Les données de navigation (uniquement si vous acceptez les cookies analytiques).</li>
          </ul>

          <h2>3. À quoi servent ces données ?</h2>
          <p>Nous n'utilisons vos informations que dans le but de :</p>
          <ul>
            <li>Gérer votre espace client et sécuriser vos accès.</li>
            <li>Préparer minutieusement votre commande à N'Djamena.</li>
            <li>Permettre à nos livreurs de contacter le bénéficiaire pour remettre le colis en main propre.</li>
            <li>Vous fournir un suivi détaillé de votre commande.</li>
            <li>Améliorer en continu notre plateforme et nos services.</li>
          </ul>

          <h2>4. Accès restreint à vos informations</h2>
          <p>Vos données sont protégées et ne sont accessibles qu'aux personnes en ayant strictement besoin :</p>
          <ul>
            <li>L'équipe Dounia Market Tchad en charge de la préparation et du service client.</li>
            <li>Nos livreurs de confiance (uniquement le nom, le numéro et l'adresse du bénéficiaire).</li>
            <li>Nos partenaires de paiement sécurisé (qui gèrent eux-mêmes vos données bancaires de façon cryptée).</li>
          </ul>

          <h2>5. Page de Suivi public</h2>
          <p>
            Notre page publique de "Suivi" ne demande qu'une référence de commande pour afficher une jauge de progression. Aucune donnée personnelle (nom, adresse, téléphone) n'y est affichée publiquement.
          </p>

          <h2>6. Vos droits</h2>
          <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour l'exercer :</p>
          <ul>
            <li>Contactez-nous via le formulaire en ligne en utilisant l'adresse email de votre compte.</li>
            <li>Notre équipe traitera votre demande dans les meilleurs délais.</li>
          </ul>

          <h2>7. Durée de conservation et sécurité</h2>
          <p>
            Nous mettons en œuvre des protocoles de sécurité stricts pour protéger vos données contre tout accès non autorisé. Vos informations sont conservées pendant la durée nécessaire à la gestion de vos commandes et pour répondre à nos obligations légales.
          </p>

          <h2>8. Traceurs et Cookies</h2>
          <p>
            Nous utilisons des cookies essentiels pour le bon fonctionnement de votre panier et de votre compte. Les outils de mesure d'audience (comme PostHog) ne sont activés qu'avec votre consentement explicite. Vous pouvez modifier vos préférences à tout moment sur la page <NuxtLink to="/cookies">Cookies et préférences</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

useSeoMeta({
  title: 'Politique de confidentialité | Dounia Market Tchad',
  description: 'Découvrez comment Dounia Market protège vos données personnelles et celles de vos bénéficiaires à N\'Djamena.',
  robots: 'noindex, nofollow, noarchive',
})

const lastUpdated = '26 mai 2026'
</script>
