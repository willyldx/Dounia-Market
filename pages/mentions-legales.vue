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
        Mentions Légales
      </h1>
      <p class="text-lg text-muted-foreground/80 font-medium">
        Informations légales relatives à la plateforme Dounia Market
      </p>
    </section>

    <!-- Content -->
    <div class="container-main max-w-4xl mx-auto px-6">
      <div class="bg-card border border-border shadow-sm rounded-lg p-8 md:p-12">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-brand prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <h2>1. Éditeur du Site</h2>
          <p>La plateforme Dounia Market est éditée et gérée par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> Dounia Market</li>
            <li><strong>Forme juridique :</strong> [À compléter]</li>
            <li><strong>Capital social :</strong> [À compléter]</li>
            <li><strong>Siège social :</strong> [Adresse à compléter], France</li>
            <li><strong>SIRET :</strong> [À compléter]</li>
            <li><strong>RCS :</strong> [À compléter]</li>
            <li><strong>TVA Intracommunautaire :</strong> [À compléter]</li>
            <li><strong>Email de contact :</strong> contact@douniamarket.com</li>
          </ul>

          <h2>2. Directeur de la Publication</h2>
          <p>
            Le directeur de la publication est <strong>[Nom du responsable]</strong>, agissant en qualité de CEO.
          </p>

          <h2>3. Hébergement des Infrastructures</h2>
          <p>Les informations relatives à l'hébergeur et à sa localisation seront complétées avant l'ouverture publique du service.</p>

          <h2>4. Propriété Intellectuelle</h2>
          <p>
            L’intégralité du contenu de ce site (charte graphique, photographies, vidéos, logos, icônes, animations, 
            code informatique, etc.) est la propriété exclusive de Dounia Market et bénéficie de la protection conférée par les lois françaises et internationales 
            relatives à la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, extraction, modification ou publication des éléments constitutifs de Dounia Market, 
            quel que soit le procédé matériel ou digital utilisé, est strictement interdite sans autorisation écrite formelle de la direction.
          </p>

          <h2>5. Traitement des Données Personnelles</h2>
          <p>
            Vos données personnelles, incluant les informations nécessaires à la livraison du destinataire, sont traitées pour exécuter la commande et assurer le support.
          </p>
          <p>
            Vos données ne sont ni vendues ni cédées à des courtiers. Vous bénéficiez d’un droit d’accès, de rectification, 
            et de suppression selon les conditions applicables. Pour l'exercer, adressez votre requête à : <strong>contact@douniamarket.com</strong>.
          </p>
          <p>
            Pour de plus amples informations sur nos processus de sécurisation, consultez notre 
            <NuxtLink to="/confidentialite">Politique de Confidentialité</NuxtLink>.
          </p>

          <h2>6. Traçabilité (Cookies)</h2>
          <p>
            La plateforme utilise un minimum de traceurs et de cookies pour sécuriser vos sessions e-commerce, maintenir les paniers d'achat actifs, et fluidifier l'expérience. Vous pouvez purger ces traceurs à tout moment depuis les réglages natifs de votre navigateur.
          </p>

          <h2>7. Responsabilités</h2>
          <p>
            Dounia Market effectue un audit régulier de l'ensemble de la chaine logistique et de son offre numérique. Toutefois, des erreurs typographiques, des omissions techniques ou des dysfonctionnements du réseau intercontinental peuvent survenir hors de l'emprise de la direction. L'utilisation du service vaut acceptation de nos conditions commerciales.
          </p>

          <h2>8. Droit Applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de 
            litige, et seulement après l'épuisement de toute procédure de conciliation amiable engagée avec notre support, 
            les tribunaux français seront reconnus comme seuls compétents.
          </p>

          <h2>9. Contacter le Service Légal</h2>
          <p>
            Pour toute injonction ou requête administrative :
          </p>
          <ul>
            <li>Par email : <strong>contact@douniamarket.com</strong></li>
            <li>En ligne : <NuxtLink to="/contact">Formulaire de demande légale</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Mentions Légales | Dounia Market',
  description: 'Mentions légales et détails concernant l\'éditeur et l\'hébergeur de la plateforme Dounia Market.',
})
</script>

<style scoped>
/* Styling matches the clean luxury conditions.vue page */
</style>
