// Types for Dounia Market e-commerce

// =============================================
// USER ROLES
// =============================================
export type UserRole = 'client' | 'livreur' | 'admin' | 'super_admin'

// =============================================
// PRODUCTS
// =============================================
export interface Product {
  id: string
  title: string
  handle: string
  description?: string
  subtitle?: string
  price: number
  compareAtPrice?: number
  images: string[]
  thumbnail?: string
  category?: string
  categoryHandle?: string
  inStock: boolean
  stockQuantity?: number
  variants?: ProductVariant[]
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  sku?: string
  inventory_quantity: number
}

export interface Category {
  id: string
  name: string
  handle: string
  description?: string
  icon?: string
  image?: string
  parentId?: string
  children?: Category[]
}

// =============================================
// CART
// =============================================
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  variantTitle?: string
  title: string
  price: number
  quantity: number
  thumbnail?: string
  category?: string
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  shippingTotal: number
  total: number
  itemCount: number
}

// =============================================
// USERS & DELIVERY AGENTS
// =============================================
export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  avatarUrl?: string
  createdAt?: string
  addresses: Address[]
  orders?: Order[]
}

export interface DeliveryAgent {
  id: string
  userId: string
  phone: string
  zone: string
  isActive: boolean
  totalDeliveries: number
  rating: number
  createdAt: string
  updatedAt: string
  user?: Customer
}

// =============================================
// ADDRESSES
// =============================================
export interface Address {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  province?: string
  postalCode?: string
  country: string
  phone?: string
  isDefault?: boolean
}

// =============================================
// ORDERS
// =============================================
export interface Order {
  id: string
  displayId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  items: OrderItem[]
  shippingAddress: Address | null
  billingAddress?: Address
  subtotal: number
  shippingTotal: number
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  // Delivery fields
  assignedTo?: string
  assignedAt?: string
  pickedUpAt?: string
  deliveredAt?: string
  deliveryPhoto?: string
  trackingNumber?: string
  // Customer info
  email?: string
  customerFirstName?: string
  customerLastName?: string
  customerPhone?: string
  recipientName?: string
  recipientPhone?: string
  deliveryInstructions?: string
  notes?: string
  // Joined data
  assignedAgent?: DeliveryAgent
  timeline?: OrderTimelineEvent[]
}

export interface OrderItem {
  id: string
  productId?: string
  variantId?: string
  title: string
  description?: string
  thumbnail?: string
  quantity: number
  unitPrice: number
  total: number
}

export interface OrderTimelineEvent {
  id: string
  status?: string
  title: string
  description?: string
  location?: string
  date?: string
  createdAt?: string
  completed?: boolean
}

export interface PublicOrderTimelineStep {
  key: 'payment' | 'processing' | 'shipped' | 'delivered'
  title: string
  completed: boolean
  date: string | null
  detail: string
}

export interface PublicOrderStatus {
  reference: string
  status: string
  payment_status: 'awaiting' | 'captured' | 'failed'
  fulfillment_status: string
  created_at: string | null
  delivered_at: string | null
  timeline: PublicOrderTimelineStep[]
}

export type PaystackChargeCurrency = 'NGN' | 'USD'

export interface CheckoutPaymentInitialization {
  reference: string
  commercial_amount: string
  commercial_currency: 'EUR'
  payment_display_amount: string
  payment_currency: PaystackChargeCurrency
  access_code: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'
export type PaymentStatus = 'awaiting' | 'captured' | 'refunded'
export type FulfillmentStatus = 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'shipped' | 'delivered'

// =============================================
// SHIPPING
// =============================================
export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
  description?: string
}

export interface Region {
  id: string
  name: string
  currency: string
  currencyCode: string
  countries: Country[]
  shippingOptions: ShippingOption[]
}

export interface Country {
  id: string
  name: string
  iso2: string
  iso3: string
}

// =============================================
// API RESPONSES
// =============================================
export interface ApiResponse<T> {
  data: T
  count?: number
  offset?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
  hasMore: boolean
}

// =============================================
// UI TYPES
// =============================================
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

// =============================================
// ADMIN STATS
// =============================================
export interface AdminStats {
  totalOrders: number
  pendingOrders: number
  inDeliveryOrders: number
  completedOrders: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
}

// =============================================
// FORMS
// =============================================
export interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: {
    address1: string
    address2?: string
    city: string
    country: string
  }
  recipientName: string
  recipientPhone: string
  deliveryInstructions?: string
}
