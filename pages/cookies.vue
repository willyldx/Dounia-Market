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
        <div class="mt-5 space-y-3 sm:hidden">
          <dl
            v-for="storage in storageRows"
            :key="storage.name"
            class="rounded-md border border-border/70 bg-background p-4 text-sm"
          >
            <dt class="break-all font-mono text-xs text-foreground">{{ storage.name }}</dt>
            <dd class="mt-3 text-muted-foreground">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">Finalité</span>
              {{ storage.purpose }}
            </dd>
            <dd class="mt-3 text-muted-foreground">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">Stockage / durée</span>
              {{ storage.retention }}
            </dd>
            <dd class="mt-3" :class="storage.optional ? 'font-medium text-foreground' : 'text-muted-foreground'">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">Consentement</span>
              {{ storage.consent }}
            </dd>
          </dl>
        </div>
        <div class="mt-5 hidden overflow-x-auto sm:block">
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
              <tr
                v-for="(storage, index) in storageRows"
                :key="storage.name"
                :class="index < storageRows.length - 1 ? 'border-b border-border/70' : ''"
              >
                <td class="py-4 pr-4 font-mono text-xs text-foreground">{{ storage.name }}</td>
                <td class="py-4 pr-4">{{ storage.purpose }}</td>
                <td class="py-4 pr-4">{{ storage.retention }}</td>
                <td class="py-4" :class="storage.optional ? 'font-medium text-foreground' : ''">{{ storage.consent }}</td>
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

const storageRows = [
  {
    name: 'dounia_market_auth_token',
    purpose: 'Connexion sécurisée à votre compte',
    retention: 'Cookie, jusqu\'à 30 jours',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'dounia_market_cart',
    purpose: 'Conserver le panier demandé par l\'utilisateur',
    retention: 'Stockage local, jusqu\'à suppression par le navigateur',
    consent: 'Nécessaire au panier',
    optional: false,
  },
  {
    name: 'dounia_market_favorites',
    purpose: 'Conserver les favoris choisis par l\'utilisateur',
    retention: 'Stockage local, jusqu\'à suppression par le navigateur',
    consent: 'Fonction demandée par l\'utilisateur',
    optional: false,
  },
  {
    name: 'dounia_market_currency / dounia_market_country',
    purpose: 'Mémoriser une préférence choisie volontairement',
    retention: 'Stockage local, jusqu\'à suppression par le navigateur',
    consent: 'Préférence fonctionnelle',
    optional: false,
  },
  {
    name: 'dounia_market_analytics_consent',
    purpose: 'Mémoriser accepter ou refuser',
    retention: 'Stockage local, 12 mois',
    consent: 'Nécessaire au respect du choix',
    optional: false,
  },
  {
    name: 'dounia_market_visitor_id',
    purpose: 'Identifier un panier invité lorsque ce parcours est utilisé',
    retention: 'Stockage local, jusqu\'à suppression par le navigateur',
    consent: 'Nécessaire au panier invité',
    optional: false,
  },
  {
    name: 'chunk-reload-*',
    purpose: 'Éviter une boucle de rechargement en cas d\'erreur technique',
    retention: 'Stockage de session, effacé à la fin de la session',
    consent: 'Sécurité de fonctionnement',
    optional: false,
  },
  {
    name: 'ph_*',
    purpose: 'Mesure d\'audience via PostHog',
    retention: 'Cookie / stockage local, selon configuration PostHog; supprimé au refus',
    consent: 'Accord requis',
    optional: true,
  },
  {
    name: 'dounia_market_pulse',
    purpose: 'Personnaliser les suggestions à partir des produits consultés',
    retention: 'Cookie, 30 jours; supprimé au refus',
    consent: 'Accord requis',
    optional: true,
  },
] as const

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
