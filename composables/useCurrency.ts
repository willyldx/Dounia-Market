/**
 * useCurrency - Composable multi-devise pour Dounia Market
 *
 * Architecture A+ : conversion côté frontend, migration-ready vers microservice.
 * Le jour où on passe à l'Approche C (Python FastAPI), on change UNE fonction ici.
 */

type CurrencyCode = 'EUR' | 'USD' | 'XAF' | 'GBP' | 'CAD' | 'CHF'

interface CurrencyInfo {
  code: CurrencyCode
  name: string
  symbol: string
  flag: string
  locale: string
}

// ─── Catalogue des devises supportées ────────────────────────
const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  EUR: { code: 'EUR', name: 'Euro',            symbol: '€',    flag: '🇪🇺', locale: 'fr-FR' },
  USD: { code: 'USD', name: 'Dollar US',       symbol: '$',    flag: '🇺🇸', locale: 'en-US' },
  XAF: { code: 'XAF', name: 'Franc CFA',       symbol: 'FCFA', flag: '🇹🇩', locale: 'fr-FR' },
  GBP: { code: 'GBP', name: 'Livre Sterling',  symbol: '£',    flag: '🇬🇧', locale: 'en-GB' },
  CAD: { code: 'CAD', name: 'Dollar Canadien',  symbol: 'CA$',  flag: '🇨🇦', locale: 'en-CA' },
  CHF: { code: 'CHF', name: 'Franc Suisse',     symbol: 'CHF',  flag: '🇨🇭', locale: 'fr-CH' },
}

// ─── Mapping Pays → Devise ──────────────────────────────────
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // Afrique Centrale (zone CEMAC — taux fixe XAF)
  TD: 'XAF', CM: 'XAF', CF: 'XAF', CG: 'XAF', GA: 'XAF', GQ: 'XAF',
  // Afrique de l'Ouest (zone UEMOA — XOF est indexé pareil sur EUR)
  SN: 'XAF', CI: 'XAF', ML: 'XAF', BF: 'XAF', NE: 'XAF', TG: 'XAF', BJ: 'XAF', GW: 'XAF',
  // Europe (Zone Euro)
  FR: 'EUR', DE: 'EUR', BE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', LU: 'EUR', GR: 'EUR',
  // Amérique du Nord
  US: 'USD',
  CA: 'CAD',
  // Europe hors Euro
  GB: 'GBP',
  CH: 'CHF',
}

const STORAGE_KEY = 'tchadbox_currency'
const COUNTRY_STORAGE_KEY = 'tchadbox_country'

export function useCurrency() {
  const cartStore = useCartStore()

  /** Liste des devises pour le sélecteur */
  const currencies = Object.values(CURRENCIES)

  /** Devise active */
  const activeCurrency = computed<CurrencyInfo>(() => {
    return CURRENCIES[cartStore.currency] || CURRENCIES.EUR
  })

  /** Changer de devise */
  function setCurrency(code: CurrencyCode) {
    cartStore.setCurrency(code)
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }

  /** Changer de devise à partir du pays */
  function setCurrencyFromCountry(countryCode: string) {
    const upper = countryCode.toUpperCase()
    const currency = COUNTRY_TO_CURRENCY[upper] || 'EUR'
    setCurrency(currency)
    if (process.client) {
      localStorage.setItem(COUNTRY_STORAGE_KEY, upper)
    }
  }

  /** Récupérer le pays de l'utilisateur */
  function getUserCountry(): string | null {
    if (!process.client) return null
    return localStorage.getItem(COUNTRY_STORAGE_KEY)
  }

  /** Auto-détection par IP (appelé 1 seule fois, pour les invités) */
  async function autoDetect() {
    if (!process.client) return

    // 1. Déjà une devise sauvegardée ? On la reprend
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in CURRENCIES) {
      cartStore.setCurrency(saved as CurrencyCode)
      return
    }

    // 2. Utilisateur connecté avec un pays sauvegardé ?
    try {
      const savedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY)
      if (savedCountry) {
        setCurrencyFromCountry(savedCountry)
        return
      }
    } catch { /* ignore */ }

    // 3. Auto-détection par IP (gratuit, 1000 req/jour)
    try {
      const geo = await $fetch<{ country_code: string }>('https://ipapi.co/json/', {
        timeout: 3000,
      })
      if (geo?.country_code) {
        setCurrencyFromCountry(geo.country_code)
        return
      }
    } catch {
      // Fallback silencieux — EUR par défaut
    }

    // 4. Défaut : EUR
    setCurrency('EUR')
  }

  /** Mapper un pays vers sa devise (utile pour le formulaire inscription) */
  function currencyForCountry(countryCode: string): CurrencyCode {
    return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'EUR'
  }

  return {
    currencies,
    activeCurrency,
    setCurrency,
    setCurrencyFromCountry,
    getUserCountry,
    autoDetect,
    currencyForCountry,
    CURRENCIES,
    COUNTRY_TO_CURRENCY,
  }
}
