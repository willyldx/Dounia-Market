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
          Conditions Générales de Vente
        </h1>
        <p class="text-lg font-medium text-muted-foreground">
          Dernière mise à jour : {{ lastUpdated }}
        </p>
      </section>

      <!-- Contenu -->
      <div class="rounded-3xl border border-border bg-card p-8 shadow-premium sm:p-12 md:p-16">
        <div class="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-gold-700 hover:prose-a:text-gold-800 prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes conditions décrivent le fonctionnement de Dounia Market Tchad. Notre plateforme vous permet de commander en ligne des produits disponibles localement et de les faire livrer directement à un bénéficiaire basé à N'Djamena.
          </p>
          <p>
            Nous vous invitons à lire attentivement les informations présentées dans le récapitulatif de votre panier avant de valider toute commande.
          </p>

          <h2>Article 2 — Produits et disponibilité</h2>
          <p>
            Les produits affichés sont ceux référencés dans notre catalogue au moment de votre visite. Chaque fiche produit présente les informations détaillées, son prix, ainsi que sa disponibilité en stock localement.
          </p>
          <p>
            Dans le cas rare où un produit deviendrait indisponible après votre commande (lors de la préparation), notre équipe vous contactera immédiatement pour vous proposer une alternative ou un remboursement.
          </p>

          <h2>Article 3 — Prix et frais de livraison</h2>
          <p>
            Les prix des produits sont affichés clairement dans le catalogue et dans votre panier.
            Les frais de livraison dépendent du quartier de destination à N'Djamena et sont ajoutés et visibles avant le paiement final de votre commande.
          </p>

          <h2>Article 4 — Processus de Commande</h2>
          <p>
            Pour commander, il vous suffit de sélectionner vos articles, de renseigner l'identité et le numéro de téléphone local du bénéficiaire, ainsi que le quartier de livraison. Vous devrez ensuite vérifier le récapitulatif avant de procéder au paiement. Vous pourrez suivre l'état de votre livraison via votre espace client ou la page de Suivi.
          </p>

          <h2>Article 5 — Paiement sécurisé</h2>
          <p>
            Le règlement s'effectue en ligne via nos partenaires de paiement sécurisés. Aucune coordonnée bancaire n'est stockée sur nos serveurs.
          </p>

          <h2>Article 6 — Livraison locale</h2>
          <p>
            La livraison est assurée localement à N'Djamena, dans les quartiers couverts par notre service logistique. Le destinataire sera contacté au numéro fourni afin d'organiser la remise en main propre.
          </p>
          <p>
            Il est impératif que le numéro du bénéficiaire soit joignable. Nos livreurs peuvent demander une preuve de remise (photo) avec l'accord de ce dernier.
          </p>

          <h2>Article 7 — Modification ou annulation</h2>
          <p>
            Si vous souhaitez modifier ou annuler une commande, contactez immédiatement notre assistance via la page de Contact en fournissant votre référence. Toute annulation est possible tant que la commande n'a pas quitté notre centre de préparation.
          </p>

          <h2>Article 8 — Service Client & Réclamations</h2>
          <p>
            Notre équipe est à votre entière disposition. Pour toute question ou réclamation, utilisez notre formulaire de contact. Mentionnez votre référence de commande pour un traitement rapide.
          </p>

          <h2>Article 9 — Protection de vos données</h2>
          <p>
            Les informations relatives au bénéficiaire ne sont utilisées que dans le cadre exclusif de la préparation et de la livraison de votre commande. Pour plus de détails, consultez notre politique de confidentialité.
          </p>

          <h2>Article 10 — Évolution des conditions</h2>
          <p>
            Dounia Market Tchad se réserve le droit de mettre à jour ces conditions. Les conditions applicables à votre commande sont toujours celles en vigueur le jour de votre achat.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

useSeoMeta({
  title: 'Conditions Générales de Vente | Dounia Market Tchad',
  description: 'Consultez les conditions générales de vente de Dounia Market Tchad pour les commandes et livraisons à N\'Djamena.',
  robots: 'noindex, nofollow, noarchive',
})

const lastUpdated = '25 mai 2026'
</script>
