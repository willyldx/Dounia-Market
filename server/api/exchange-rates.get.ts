export default defineEventHandler(async (event) => {
  try {
    // On récupère les taux avec l'EUR comme base (monnaie de référence de Dounia Market)
    const response = await $fetch<any>('https://open.er-api.com/v6/latest/EUR')
    
    if (!response || response.result !== 'success') {
      throw new Error('Failed to fetch exchange rates')
    }

    return {
      success: true,
      base: 'EUR',
      rates: {
        USD: response.rates.USD,
        XAF: 655.957, // Le XAF est à taux fixe par rapport à l'EUR (parité CFA)
        XOF: 655.957,
        GBP: response.rates.GBP,
        CAD: response.rates.CAD,
        CHF: response.rates.CHF,
      },
      updated_at: response.time_last_update_utc
    }
  } catch (error) {
    console.error('[ExchangeRate] Error:', error)
    // Fallback sur des taux de secours si l'API est indisponible
    return {
      success: false,
      base: 'EUR',
      rates: {
        USD: 1.08,
        XAF: 655.957,
        XOF: 655.957,
        GBP: 0.86,
        CAD: 1.48,
        CHF: 0.94,
      }
    }
  }
})
