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
        Dernière mise à jour : {{ currentDate }}
      </p>
    </section>

    <!-- Content -->
    <div class="container-main max-w-4xl mx-auto px-6">
      <div class="bg-card border border-border shadow-premium rounded-[2rem] p-8 md:p-16 glass-strong">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-brand prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <p class="lead font-medium text-foreground text-xl border-b border-border pb-8 mb-8">
            Chez Dounia Market, la sécurisation de vos données personnelles est le socle de notre relation de confiance. 
            La présente politique décrit de manière transparente comment nous collectons, cryptons, 
            et protégeons vos informations ainsi que celles de vos destinataires au Tchad.
          </p>

          <h2>1. Cadre Légal et Responsabilité</h2>
          <p>
            Le traitement de vos données est assuré exclusivement par la direction de Dounia Market, certifiée en conformité avec les standards du commerce électronique sécurisé. Vous pouvez joindre le responsable de la protection des données à : <strong>contact@Dounia Market.com</strong>.
          </p>

          <h2>2. Données strictement collectées</h2>
          <p>Dans le seul but d'accomplir notre mission logistique, nous recueillons :</p>
          
          <h3>2.1 Données logistiques essentielles</h3>
          <ul>
            <li>Vos coordonnées d'expéditeur (Nom, email, numéro de suivi)</li>
            <li>Les coordonnées du destinataire au Tchad (Nom, Contact local, Quartier/Adresse pour la livraison physique)</li>
          </ul>

          <h3>2.2 Données de transaction inviolables</h3>
          <ul>
            <li>L'historique de vos expéditions pour votre suivi</li>
            <li>Les métadonnées de paiement (<strong>Note : Dounia Market n'a jamais accès à votre carte bancaire</strong>, tout est directement géré par cryptage asymétrique via Paystack).</li>
          </ul>

          <h3>2.3 Données de fiabilité technique</h3>
          <ul>
            <li>Adresse IP de connexion (pour contrer la fraude bancaire)</li>
            <li>Logs de sécurité et traceurs de panier d'achat minimums</li>
          </ul>

          <h2>3. À quoi servent ces données ?</h2>
          <p>L'utilisation de vos informations est strictement cadrée :</p>
          <ul>
            <li>Dédouaner et acheminer vos colis par voie aérienne</li>
            <li>Permettre à nos agents logistiques à N'Djamena de joindre votre famille pour planifier la remise physique</li>
            <li>Intégrer les photographies de remise dans votre espace client privé</li>
            <li>Garantir la sécurité financière de votre acte d'achat</li>
          </ul>

          <h2>4. Sous-traitants Ultra-Sécurisés</h2>
          <p>Vos données sont isolées et uniquement partagées en flux chiffrés avec l'infrastructure indispensable au fonctionnement :</p>
          <ul>
            <li><strong>Infrastructure Cloud Dounia Market</strong> : Vos informations personnelles sont encapsulées sur nos Serveurs Privés Virtuels (VPS) sous juridiction Européenne (RGPD).</li>
            <li><strong>Réseau Frontal</strong> : Amazon Web Services (AWS) pour la sécurisation des connexions et la lutte contre les attaques cybernétiques.</li>
            <li><strong>Traitement Financier</strong> : Paystack, garantissant le chiffrement PCI-DSS de bout en bout de vos devises et cartes bancaires.</li>
            <li><strong>Cellule Terrain (Tchad)</strong> : Seules les données d'acheminement (nom et numéro de téléphone du destinataire) sont débloquées pour notre équipe logistique d'intervention locale.</li>
          </ul>

          <h2>5. Droit d'effacement et de contrôle</h2>
          <p>En conformité absolue avec le RGPD Européen, vous restez l'unique propriétaire de vos données de navigation et d'identité :</p>
          <ul>
            <li><strong>Droit de Suppression ("Droit à l'oubli")</strong> : Nous purgerons vos données, ainsi que les photographies de remise, sur simple demande.</li>
            <li><strong>Droit d'Accès</strong> : Obtenez une copie complète des logs liés à votre compte.</li>
          </ul>
          <p>
            Actionnez vos droits en écrivant à <strong>contact@Dounia Market.com</strong>. Traitement garanti sous 48 heures ouvrées.
          </p>

          <h2>6. Conservation Militaire des Données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques drastiques (pare-feux stricts, certificats SSL/TLS, isolation des bases de données de production) pour assurer qu'aucune compromission tierce ne soit possible. 
          </p>
          <ul>
            <li><strong>Données bancaires</strong> : Jamais stockées.</li>
            <li><strong>Données logistiques</strong> : Archivées puis purgées 3 ans après la dernière commande (durée légale pour litiges douaniers).</li>
          </ul>

          <h2>7. Régulation des Cookies</h2>
          <p>
            Nous refusons le profilage publicitaire agressif. Les cookies utilisés servent en écrasante majorité à garantir la sécurité de votre paiement et la persistance de votre panier de cadeaux.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Politique de Confidentialité | Dounia Market',
  description: 'Procédures de sécurité, de cryptage et de gestion de vos données personnelles par Dounia Market.',
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<style scoped>
/* Styling matches the clean luxury conditions.vue page */
</style>
