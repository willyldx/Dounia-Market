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
          Cookies et Préférences
        </h1>
        <p class="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
          Dounia Market n'utilise que les cookies indispensables à votre panier et à votre sécurité. Les outils de statistiques ne s'activent qu'avec votre accord.
        </p>
      </section>

      <!-- Paramètres de consentement -->
      <div class="mb-10 rounded-3xl border border-border bg-card p-8 shadow-premium sm:p-12">
        <h2 class="mb-4 text-2xl font-bold text-foreground">Votre choix actuel</h2>
        <div class="mb-8 flex items-center gap-3">
          <div 
            class="flex h-3 w-3 rounded-full"
            :class="{
              'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]': status === 'accepted',
              'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]': status === 'rejected',
              'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]': status === 'pending'
            }"
          ></div>
          <p class="text-base font-bold text-foreground">
            Statut : <span class="uppercase tracking-wider text-muted-foreground">{{ consentLabel }}</span>
          </p>
        </div>
        
        <div class="flex flex-col gap-4 sm:flex-row">
          <button 
            type="button" 
            class="btn-primary flex-1" 
            @click="accept"
          >
            <span>Accepter les cookies d'analyse</span>
          </button>
          <button 
            type="button" 
            class="btn-outline flex-1" 
            @click="reject"
          >
            Refuser les cookies d'analyse
          </button>
        </div>
      </div>

      <!-- Détails techniques -->
      <div class="rounded-3xl border border-border bg-card p-8 shadow-premium sm:p-12">
        <h2 class="mb-8 text-2xl font-bold text-foreground">Détail des stockages utilisés</h2>
        
        <div class="space-y-6 sm:hidden">
          <dl
            v-for="storage in storageRows"
            :key="storage.name"
            class="rounded-xl border border-border bg-[#faf8f5] p-5"
          >
            <dt class="mb-4 font-mono text-xs font-bold text-amber-700">{{ storage.name }}</dt>
            <dd class="mb-3 text-sm text-muted-foreground">
              <span class="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground">Finalité</span>
              {{ storage.purpose }}
            </dd>
            <dd class="mb-3 text-sm text-muted-foreground">
              <span class="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground">Durée de vie</span>
              {{ storage.retention }}
            </dd>
            <dd class="text-sm">
              <span class="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground">Requis ?</span>
              <span 
                class="inline-block rounded-md px-2 py-1 text-xs font-bold"
                :class="storage.optional ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'"
              >
                {{ storage.consent }}
              </span>
            </dd>
          </dl>
        </div>
        
        <div class="hidden overflow-x-auto rounded-xl border border-border sm:block">
          <table class="w-full text-left text-sm">
            <thead class="bg-[#faf8f5]">
              <tr class="text-xs uppercase tracking-wider text-muted-foreground">
                <th class="p-4 font-bold">Traceur technique</th>
                <th class="p-4 font-bold">À quoi ça sert ?</th>
                <th class="p-4 font-bold">Durée</th>
                <th class="p-4 font-bold text-right">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-foreground">
              <tr
                v-for="storage in storageRows"
                :key="storage.name"
                class="transition-colors hover:bg-muted/30"
              >
                <td class="p-4 font-mono text-xs text-amber-700">{{ storage.name }}</td>
                <td class="p-4 font-medium">{{ storage.purpose }}</td>
                <td class="p-4 text-muted-foreground">{{ storage.retention }}</td>
                <td class="p-4 text-right">
                  <span 
                    class="inline-block whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
                    :class="storage.optional ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'"
                  >
                    {{ storage.optional ? 'Optionnel' : 'Requis' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const { status, accept, reject } = useAnalyticsConsent()

const storageRows = [
  {
    name: 'dounia_market_auth_token',
    purpose: 'Maintenir votre connexion sécurisée.',
    retention: 'Jusqu\'à 30 jours',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'dounia_market_cart',
    purpose: 'Mémoriser les articles de votre panier.',
    retention: 'Stockage local',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'dounia_market_favorites',
    purpose: 'Sauvegarder vos produits favoris.',
    retention: 'Stockage local',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'dounia_market_visitor_id',
    purpose: 'Identifier votre session anonyme pour le panier.',
    retention: 'Stockage local',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'dounia_market_analytics_consent',
    purpose: 'Mémoriser votre choix d\'accepter ou refuser les cookies.',
    retention: '12 mois',
    consent: 'Nécessaire',
    optional: false,
  },
  {
    name: 'ph_*',
    purpose: 'Mesurer l\'audience de manière anonyme (PostHog).',
    retention: 'Cookie local',
    consent: 'Accord requis',
    optional: true,
  },
  {
    name: 'dounia_market_pulse',
    purpose: 'Personnaliser les suggestions selon les visites.',
    retention: '30 jours',
    consent: 'Accord requis',
    optional: true,
  },
] as const

const consentLabel = computed(() => ({
  accepted: 'Acceptés',
  rejected: 'Refusés',
  pending: 'En attente de choix',
}[status.value]))

useSeoMeta({
  title: 'Cookies et préférences | Dounia Market Tchad',
  description: 'Gérez vos préférences de cookies sur Dounia Market Tchad.',
  robots: 'noindex, nofollow, noarchive',
})
</script>
