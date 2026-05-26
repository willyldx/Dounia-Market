export default defineNuxtPlugin(() => {
  const { restore } = useAnalyticsConsent()

  restore()
})
