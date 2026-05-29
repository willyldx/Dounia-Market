import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'dounia_market_auth_token'
// Routes requiring a logged-in user (role is enforced in the layouts via /user).
const PROTECTED = ['/admin', '/livreur', '/compte', '/checkout']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (!needsAuth) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `?redirect=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/livreur/:path*', '/compte/:path*', '/checkout/:path*'],
}
