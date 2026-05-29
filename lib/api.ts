/**
 * Client/server fetch wrapper for the Dounia Market Laravel API.
 * The backend is unchanged: same base URL, same Bearer token cookie.
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.douniamarket.com/api'
).replace(/\/+$/, '')

export const AUTH_COOKIE = 'dounia_market_auth_token'

export class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Read the Bearer token from the browser cookie (client only). */
export function getClientToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)dounia_market_auth_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function setClientToken(token: string | null) {
  if (typeof document === 'undefined') return
  if (token) {
    const maxAge = 60 * 60 * 24 * 30
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  }
}

interface RequestOptions {
  method?: string
  body?: any
  query?: Record<string, string | number | undefined>
  token?: string | null
  /** Attach the client cookie token automatically. */
  auth?: boolean
  /** Next.js fetch caching hints (server usage). */
  cache?: RequestCache
  revalidate?: number
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  let clean = path.replace(/^\/+/, '')
  if (!clean.startsWith('api/')) clean = `api/${clean}`
  const base = API_URL.replace(/\/api$/, '')
  const url = new URL(`${base}/${clean}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function apiFetch<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = opts.token ?? (opts.auth ? getClientToken() : null)
  const isForm = typeof FormData !== 'undefined' && opts.body instanceof FormData

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (!isForm && opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const init: RequestInit & { next?: { revalidate?: number } } = {
    method: opts.method || 'GET',
    headers,
  }
  if (opts.body !== undefined) init.body = isForm ? opts.body : JSON.stringify(opts.body)
  if (opts.cache) init.cache = opts.cache
  if (opts.revalidate !== undefined) init.next = { revalidate: opts.revalidate }

  const res = await fetch(buildUrl(path, opts.query), init)
  const text = await res.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.errors?.email?.[0] || data.errors?.code?.[0])) ||
      `Erreur ${res.status}`
    throw new ApiError(message, res.status, data)
  }
  return data as T
}
