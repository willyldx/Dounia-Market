const siteUrl = process.env.SITE_URL || 'https://douniamarket.com'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/google-fonts',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  ui: {
    primary: 'amber',
    gray: 'zinc',
  },
  googleFonts: {
    families: {
      Manrope: [400, 500, 600, 700, 800],
      Sora: [400, 500, 600, 700, 800],
    },
    display: 'swap',
  },
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    domains: ['api.douniamarket.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.douniamarket.com',
        pathname: '/storage/**',
      },
    ],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Dounia Market Tchad - Produits pour vos proches à N\'Djamena',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dounia Market Tchad permet à la diaspora tchadienne de consulter des produits disponibles localement pour livraison à N\'Djamena selon les zones couvertes.' },
        { name: 'theme-color', content: '#15213B' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || 'https://api.douniamarket.com/api',
      aiApiUrl: process.env.NUXT_PUBLIC_AI_API_URL || 'https://ai.douniamarket.com',
      siteUrl,
      meilisearchHost: process.env.NUXT_PUBLIC_MEILISEARCH_HOST || '',
      meilisearchKey: process.env.NUXT_PUBLIC_MEILISEARCH_KEY || '',
      checkoutPaymentEnabled: process.env.NUXT_PUBLIC_CHECKOUT_PAYMENT_ENABLED === 'true',
      searchIndexingEnabled: process.env.NUXT_PUBLIC_SEARCH_INDEXING_ENABLED === 'true',
    }
  },
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/admin': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/admin/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/livreur': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/livreur/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/compte': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/compte/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/auth': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/checkout': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/checkout/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/panier': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/favoris': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/suivi': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/403': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/404': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
  },
  experimental: {
    viewTransition: true,
  },
})
