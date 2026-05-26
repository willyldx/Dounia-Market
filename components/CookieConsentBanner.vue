<template>
  <ClientOnly>
    <aside
      v-if="needsChoice"
      class="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-lg border border-border bg-card p-5 shadow-xl sm:p-6"
      aria-label="Choix des cookies"
    >
      <h2 class="text-base font-semibold text-foreground">Cookies optionnels</h2>
      <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
        Dounia Market Tchad utilise des traceurs de mesure d'audience et de personnalisation uniquement avec votre accord.
        Les cookies nécessaires au panier et à la connexion restent disponibles.
      </p>
      <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          class="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          @click="accept"
        >
          Accepter
        </button>
        <button
          type="button"
          class="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-muted"
          @click="reject"
        >
          Refuser
        </button>
        <NuxtLink to="/cookies" class="inline-flex h-11 items-center justify-center px-3 text-sm font-medium text-muted-foreground underline hover:text-foreground">
          En savoir plus
        </NuxtLink>
      </div>
    </aside>
  </ClientOnly>
</template>

<script setup lang="ts">
const { needsChoice, accept, reject } = useAnalyticsConsent()
</script>
