<template>
  <div class="min-h-screen bg-background pb-24 pt-32">
    <section class="mx-auto mb-16 max-w-4xl px-6 text-center">
      <nav class="mb-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <NuxtLink to="/" class="transition-colors hover:text-foreground">Accueil</NuxtLink>
        <ChevronRightIcon class="h-4 w-4" />
        <span class="text-foreground">Juridique</span>
      </nav>
      <h1 class="mb-6 text-4xl font-black tracking-tight text-foreground md:text-5xl">Mentions légales</h1>
      <p class="text-lg font-medium text-muted-foreground/80">
        Informations relatives au site Dounia Market Tchad
      </p>
    </section>

    <div class="container-main mx-auto max-w-4xl px-6">
      <div class="rounded-lg border border-border bg-card p-8 shadow-sm md:p-12">
        <div class="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground/90 prose-a:text-accent hover:prose-a:text-brand prose-strong:text-foreground">
          <h2>1. Nom public du service</h2>
          <p>
            Le site <strong>douniamarket.com</strong> présente le service sous le nom public
            <strong>Dounia Market Tchad</strong>. Ce nom distingue le service destiné à la diaspora tchadienne.
          </p>

          <h2>2. Éditeur et publication</h2>
          <p>
            Les informations d'identification juridiquement requises de l'éditeur et du responsable de publication
            seront complétées avant l'ouverture publique du service. Pour toute demande actuelle :
            <strong>support@douniamarket.com</strong>.
          </p>

          <h2>3. Hébergement</h2>
          <p>
            Les informations relatives à l'hébergeur du site seront publiées avant l'ouverture publique du service.
          </p>

          <h2>4. Contenus du site</h2>
          <p>
            Les marques, textes, visuels et éléments techniques du site sont protégés selon les droits applicables
            à leurs titulaires. Leur reproduction ou leur réutilisation peut nécessiter une autorisation préalable.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Les informations saisies volontairement pour un compte, une demande ou une livraison locale sont utilisées
            pour le service concerné. Les détails sur les finalités, traceurs et choix utilisateur figurent dans la
            <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink>.
          </p>

          <h2>6. Cookies et mesure d'audience</h2>
          <p>
            Les stockages nécessaires à la connexion et au panier peuvent fonctionner sans traceur optionnel. La mesure
            d'audience et la personnalisation des suggestions ne sont activées qu'après accord. Consultez la page
            <NuxtLink to="/cookies">Cookies et préférences</NuxtLink> pour exercer ce choix.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour une demande liée au site ou à vos informations, écrivez à
            <strong>support@douniamarket.com</strong> ou utilisez le
            <NuxtLink to="/contact">formulaire de contact</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Mentions légales',
  description: 'Informations publiées concernant le site Dounia Market Tchad et ses choix de confidentialité.',
  ogTitle: 'Mentions légales | Dounia Market Tchad',
  ogDescription: 'Informations publiées concernant le site Dounia Market Tchad.',
})
</script>
