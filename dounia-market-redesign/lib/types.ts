export type UserRole = 'client' | 'livreur' | 'admin' | 'super_admin'

export type CurrencyCode = 'EUR' | 'USD' | 'XAF' | 'GBP' | 'CAD' | 'CHF'

export interface Address {
  id: string
  label?: string
  recipientName?: string
  phone?: string
  line1?: string
  line2?: string
  city?: string
  country?: string
  isDefault?: boolean
}

export interface AuthUser {
  id: string | number
  name: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  addresses: Address[]
  createdAt: string
}

export interface Product {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  price?: number
  thumbnail?: string
  images?: string[]
  category?: string
  categoryHandle?: string
  inStock?: boolean
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  title: string
  price: number
  thumbnail?: string
  category?: string
  quantity: number
}

export interface FavoriteItem {
  productId: string
  title: string
  price: number
  thumbnail?: string
  category?: string
  addedAt: string
}
