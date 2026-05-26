type AnalyticsConsent = 'pending' | 'accepted' | 'rejected'

const CONSENT_KEY = 'dounia_market_analytics_consent'
const CONSENT_DURATION_MS = 365 * 24 * 60 * 60 * 1000
const POSTHOG_PROJECT_KEY = 'phc_OVk9WPMAEcT92D890g1QJQkhxiEnJBwKU7e68idetNj'

type StoredConsent = {
  status: Exclude<AnalyticsConsent, 'pending'>
  savedAt: number
}

type PostHogClient = {
  opt_in_capturing?: () => void
  opt_out_capturing?: () => void
  reset?: () => void
}

function getPostHogClient(): PostHogClient | undefined {
  if (!import.meta.client) return undefined
  return (window as Window & { posthog?: PostHogClient }).posthog
}

function clearAnalyticsStorage() {
  if (!import.meta.client) return

  document.cookie.split(';').forEach((rawCookie) => {
    const name = rawCookie.split('=')[0]?.trim()
    if (name?.startsWith('ph_')) {
      document.cookie = `${name}=; Max-Age=0; path=/`
      document.cookie = `${name}=; Max-Age=0; path=/; domain=douniamarket.com`
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.douniamarket.com`
    }
  })

  Object.keys(localStorage)
    .filter(key => key.startsWith('ph_'))
    .forEach(key => localStorage.removeItem(key))
}

function clearOptionalPersonalisation() {
  if (!import.meta.client) return

  const pulseCookie = useCookie('dounia_market_pulse', { path: '/' })
  pulseCookie.value = null
}

export function useAnalyticsConsent() {
  const status = useState<AnalyticsConsent>('analytics-consent', () => 'pending')
  const isInitialized = useState<boolean>('analytics-initialized', () => false)

  const hasConsent = computed(() => status.value === 'accepted')
  const needsChoice = computed(() => status.value === 'pending')

  function initializeAnalytics() {
    if (!import.meta.client || !hasConsent.value) return

    const existingClient = getPostHogClient()
    if (existingClient) {
      existingClient.opt_in_capturing?.()
      isInitialized.value = true
      return
    }

    if (isInitialized.value) return

    const loader = document.createElement('script')
    loader.id = 'dounia-posthog-loader'
    loader.textContent = `
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${POSTHOG_PROJECT_KEY}', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: true
      });
    `
    document.head.appendChild(loader)
    isInitialized.value = true
  }

  function persist(nextStatus: Exclude<AnalyticsConsent, 'pending'>) {
    if (!import.meta.client) return

    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      status: nextStatus,
      savedAt: Date.now(),
    } satisfies StoredConsent))
  }

  function accept() {
    status.value = 'accepted'
    persist('accepted')
    initializeAnalytics()
  }

  function reject() {
    status.value = 'rejected'
    persist('rejected')
    getPostHogClient()?.opt_out_capturing?.()
    getPostHogClient()?.reset?.()
    clearAnalyticsStorage()
    clearOptionalPersonalisation()
  }

  function reopen() {
    status.value = 'pending'
    if (!import.meta.client) return

    localStorage.removeItem(CONSENT_KEY)
    getPostHogClient()?.opt_out_capturing?.()
    getPostHogClient()?.reset?.()
    clearAnalyticsStorage()
    clearOptionalPersonalisation()
  }

  function restore() {
    if (!import.meta.client) return

    const storedValue = localStorage.getItem(CONSENT_KEY)
    if (!storedValue) {
      clearAnalyticsStorage()
      clearOptionalPersonalisation()
      return
    }

    try {
      const stored = JSON.parse(storedValue) as StoredConsent
      if (
        !['accepted', 'rejected'].includes(stored.status)
        || !Number.isFinite(stored.savedAt)
        || Date.now() - stored.savedAt > CONSENT_DURATION_MS
      ) {
        localStorage.removeItem(CONSENT_KEY)
        clearAnalyticsStorage()
        clearOptionalPersonalisation()
        return
      }

      status.value = stored.status
      if (stored.status === 'accepted') {
        initializeAnalytics()
      } else {
        getPostHogClient()?.opt_out_capturing?.()
        clearAnalyticsStorage()
        clearOptionalPersonalisation()
      }
    } catch {
      localStorage.removeItem(CONSENT_KEY)
      clearAnalyticsStorage()
      clearOptionalPersonalisation()
    }
  }

  return {
    status: readonly(status),
    hasConsent,
    needsChoice,
    accept,
    reject,
    reopen,
    restore,
    initializeAnalytics,
  }
}
