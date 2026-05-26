export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  if (String(config.public.searchIndexingEnabled) !== 'true') {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
  }
})
