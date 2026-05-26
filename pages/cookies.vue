<template>
  <div class="min-h-screen bg-background pb-20 pt-24 sm:pt-28">
    <section class="mx-auto mb-10 max-w-4xl px-4 text-center sm:px-6">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Vie privée</p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Cookies et préférences</h1>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Dounia Market Tchad utilise les stockages indispensables au panier et à la connexion.
        Les traceurs de mesure d'audience et de personnalisation ne sont activés qu'après votre accord.
      </p>
    </section>

    <main class="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
      <section class="rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 class="text-lg font-semibold text-foreground">Votre choix</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Statut actuel : <strong class="text-foreground">{{ consentLabel }}</strong>.
          Vous pouvez modifier ce choix à tout moment.
        </p>
        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" class="h-11 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90" @click="accept">
            Accepter les traceurs optionnels
          </button>
          <button type="button" class="h-11 rounded-md border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-muted" @click="reject">
            Refuser les traceurs optionnels
          </button>
        </div>
      </section>

      <section class="rounded-lg border border-border bg-card p-5 sm:p-7">
        <h2 class="text-lg font-semibold text-foreground">Stockages utilisés</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
          Il n'y a qu'une catégorie optionnelle au lancement : mesure d'audience et personnalisation associée.
          Aucun pays n'est déduit automatiquement de votre adresse IP.
        </p>
        <div class="mt-5 overflow-x-auto">
          <table class="min-w-[680px] w-full text-left text-sm">
            <thead>
              <tr class="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th class="pb-3 pr-4 font-semibold">Nom</th>
                <th class="pb-3 pr-4 font-semibold">Finalité</th>
                <th class="pb-3 pr-4 font-semibold">Stockage / durée</th>
                <th class="pb-3 font-semibold">Consentement</th>
              </tr>
            </thead>
            <tbody class="text-muted-foreground">
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">tchadbox_auth_token</td>
                <td class="py-4 pr-4">Connexion sécurisée à votre compte</td>
                <td class="py-4 pr-4">Cookie, jusqu'à 30 jours</td>
                <td class="py-4">Nécessaire</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">tchadbox-cart</td>
                <td class="py-4 pr-4">Conserver le panier demandé par l'utilisateur</td>
                <td class="py-4 pr-4">Stockage local, jusqu'à suppression par le navigateur</td>
                <td class="py-4">Nécessaire au panier</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">tchadbox-favorites</td>
                <td class="py-4 pr-4">Conserver les favoris choisis par l'utilisateur</td>
                <td class="py-4 pr-4">Stockage local, jusqu'à suppression par le navigateur</td>
                <td class="py-4">Fonction demandée par l'utilisateur</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">tchadbox_currency / tchadbox_country</td>
                <td class="py-4 pr-4">Mémoriser une préférence choisie volontairement</td>
                <td class="py-4 pr-4">Stockage local, jusqu'à suppression par le navigateur</td>
                <td class="py-4">Préférence fonctionnelle</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">dounia_analytics_consent</td>
                <td class="py-4 pr-4">Mémoriser accepter ou refuser</td>
                <td class="py-4 pr-4">Stockage local, 12 mois</td>
                <td class="py-4">Nécessaire au respect du choix</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">chunk-reload-*</td>
                <td class="py-4 pr-4">Éviter une boucle de rechargement en cas d'erreur technique</td>
                <td class="py-4 pr-4">Stockage de session, effacé à la fin de la session</td>
                <td class="py-4">Sécurité de fonctionnement</td>
              </tr>
              <tr class="border-b border-border/70">
                <td class="py-4 pr-4 font-mono text-xs text-foreground">ph_*</td>
                <td class="py-4 pr-4">Mesure d'audience via PostHog</td>
                <td class="py-4 pr-4">Cookie / stockage local, selon configuration PostHog; supprimé au refus</td>
                <td class="py-4 font-medium text-foreground">Accord requis</td>
              </tr>
              <tr>
                <td class="py-4 pr-4 font-mono text-xs text-foreground">tchadbox_pulse</td>
                <td class="py-4 pr-4">Personnaliser les suggestions à partir des produits consultés</td>
                <td class="py-4 pr-4">Cookie, 30 jours; supprimé au refus</td>
                <td class="py-4 font-medium text-foreground">Accord requis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground sm:p-7">
        <h2 class="text-lg font-semibold text-foreground">Prestataire optionnel</h2>
        <p class="mt-2">
          PostHog est chargé uniquement après acceptation afin de mesurer la consultation des pages.
          Le refus conserve l'accès au catalogue, au panier et à la connexion.
          Pour toute demande liée à vos informations, consultez la
          <NuxtLink to="/confidentialite" class="font-medium text-foreground underline">politique de confidentialité</NuxtLink>
          ou la page <NuxtLink to="/contact" class="font-medium text-foreground underline">contact</NuxtLink>.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { status, accept, reject } = useAnalyticsConsent()

const consentLabel = computed(() => ({
  accepted: 'traceurs optionnels acceptés',
  rejected: 'traceurs optionnels refusés',
  pending: 'aucun choix enregistré',
}[status.value]))

useSeoMeta({
  title: 'Cookies et préférences',
  description: 'Choix de consentement et informations sur les cookies et stockages utilisés par Dounia Market Tchad.',
  ogTitle: 'Cookies et préférences | Dounia Market Tchad',
  ogDescription: 'Choix de consentement et informations sur les cookies et stockages utilisés par Dounia Market Tchad.',
})
</script>
