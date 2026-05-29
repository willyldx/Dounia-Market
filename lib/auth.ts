import { apiFetch } from './api'
import type { Address, AuthUser } from './types'

export function parseUser(apiUser: any): AuthUser {
  const nameParts = (apiUser.name || '').split(' ')
  return {
    id: apiUser.id,
    name: apiUser.name || '',
    email: apiUser.email || '',
    firstName: apiUser.first_name || nameParts[0] || '',
    lastName: apiUser.last_name || nameParts.slice(1).join(' ') || '',
    phone: apiUser.phone || '',
    role: apiUser.role || 'client',
    addresses: apiUser.addresses || [],
    createdAt: apiUser.created_at || new Date().toISOString(),
  }
}

export function sendOtp(email: string, firstName?: string, lastName?: string) {
  return apiFetch<{ message: string }>('auth/send-otp', {
    method: 'POST',
    body: { email, first_name: firstName, last_name: lastName },
  })
}

export function verifyOtp(
  email: string,
  code: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
) {
  return apiFetch<{ token: string; user: any }>('auth/verify-otp', {
    method: 'POST',
    body: { email, code, first_name: firstName, last_name: lastName, phone },
  })
}

export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: any }>('auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function logoutRequest(token: string) {
  return apiFetch('auth/logout', { method: 'POST', token }).catch(() => {})
}

export function fetchUser(token: string) {
  return apiFetch<{ user: any }>('user', { token })
}

export function patchUser(token: string, payload: Record<string, unknown>) {
  return apiFetch<{ user: any }>('user', { method: 'PATCH', token, body: payload })
}

export function saveAddresses(token: string, addresses: Address[]) {
  return patchUser(token, { addresses })
}

/** Where to send a user after login, based on role. */
export function redirectPathForRole(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin'
    case 'livreur':
      return '/livreur'
    default:
      return '/compte'
  }
}
