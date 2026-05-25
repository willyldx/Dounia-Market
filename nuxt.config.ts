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
    primary: 'emerald',
    gray: 'zinc',
  },
  googleFonts: {
    families: {
      Manrope: [400, 500, 600, 700, 800],
      Sora: [500, 600, 700],
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
      title: 'Dounia Market - Le marché de la diaspora tchadienne',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dounia Market - Envoyez des biens de qualité à votre famille au Tchad. Livraison sécurisée avec preuve photo à N\'Djamena.' },
        { name: 'theme-color', content: '#0F172A' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_OVk9WPMAEcT92D890g1QJQkhxiEnJBwKU7e68idetNj', {
                api_host: 'https://us.i.posthog.com',
                person_profiles: 'identified_only',
                capture_pageview: true // Active par défaut, intercepte l'API History pour les SPA App (Nuxt)
            });
          `
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || 'https://api.douniamarket.com/api',
      aiApiUrl: process.env.NUXT_PUBLIC_AI_API_URL || 'https://ai.douniamarket.com',
      siteUrl: process.env.SITE_URL || 'https://douniamarket.com',
      meilisearchHost: process.env.NUXT_PUBLIC_MEILISEARCH_HOST || '',
      meilisearchKey: process.env.NUXT_PUBLIC_MEILISEARCH_KEY || '',
    }
  },
  nitro: {
    compressPublicAssets: true,
  },
  experimental: {
    viewTransition: true,
  },
})
