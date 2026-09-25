export type UserRole = 'client' | 'merchant' | 'livreur' | 'admin' | 'super_admin'

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

export interface ProductVariant {
  id: string
  title: string
  price?: number
  inStock?: boolean
  thumbnail?: string
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
  variants?: ProductVariant[]
  createdAt?: string
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

/** Canonical customer-facing order lifecycle steps (mapped from free-form backend statuses). */
export type OrderStatusKey = 'received' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

export interface OrderStatusInfo {
  key: OrderStatusKey
  label: string
  /** Raw backend status string, kept for display fallback/debugging. */
  raw?: string
}

export interface CustomerOrderItem {
  title: string
  quantity: number
  price?: number
  variantTitle?: string
  thumbnail?: string
}

export interface OrderTimelineEvent {
  key: OrderStatusKey
  label: string
  date?: string
  done: boolean
  active: boolean
}

export type ReturnStatusKey = 'requested' | 'approved' | 'refused' | 'in_transit' | 'refunded'

export interface OrderReturn {
  id?: string
  status: ReturnStatusKey
  label: string
  reason?: string
  createdAt?: string
}

export interface CustomerOrder {
  id: string
  reference: string
  status: OrderStatusInfo
  createdAt?: string
  updatedAt?: string
  items: CustomerOrderItem[]
  subtotal?: number
  shipping?: number
  customsTotal?: number
  total?: number
  currency?: CurrencyCode
  paymentMethod?: string
  shippingMethod?: ShippingMethod | null
  fulfillments?: OrderFulfillment[]
  recipient?: string
  phone?: string
  address?: string
  city?: string
  deliveryInstructions?: string
  returns: OrderReturn[]
}

export type ShippingType = 'local' | 'cross_border_air' | 'cross_border_sea'

export interface ShippingMethod {
  id: number
  shipping_zone_id: number
  name: string
  code: string
  delivery_fee_minor: number
  currency: CurrencyCode
  estimated_min_days: number
  estimated_max_days: number
  is_active: boolean
  shipping_type: ShippingType
  origin_country?: string | null
  customs_fee_minor: number
  tracking_url_template?: string | null
  zone?: {
    id: number
    name: string
    code: string
    country_code: string
  }
}

export interface PaymentMethodConfig {
  method: string
  label: string
  provider: string
  currencies: CurrencyCode[]
  instructions?: string
  min_amount_minor?: number | null
  max_amount_minor?: number | null
}

export interface OrderFulfillment {
  id: number
  status: 'pending' | 'dispatched' | 'customs_cleared' | 'delivered' | 'failed'
  carrier_name?: string | null
  tracking_reference?: string | null
  tracking_url_template?: string | null
  dispatch_country?: string | null
  destination_country?: string | null
  shipping_type?: ShippingType
  dispatched_at?: string | null
  customs_cleared_at?: string | null
  delivered_at?: string | null
}

export type NotificationType = 'order_status' | 'return_status'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  href: string
  createdAt?: string
}

export interface FavoriteItem {
  productId: string
  title: string
  price: number
  thumbnail?: string
  category?: string
  addedAt: string
}

