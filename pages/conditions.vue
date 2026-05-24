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
        Dernière mise à jour : {{ currentDate }}
      </p>
    </section>

    <!-- Content -->
    <div class="container-main max-w-4xl mx-auto px-6">
      <div class="bg-card border border-border shadow-sm rounded-xl p-8 md:p-12">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-heading:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground prose-ul:font-medium prose-ul:text-muted-foreground/90">
          
          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV ») définissent les droits et obligations 
            de la société Dounia Market (ci-après « le Prestataire ») et de toute personne physique ou morale 
            (ci-après « le Client ») passant commande sur la plateforme sécurisée Dounia Market.com.
          </p>
          <p>
            Dounia Market est une plateforme de commerce en ligne haut de gamme spécialisée dans la vente et l’acheminement 
            de biens essentiels et qualitatifs depuis l’international vers le Tchad, destinée principalement à la diaspora 
            souhaitant garantir le meilleur à ses proches sur place.
          </p>

          <h2>Article 2 — Produits et Services</h2>
          <p>
            Les produits proposés sont ceux expressément référencés sur le site Dounia Market.com au moment de la 
            consultation. Chaque produit fait l’objet d’une fiche descriptive détaillée.
          </p>
          <p>
            Dounia Market s'engage à expédier des produits strictement neufs, originaux et correspondants aux meilleurs standards. Les photographies illustrant les produits sont de haute fidélité. Toutefois, de légères variations de packaging peuvent exister selon les arrivages à N'Djamena.
          </p>

          <h2>Article 3 — Tarification Transparente</h2>
          <p>
            L’ensemble des prix sont libellés en Euros (€) avec une indication de conversion en temps réel dans d'autres devises (FCFA, USD, CAD, GBP) à titre informatif. Les montants affichés sont définitifs, toutes taxes comprises (TTC).
          </p>
          <p>
            <strong>Garantie Zéro Surprise :</strong> Les prix du catalogue incluent d'office l'assurance, le dédouanement et l'acheminement local. Le destinataire final au Tchad n'aura absolument aucune somme à débourser à la réception du colis.
          </p>

          <h2>Article 4 — Processus de Commande</h2>
          <p>
            La validation définitive de la commande via notre portail vaut acceptation pleine et entière des présentes CGV. 
            Un email de confirmation comportant les détails de préparation est automatiquement envoyé au Client. Un numéro de suivi unique est attribué pour tracer la progression logistique.
          </p>

          <h2>Article 5 — Modalités de Paiement Sécurisé</h2>
          <p>Le Client peut régler sa commande par des moyens hautement sécurisés :</p>
          <ul>
            <li>Cartes bancaires internationales (Visa, Mastercard)</li>
            <li>Mobile Money (Services compatibles en Afrique et hors du continent)</li>
          </ul>
          <p>
            L’intégralité des transactions est certifiée, cryptée (SSL 256-bit) et opérée par notre partenaire financier Paystack. 
            Aucune information bancaire en clair n’est stockée sur les serveurs de Dounia Market.
          </p>

          <h2>Article 6 — Logistique et Livraison</h2>
          <p>
            Les livraisons en main propre sont assurées prioritairement à N'Djamena (Tchad). Le délai logistique standard (préparation, expédition, douane et livraison) est de <strong>3 à 5 jours ouvrés</strong> à compter de la confirmation du paiement.
          </p>
          <p>
            <strong>La Preuve Dounia Market :</strong> Une photographie certifiant la remise du colis au destinataire final est systématiquement prise par nos agents sur place (sous réserve de consentement) et téléversée dans l'espace client de l'expéditeur, conférant une preuve d'exécution totale du contrat de vente.
          </p>

          <h2>Article 7 — Droit de Rétractation</h2>
          <p>
            Compte tenu de la nature internationale de la logistique, de la gestion des douanes et du fret aérien express, le droit de rétractation ne peut s’exercer une fois que la commande a été expédiée et traitée aux douanes.
          </p>
          <p>
            Toutefois, avant l'expédition physique (statut "En Préparation"), le Client dispose de la faculté d’annuler sa commande sans frais depuis le service client. Le remboursement intégral est émis sous 48 à 72 heures ouvrées.
          </p>

          <h2>Article 8 — Réclamations</h2>
          <p>
            Toute réclamation doit être adressée dans un délai stricts de 48 heures suivant la preuve de remise du colis, via notre support prioritaire : <strong>contact@Dounia Market.com</strong>.
          </p>
          <p>
            Si le produit s'avère endommagé pendant le fret, Dounia Market s'engage à enquêter immédiatement sur simple présentation de preuves photographiques de la part du client ou du destinataire.
          </p>

          <h2>Article 9 — Confidentialité</h2>
          <p>
            Les données personnelles (dont l'identité et les coordonnées du destinataire au Tchad) sont traitées avec le plus haut niveau de confidentialité, et ne sont transmises qu'à notre cellule logistique locale dans le seul but de réussir l'acheminement physique du colis.
          </p>

          <h2>Article 10 — Droit Applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit du commerce européen et français. En cas de litige, notre service client privilégiera toujours une résolution amiable rapide.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Conditions Générales de Vente | Dounia Market',
  description: 'Consultez les conditions générales de vente (CGV) de Dounia Market. Une transparence totale sur la livraison vers N\'Djamena.',
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
/* Any required strict clean styling */
</style>
