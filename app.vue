<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtLoadingIndicator color="#f59e0b" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <CartDrawer />
    <UNotifications />
    <CookieConsentBanner />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()
const config = useRuntimeConfig()

const brandName = 'Dounia Market Tchad'
const siteUrl = String(config.public.siteUrl || 'https://douniamarket.com').replace(/\/+$/, '')
const defaultDescription = 'Dounia Market Tchad permet à la diaspora tchadienne de consulter des produits disponibles localement pour livraison à N\'Djamena selon les zones couvertes.'
const defaultTitle = `${brandName} - Produits pour vos proches à N'Djamena`
const defaultImage = `${siteUrl}/og-default.svg`
const privatePrefixes = ['/admin', '/livreur', '/compte', '/auth', '/checkout']
const isIndexableRoute = computed(() => (
  !privatePrefixes.some(prefix => route.path === prefix || route.path.startsWith(`${prefix}/`))
  && !['/panier', '/favoris', '/suivi', '/403', '/404'].includes(route.path)
))
const canonicalUrl = computed(() => `${siteUrl}${route.path === '/' ? '/' : route.path}`)

onMounted(async () => {
  // 1. Initialiser le panier d'abord pour l'UI
  cartStore.loadFromStorage()
  
  // 2. Charger les taux en temps réel pour corriger les prix
  await cartStore.fetchRates()
  
  // 3. Charger les favoris
  favoritesStore.initialize()
})

useHead(() => ({
  titleTemplate: (titleChunk) => {
    if (!titleChunk || titleChunk === defaultTitle) return defaultTitle
    const normalized = titleChunk
      .replace(/\s*[|—-]\s*Dounia Market(?: Tchad)?\s*$/i, '')
      .trim()
    if (!normalized || normalized === brandName) return defaultTitle
    return `${normalized} | ${brandName}`
  },
  link: isIndexableRoute.value
    ? [{ key: 'canonical', rel: 'canonical', href: canonicalUrl.value }]
    : [],
  script: isIndexableRoute.value
    ? [{
        key: 'dounia-organization-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: brandName,
            alternateName: ['Dounia Market', 'douniamarket.com'],
            url: siteUrl,
            logo: `${siteUrl}/logo-icon.svg`,
            description: defaultDescription,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: brandName,
            alternateName: ['Dounia Market', 'douniamarket.com'],
            url: siteUrl,
            inLanguage: 'fr',
            publisher: { '@id': `${siteUrl}/#organization` },
          },
        ]),
      }]
    : [],
}))

useSeoMeta({
  description: defaultDescription,
  robots: () => isIndexableRoute.value ? 'index, follow' : 'noindex, nofollow, noarchive',
  googlebot: () => isIndexableRoute.value ? 'index, follow' : 'noindex, nofollow, noarchive',
  ogSiteName: brandName,
  ogType: 'website',
  ogLocale: 'fr_TD',
  ogUrl: () => canonicalUrl.value,
  ogTitle: defaultTitle,
  ogDescription: defaultDescription,
  ogImage: defaultImage,
  ogImageAlt: brandName,
  twitterCard: 'summary_large_image',
  twitterTitle: defaultTitle,
  twitterDescription: defaultDescription,
  twitterImage: defaultImage,
  twitterImageAlt: brandName,
})
</script>
