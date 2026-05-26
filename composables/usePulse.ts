import { useCookie } from '#app'

export const usePulse = () => {
  const { hasConsent } = useAnalyticsConsent()

  const trackProductView = (productId: number, category: string) => {
    if (!hasConsent.value) return

    const pulseContext = useCookie<{ viewed_ids: number[], viewed_categories: string[] }>('tchadbox_pulse', {
      maxAge: 60 * 60 * 24 * 30,
      default: () => ({ viewed_ids: [], viewed_categories: [] })
    })

    // Only keep last 10
    const ids = pulseContext.value.viewed_ids.filter(id => id !== productId)
    ids.unshift(productId)
    if (ids.length > 10) ids.pop()

    const cats = pulseContext.value.viewed_categories.filter(c => c !== category && c)
    if (category) cats.unshift(category)
    if (cats.length > 5) cats.pop()

    pulseContext.value = {
      viewed_ids: ids,
      viewed_categories: cats
    }
  }

  return {
    trackProductView
  }
}
