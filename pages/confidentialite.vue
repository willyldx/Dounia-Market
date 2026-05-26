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
        Politique de Confidentialité
      </h1>
      <p class="text-lg text-muted-foreground/80 font-medium">
        Dernière mise à jour : {{ lastUpdated }}
      </p>
    </section>

    <!-- Content -->
    <div class="container-main max-w-4xl mx-auto px-6">
      <div class="bg-card border border-border shadow-sm rounded-lg p-8 md:p-12">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-brand prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <p class="lead font-medium text-foreground text-xl border-b border-border pb-8 mb-8">
            Dounia Market Tchad traite les informations nécessaires à votre compte, à vos commandes et à la livraison locale
            de vos bénéficiaires à N'Djamena. Cette page explique les informations concernées et leur utilisation.
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Dounia Market Tchad est responsable des données collectées via son site et son espace client. Pour une demande
            liée à vos informations, utilisez la page de contact du site.
          </p>

          <h2>2. Données collectées</h2>
          <p>Selon votre utilisation du service, nous pouvons recueillir :</p>
          
          <h3>2.1 Compte et commande</h3>
          <ul>
            <li>Votre nom, votre adresse email et votre numéro de contact lorsque vous le fournissez.</li>
            <li>Les références, produits et statuts associés à vos commandes.</li>
          </ul>

          <h3>2.2 Bénéficiaire et livraison</h3>
          <ul>
            <li>Le nom et le téléphone du bénéficiaire.</li>
            <li>L'adresse, le quartier et les repères fournis pour une livraison à N'Djamena.</li>
          </ul>

          <h3>2.3 Données techniques</h3>
          <ul>
            <li>Informations nécessaires au fonctionnement, à la sécurité et au diagnostic du site.</li>
            <li>Données de session et de panier indispensables à l'utilisation du parcours.</li>
            <li>Données de consultation de pages ou produits uniquement si vous acceptez les traceurs optionnels.</li>
          </ul>

          <h2>3. À quoi servent ces données ?</h2>
          <p>Les informations recueillies peuvent servir à :</p>
          <ul>
            <li>Créer et administrer votre espace client.</li>
            <li>Préparer une commande et organiser sa livraison locale à N'Djamena selon les zones couvertes.</li>
            <li>Joindre le bénéficiaire lorsque cela est nécessaire pour réaliser la livraison.</li>
            <li>Vous permettre de consulter le statut d'une commande et d'obtenir de l'assistance.</li>
            <li>Assurer le fonctionnement et la sécurité du site.</li>
          </ul>

          <h2>4. Accès aux informations</h2>
          <p>Les informations sont accessibles uniquement dans la mesure nécessaire au service concerné :</p>
          <ul>
            <li>L'équipe Dounia Market Tchad chargée du traitement des commandes et de l'assistance.</li>
            <li>Les personnes intervenant dans la livraison locale, pour les seules coordonnées utiles à cette livraison.</li>
            <li>Les prestataires techniques nécessaires au fonctionnement du site, selon les accords applicables.</li>
          </ul>

          <h2>5. Suivi de commande et confidentialité</h2>
          <p>
            La page publique de suivi demande uniquement une référence de commande. N'y saisissez pas le nom, le téléphone
            ou l'adresse d'un bénéficiaire. Les informations détaillées restent accessibles depuis votre espace client.
          </p>

          <h2>6. Vos demandes</h2>
          <p>Vous pouvez contacter Dounia Market Tchad afin de demander l'accès, la correction ou la suppression d'informations vous concernant, dans les limites applicables à la gestion d'une commande :</p>
          <ul>
            <li>Indiquez l'adresse email associée à votre compte dans votre demande.</li>
            <li>N'envoyez les coordonnées du bénéficiaire que si elles sont nécessaires au traitement de votre demande.</li>
          </ul>
          <p>
            Envoyez votre demande depuis la page de contact afin qu'elle soit orientée vers l'équipe concernée.
          </p>

          <h2>7. Conservation et sécurité</h2>
          <p>
            Dounia Market Tchad met en œuvre des mesures adaptées pour limiter l'accès non autorisé aux informations. Les données
            sont conservées pendant la durée nécessaire au traitement du compte, des commandes, de l'assistance et des obligations applicables.
          </p>

          <h2>8. Cookies, audience et préférences</h2>
          <p>
            Les cookies et stockages strictement nécessaires peuvent servir à la connexion, au panier et aux préférences
            choisies volontairement. Dounia Market Tchad n'effectue pas de géolocalisation automatique au lancement :
            l'adresse de livraison est celle que vous saisissez dans le formulaire.
          </p>
          <p>
            PostHog et la personnalisation fondée sur les produits consultés sont désactivés tant que vous ne les avez pas
            acceptés. Vous pouvez accepter ou refuser ces traceurs avec la même facilité et modifier votre choix sur la
            page <NuxtLink to="/cookies">Cookies et préférences</NuxtLink>.
          </p>
          <p>
            Cette politique pourra être mise à jour si le service ou ses prestataires évoluent ; la date affichée en tête
            de page identifie la version publiée.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Politique de confidentialité',
  description: 'Informations sur les données de compte, de commande, de livraison locale et le consentement aux traceurs de Dounia Market Tchad.',
  ogTitle: 'Politique de confidentialité | Dounia Market Tchad',
  ogDescription: 'Informations sur les données et le consentement aux traceurs de Dounia Market Tchad.',
})

const lastUpdated = '26 mai 2026'
</script>
