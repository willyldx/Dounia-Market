<template>
  <div class="bg-background min-h-screen pt-32 pb-24">
    <section class="max-w-7xl mx-auto px-6 mb-24">
      <div class="max-w-4xl">
        <h1 class="text-xs font-bold tracking-[0.3em] text-muted-foreground/60 uppercase mb-6">Dounia Market</h1>
        <h2 class="text-5xl md:text-7xl font-black text-foreground leading-[1.1] mb-10 tracking-tight">
          Commander ici, <br/> livrer là-bas.
        </h2>
        <p class="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
          Dounia Market permet à la diaspora tchadienne de commander à distance des produits disponibles localement pour leurs proches à N'Djamena.
        </p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-24">
      <div class="w-full h-[2px] bg-border rounded-full opacity-50"></div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mb-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h3 class="text-3xl font-black text-foreground mb-6">Un service local, <br/> simple à comprendre.</h3>
          <p class="text-lg text-muted-foreground/90 leading-relaxed font-medium">
            Vous choisissez les produits proposés dans le catalogue et renseignez le bénéficiaire à N'Djamena.
            <br/><br/>
            Notre équipe prépare la commande localement et organise la livraison lorsque l'adresse se trouve dans une zone couverte. Les zones et frais applicables seront confirmés avant l'ouverture publique.
          </p>
        </div>

        <div class="space-y-12">
          <div class="border-t-2 border-border/50 pt-8">
            <h4 class="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-brand"></span>
              Produits disponibles localement
            </h4>
            <p class="text-muted-foreground font-medium leading-relaxed">
              Le catalogue met en avant des produits destinés à être préparés sur place pour une livraison locale.
            </p>
          </div>
          <div class="border-t-2 border-border/50 pt-8">
            <h4 class="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-brand"></span>
              Livraison encadrée
            </h4>
            <p class="text-muted-foreground font-medium leading-relaxed">
              La livraison est proposée à N'Djamena selon les zones couvertes et les informations fournies pour le bénéficiaire.
            </p>
          </div>
          <div class="border-t-2 border-border/50 pt-8">
            <h4 class="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-brand"></span>
              Suivi confidentiel
            </h4>
            <p class="text-muted-foreground font-medium leading-relaxed">
              Le suivi utilise une référence de commande. Les coordonnées du bénéficiaire n'ont pas à être saisies sur la page publique de suivi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 text-center">
      <div class="bg-card rounded-lg p-12 md:p-16 border border-border shadow-sm">
        <h2 class="text-3xl font-black text-foreground tracking-tight mb-4">Choisir une commande pour un proche</h2>
        <p class="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Consultez les produits proposés; les modalités de livraison seront confirmées avant l'ouverture publique du service.
        </p>
        <NuxtLink to="/catalogue" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-8">
          Découvrir le catalogue
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Qui sommes-nous | Dounia Market',
  meta: [
    { name: 'description', content: 'Dounia Market permet à la diaspora de commander des produits disponibles localement pour livraison à N\'Djamena.' }
  ]
})
</script>
